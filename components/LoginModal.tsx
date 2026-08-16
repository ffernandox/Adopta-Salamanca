"use client";

import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Mail, Eye, EyeOff, AlertTriangle, CheckCircle, Phone, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ============================================================
// SCHEMAS
// ============================================================
const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "El correo es requerido" })
    .email({ message: "El formato es incorrecto, verifica que lleve @ y dominio (ej. .com)" }),
  password: z.string().min(1, { message: "La contraseña es requerida" }),
});

const registerSchema = z
  .object({
    nombres: z
      .string()
      .min(2, { message: "Mínimo 2 caracteres" })
      .max(50)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "Solo letras y espacios" }),
    apellidos: z
      .string()
      .min(2, { message: "Mínimo 2 caracteres" })
      .max(50)
      .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "Solo letras y espacios" }),
    telefono: z
      .string()
      .regex(/^\d{3}\s\d{3}\s\d{4}$/, { message: "Formato requerido: 464 444 4444 (10 dígitos)" }),
    email: z
      .string()
      .min(1, { message: "El correo es requerido" })
      .email({ message: "El formato es incorrecto, verifica que lleve @ y dominio (ej. .com)" }),
    password: z
      .string()
      .min(8, { message: "Mínimo 8 caracteres" })
      .regex(/[A-Z]/, { message: "Debe contener al menos una mayúscula" })
      .regex(/[0-9]/, { message: "Debe contener al menos un número" })
      .regex(/[@#%&]/, { message: "Agrega un carácter especial (@, #, %, &)" }),
    confirmPassword: z.string().min(1, { message: "Confirma tu contraseña" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "signin" | "signup";
}

const REMEMBER_KEY = "adopta_remembered_email";

// ============================================================
// HELPER: estado visual de un campo
// "idle" | "valid" | "invalid"
// ============================================================
type FieldState = "idle" | "valid" | "invalid";

function getFieldState(value: string, hasError: boolean, touched: boolean): FieldState {
  if (!touched || value === "") return "idle";
  if (hasError) return "invalid";
  return "valid";
}

function fieldClass(state: FieldState, extra?: string) {
  const base = `w-full border text-gray-900 text-sm rounded-xl p-3 pl-4 outline-none transition-all placeholder:text-gray-400 ${extra ?? ""}`;
  if (state === "valid") return `${base} bg-green-50 border-green-400 focus:border-green-500`;
  if (state === "invalid") return `${base} bg-red-50 border-red-400 focus:border-red-500`;
  return `${base} bg-gray-50 border-gray-100 focus:bg-white focus:shadow-md focus:border-blue-500`;
}

// Ícono derecho del campo (palomita verde, X roja, o ícono normal)
function FieldIcon({ state, icon }: { state: FieldState; icon: React.ReactNode }) {
  if (state === "valid") return <Check size={16} className="text-green-500" />;
  if (state === "invalid") return <AlertTriangle size={14} className="text-red-400" />;
  return <>{icon}</>;
}

export default function LoginModal({ isOpen, onClose, initialTab = "signin" }: LoginModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(initialTab);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [credentialsError, setCredentialsError] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const savedEmail = typeof window !== "undefined" ? localStorage.getItem(REMEMBER_KEY) ?? "" : "";
  const [rememberMe, setRememberMe] = useState(!!savedEmail);

  // ---- Formulario Login ----
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // validar en tiempo real
    defaultValues: { email: savedEmail, password: "" },
  });
  const loginValues = useWatch({ control: loginForm.control });
  const loginTouched = loginForm.formState.touchedFields;

  // ---- Formulario Registro ----
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // validar en tiempo real
  });
  const regValues = useWatch({ control: registerForm.control });
  const regTouched = registerForm.formState.touchedFields;
  const regErrors = registerForm.formState.errors;

  // Estados visuales de cada campo
  const ls = {
    email: getFieldState(loginValues.email ?? "", !!loginForm.formState.errors.email, !!loginTouched.email),
    password: getFieldState(loginValues.password ?? "", !!loginForm.formState.errors.password, !!loginTouched.password),
  };

  const rs = {
    nombres: getFieldState(regValues.nombres ?? "", !!regErrors.nombres, !!regTouched.nombres),
    apellidos: getFieldState(regValues.apellidos ?? "", !!regErrors.apellidos, !!regTouched.apellidos),
    telefono: getFieldState(regValues.telefono ?? "", !!regErrors.telefono, !!regTouched.telefono),
    email: getFieldState(regValues.email ?? "", !!regErrors.email, !!regTouched.email),
    password: getFieldState(regValues.password ?? "", !!regErrors.password, !!regTouched.password),
    confirmPassword: getFieldState(regValues.confirmPassword ?? "", !!regErrors.confirmPassword, !!regTouched.confirmPassword),
  };

  // ============================================================
  // Formato de teléfono automático: 4644444444 → 464 444 4444
  // ============================================================
  const formatTelefono = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
  };

  // Hint del teléfono según cuántos dígitos lleva
  const telefonoDigits = (regValues.telefono ?? "").replace(/\D/g, "");
  const telefonoHint = () => {
    if (rs.telefono === "valid") return null;
    if (telefonoDigits.length === 0) return "Ingresa 10 dígitos: 464 444 4444";
    if (telefonoDigits.length < 10) return `${telefonoDigits.length}/10 dígitos — sigue escribiendo`;
    return null;
  };

  // ============================================================
  // LOGIN
  // ============================================================
  const onLogin = async (data: LoginFormValues) => {
    setAuthError(null);
    setCredentialsError(false);

    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user) {
      setCredentialsError(true);
      return;
    }

    if (!authData.user.email_confirmed_at) {
      await supabase.auth.signOut();
      setAuthError("Debes verificar tu correo antes de iniciar sesión. Revisa tu bandeja de entrada.");
      return;
    }

    if (rememberMe) {
      localStorage.setItem(REMEMBER_KEY, data.email);
    } else {
      localStorage.removeItem(REMEMBER_KEY);
    }

    const { data: perfil } = await supabase
      .from("perfiles")
      .select("rol")
      .eq("id", authData.user.id)
      .single();

    loginForm.reset();
    setCredentialsError(false);
    onClose();

    if (perfil?.rol === "admin") {
      router.push("/admin");
    } else {
      router.push("/website");
    }
  };

  // ============================================================
  // REGISTRO
  // ============================================================
  const onRegister = async (data: RegisterFormValues) => {
    setAuthError(null);
    setSuccessMessage(null);

    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { nombres: data.nombres, apellidos: data.apellidos, telefono: data.telefono },
      },
    });

    if (error) {
      setAuthError(
        error.message.includes("already registered")
          ? "Este correo ya está registrado. Intenta iniciar sesión."
          : error.message
      );
      return;
    }

    if (authData.user) {
      await supabase.from("perfiles").upsert({
        id: authData.user.id,
        nombre: data.nombres,
        apellido: data.apellidos,
        telefono: data.telefono,
        rol: "user",
      });
    }

    registerForm.reset();
    setSuccessMessage(`¡Cuenta creada! Te enviamos un correo de verificación a ${data.email}. Actívala antes de iniciar sesión.`);
  };

  const switchTab = (tab: "signin" | "signup") => {
    setActiveTab(tab);
    setAuthError(null);
    setSuccessMessage(null);
    setCredentialsError(false);
    registerForm.reset();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-[900px] flex overflow-hidden z-10 animate-in zoom-in-95 duration-300 min-h-[600px]">

        {/* === COLUMNA IZQUIERDA === */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative overflow-y-auto max-h-[90vh]">
          <button onClick={onClose} className="absolute top-5 left-5 md:hidden p-2 text-gray-400 hover:text-black">
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 bg-[#2D2A26] rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900">Adopta Salamanca</h2>
          </div>

          <h3 className="text-sm text-gray-500 mb-5 font-medium">
            {activeTab === "signin" ? "¡Hola de nuevo! Te extrañamos." : "Crea tu cuenta y adopta."}
          </h3>

          {/* Tabs */}
          <div className="flex bg-gray-100 p-1 rounded-full mb-5">
            <button type="button" onClick={() => switchTab("signin")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === "signin" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Iniciar Sesión
            </button>
            <button type="button" onClick={() => switchTab("signup")}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === "signup" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              Registrarse
            </button>
          </div>

          {/* ============================================================
              FORMULARIO LOGIN
          ============================================================ */}
          {activeTab === "signin" && (
            <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-3">

              {/* Error credenciales */}
              {credentialsError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  Las credenciales son incorrectas, intenta de nuevo.
                </div>
              )}

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  {authError}
                </div>
              )}

              {/* Email */}
              <div>
                <div className="relative">
                  <input
                    {...loginForm.register("email")}
                    type="email"
                    placeholder="Correo electrónico"
                    className={fieldClass(credentialsError ? "invalid" : ls.email, "pr-10")}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <FieldIcon state={credentialsError ? "invalid" : ls.email} icon={<Mail size={16} className="text-gray-400" />} />
                  </div>
                </div>
                {loginForm.formState.errors.email && (
                  <p className="mt-1 text-[10px] text-red-500 font-medium">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              {/* Contraseña */}
              <div>
                <div className="relative">
                  <input
                    {...loginForm.register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Contraseña"
                      autoComplete="current-password"

                    className={fieldClass(credentialsError ? "invalid" : "idle", "pr-10")}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Recordarme */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none" onClick={() => setRememberMe(!rememberMe)}>
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${rememberMe ? "bg-blue-600 border-blue-600" : "border-gray-300 bg-white"}`}>
                    {rememberMe && (
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <span className="text-gray-500">Recordarme</span>
                </label>
                <a href="#" className="text-blue-500 hover:underline font-medium">¿Olvidaste tu contraseña?</a>
              </div>

              <button disabled={loginForm.formState.isSubmitting} type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-sm px-5 py-3 transition-transform active:scale-[0.98] disabled:opacity-70 mt-2 flex justify-center items-center gap-2">
                {loginForm.formState.isSubmitting
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Procesando...</>
                  : "Ingresar"}
              </button>

              <div className="relative flex py-2 items-center mt-1">
                <div className="flex-grow border-t border-gray-200" />
                <span className="flex-shrink-0 mx-3 text-gray-400 text-[10px] uppercase tracking-wider">O continúa con</span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              <div className="flex gap-2">
                <button type="button" className="flex-1 flex items-center justify-center bg-black text-white rounded-xl py-2.5 hover:bg-gray-800 transition text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.91-1.12 1.5.09 2.3.64 3.1 1.76-1.63.97-1.37 3.5.7 4.5-.48 2.05-1.18 3.98-2.79 7.09zM12.03 5.39c.27-1.74 1.35-3.06 2.85-3.39.26 1.83-1.09 3.42-2.85 3.39z"/>
                  </svg>
                  Apple
                </button>
                <button type="button" className="flex-1 flex items-center justify-center bg-white border border-gray-200 text-gray-700 rounded-xl py-2.5 hover:bg-gray-50 transition text-sm font-medium">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
              </div>
            </form>
          )}

          {/* ============================================================
              FORMULARIO REGISTRO
          ============================================================ */}
          {activeTab === "signup" && !successMessage && (
            <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-3">

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-semibold rounded-xl flex items-start gap-2">
                  <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                  {authError}
                </div>
              )}

              {/* Nombres y Apellidos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <input {...registerForm.register("nombres")} type="text" placeholder="Nombre(s)"
                    className={fieldClass(rs.nombres)} />
                  {regErrors.nombres
                    ? <p className="mt-1 text-[10px] text-red-500 font-medium">{regErrors.nombres.message}</p>
                    : rs.nombres === "valid" && <p className="mt-1 text-[10px] text-green-600 font-medium flex items-center gap-1"><Check size={10}/>Nombre correcto</p>
                  }
                </div>
                <div>
                  <input {...registerForm.register("apellidos")} type="text" placeholder="Apellidos"
                    className={fieldClass(rs.apellidos)} />
                  {regErrors.apellidos
                    ? <p className="mt-1 text-[10px] text-red-500 font-medium">{regErrors.apellidos.message}</p>
                    : rs.apellidos === "valid" && <p className="mt-1 text-[10px] text-green-600 font-medium flex items-center gap-1"><Check size={10}/>Apellidos correctos</p>
                  }
                </div>
              </div>

              {/* Teléfono */}
              <div>
                <div className="relative">
                  <input
                    {...registerForm.register("telefono")}
                    type="tel"
                    placeholder="464 444 4444"
                    maxLength={12}
                    onChange={(e) => {
                      const formatted = formatTelefono(e.target.value);
                      e.target.value = formatted;
                      registerForm.setValue("telefono", formatted, { shouldValidate: true, shouldTouch: true });
                    }}
                    className={fieldClass(rs.telefono, "pr-10")}
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <FieldIcon state={rs.telefono} icon={<Phone size={16} className="text-gray-400" />} />
                  </div>
                </div>
                {regErrors.telefono
                  ? <p className="mt-1 text-[10px] text-red-500 font-medium">{regErrors.telefono.message}</p>
                  : rs.telefono === "valid"
                    ? <p className="mt-1 text-[10px] text-green-600 font-medium flex items-center gap-1"><Check size={10}/>Teléfono correcto</p>
                    : telefonoHint() && <p className="mt-1 text-[10px] text-gray-400 font-medium">{telefonoHint()}</p>
                }
              </div>

              {/* Email */}
              <div>
                <div className="relative">
                  <input {...registerForm.register("email")} type="email" placeholder="Correo electrónico"
                    className={fieldClass(rs.email, "pr-10")} />
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <FieldIcon state={rs.email} icon={<Mail size={16} className="text-gray-400" />} />
                  </div>
                </div>
                {regErrors.email
                  ? <p className="mt-1 text-[10px] text-red-500 font-medium">{regErrors.email.message}</p>
                  : rs.email === "valid" && <p className="mt-1 text-[10px] text-green-600 font-medium flex items-center gap-1"><Check size={10}/>Correo correcto</p>
                }
              </div>

              {/* Contraseña */}
              <div>
                <div className="relative">
                  <input {...registerForm.register("password")} type={showPassword ? "text" : "password"}
                    placeholder="Contraseña (mín. 8 caracteres)"
                      autoComplete="new-password" 
                    className={fieldClass(rs.password, "pr-10")} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regErrors.password
                  ? <p className="mt-1 text-[10px] text-red-500 font-medium">{regErrors.password.message}</p>
                  : rs.password === "valid"
                    ? <p className="mt-1 text-[10px] text-green-600 font-medium flex items-center gap-1"><Check size={10}/>Contraseña segura</p>
                    : <p className="mt-1 text-[10px] text-gray-400">Mínimo 8 caracteres, una mayúscula, un número y un carácter especial (@, #, %, &)</p>
                }
              </div>

              {/* Confirmar contraseña */}
              <div>
                <div className="relative">
                  <input {...registerForm.register("confirmPassword")} type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmar contraseña"
                     autoComplete="new-password"
                    className={fieldClass(rs.confirmPassword, "pr-10")} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600">
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {regErrors.confirmPassword
                  ? <p className="mt-1 text-[10px] text-red-500 font-medium">{regErrors.confirmPassword.message}</p>
                  : rs.confirmPassword === "valid" && <p className="mt-1 text-[10px] text-green-600 font-medium flex items-center gap-1"><Check size={10}/>Las contraseñas coinciden</p>
                }
              </div>

              <button disabled={registerForm.formState.isSubmitting} type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 font-semibold rounded-xl text-sm px-5 py-3 transition-transform active:scale-[0.98] disabled:opacity-70 mt-1 flex justify-center items-center gap-2">
                {registerForm.formState.isSubmitting
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creando cuenta...</>
                  : "Crear Cuenta"}
              </button>
            </form>
          )}

          {/* Registro exitoso */}
          {activeTab === "signup" && successMessage && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold rounded-xl flex items-start gap-2">
                <CheckCircle size={16} className="mt-0.5 shrink-0" />
                {successMessage}
              </div>
              <button onClick={() => switchTab("signin")}
                className="w-full text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 font-semibold rounded-xl text-sm px-5 py-3 transition-all">
                Ir a Iniciar Sesión →
              </button>
            </div>
          )}
        </div>

        {/* === COLUMNA DERECHA === */}
        <div className="hidden md:block w-1/2 relative bg-gray-100 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1531486613315-3671081d848f?q=80&w=987&auto=format&fit=crop"
            alt="Labrador Retriever esperando ser adoptado"
            fill className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-6 left-0 right-0 text-center px-10">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 text-[10px] text-white/90 leading-tight border border-white/20">
              © 2026 Adopta Salamanca. Tu nuevo mejor amigo te espera.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}