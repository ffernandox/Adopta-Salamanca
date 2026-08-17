"use client";

import React, { useState, useEffect } from "react";
import { Shield, Key, Laptop, CheckCircle2, AlertCircle, Edit2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

//Input de seguridad 
interface SecurityInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const SecurityInput = ({ label, error, disabled, ...props }: SecurityInputProps) => (
  <div className="w-full">
    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">{label}</label>
    <input 
      disabled={disabled}
      {...props} 
      className={`w-full border rounded-2xl px-4 py-3 text-sm font-bold text-slate-800 outline-none transition-all placeholder:font-medium placeholder:text-slate-400
        ${disabled ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed opacity-70' : 'bg-white border-slate-200 focus:border-[#E83C7E] focus:ring-2 focus:ring-[#E83C7E]/20'}
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''}
      `}
    />
    {error && <p className="text-xs text-red-500 font-bold mt-2 flex items-center gap-1"><AlertCircle size={12}/>{error}</p>}
  </div>
);

export default function SecurityPage() {
  const router = useRouter();

  // Estados Generales
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [signingOutAll, setSigningOutAll] = useState(false);
  const [currentEmail, setCurrentEmail] = useState("");
  const [sessionInfo, setSessionInfo] = useState({ browser: "Este dispositivo", lastActive: "Ahora" });

  const [formData, setFormData] = useState({
    email: "",
    currentPassword: "",
    newPassword: "",
    phone: "",
    securityQuestion: ""
  });

  // ── Cargar correo real y teléfono real desde Supabase ─────
  useEffect(() => {
    const loadSecurityData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/"); return; }

      const email = session.user.email ?? "";
      setCurrentEmail(email);

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("telefono")
        .eq("id", session.user.id)
        .single();

      setFormData(prev => ({ ...prev, email, phone: perfil?.telefono ?? "" }));

      // Info básica de la sesión actual (lo único que el cliente puede leer de sí mismo)
      const ua = navigator.userAgent;
      const browser = /Safari/.test(ua) && !/Chrome/.test(ua) ? "Safari"
        : /Chrome/.test(ua) ? "Chrome"
        : /Firefox/.test(ua) ? "Firefox" : "Navegador";
      const os = /Mac/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /Android/.test(ua) ? "Android" : /iPhone|iPad/.test(ua) ? "iOS" : "";
      setSessionInfo({ browser: `${os} ${browser}`.trim(), lastActive: "Ahora" });

      setLoading(false);
    };
    loadSecurityData();
  }, [router]);

  //  LÓGICA DE VALIDACIÓN
  
  // Manejo de inputs con validación en tiempo real para el teléfono
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
        // Bloquea letras/símbolos y limita a 10 dígitos
        const onlyNumbers = value.replace(/\D/g, '').slice(0, 10);
        setFormData({ ...formData, phone: onlyNumbers });
    } else {
        setFormData({ ...formData, [name]: value });
    }
  };

  // Validadores de la contraseña
  const pwdReqs = {
      length: formData.newPassword.length >= 12,
      upper: /[A-Z]/.test(formData.newPassword),
      lower: /[a-z]/.test(formData.newPassword),
      special: /[\W_]/.test(formData.newPassword),
  };
  const isPasswordValid = !formData.newPassword || (pwdReqs.length && pwdReqs.upper && pwdReqs.lower && pwdReqs.special);

  // Manejo de Guardado — todo contra Supabase real
  const handleSaveCredentials = async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveError(""); setSaveSuccess("");

      // 1. Validar que si escribió contraseña nueva, cumpla los requisitos
      if (formData.newPassword && !isPasswordValid) return;

      // 2. Si quiere cambiar contraseña o correo, primero confirmamos su contraseña actual
      const wantsEmailChange = formData.email !== currentEmail;
      const wantsPasswordChange = !!formData.newPassword;

      if ((wantsEmailChange || wantsPasswordChange) && !formData.currentPassword) {
          setSaveError("Ingresa tu contraseña actual para confirmar los cambios.");
          return;
      }

      setSaving(true);
      try {
        if (wantsEmailChange || wantsPasswordChange) {
          // Reautenticamos con la contraseña actual antes de cambiar credenciales sensibles
          const { error: reauthError } = await supabase.auth.signInWithPassword({
            email: currentEmail,
            password: formData.currentPassword,
          });
          if (reauthError) {
            setSaveError("Tu contraseña actual es incorrecta.");
            setSaving(false);
            return;
          }
        }

        if (wantsPasswordChange) {
          const { error } = await supabase.auth.updateUser({ password: formData.newPassword });
          if (error) { setSaveError(error.message); setSaving(false); return; }
        }

        if (wantsEmailChange) {
          const { error } = await supabase.auth.updateUser({ email: formData.email });
          if (error) { setSaveError(error.message); setSaving(false); return; }
          setSaveSuccess("Te enviamos un enlace de confirmación a tu correo nuevo. Tu correo de inicio de sesión cambiará hasta que lo confirmes.");
        }

        // Teléfono: se guarda directo en la tabla perfiles
        const { error: perfilError } = await supabase
          .from("perfiles")
          .update({ telefono: formData.phone || null })
          .eq("id", (await supabase.auth.getUser()).data.user?.id);
        if (perfilError) { setSaveError(perfilError.message); setSaving(false); return; }

        if (!wantsEmailChange) setSaveSuccess("Credenciales actualizadas correctamente.");
        setIsEditing(false);
        setFormData(prev => ({ ...prev, currentPassword: "", newPassword: "" }));
      } finally {
        setSaving(false);
      }
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto relative">
      {loading && (
        <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-6">
          <Loader2 size={16} className="animate-spin" /> Cargando tu información de seguridad...
        </div>
      )}
      
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Seguridad de la Cuenta</h2>
        <p className="text-sm text-slate-500 font-medium">
          Administra tus contraseñas, opciones de recuperación y sesiones activas para mantener tu cuenta protegida.
        </p>
      </div>

      <div className="divide-y divide-slate-100">

        {/* SECCIÓN 1: CREDENCIALES DE ACCESO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-10 relative">
          <div className="md:col-span-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Key size={16} className="text-[#E83C7E]" />
              Credenciales
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
              Actualiza tu correo electrónico y contraseña. Al cambiar tu correo, enviaremos un código a tu correo actual por seguridad.
            </p>
            
            {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#E83C7E] hover:text-[#E83C7E] px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Edit2 size={14} /> Editar Credenciales
                </button>
            )}
          </div>
          
          <form onSubmit={handleSaveCredentials} className="md:col-span-2 space-y-6">
            
            <SecurityInput 
              label="Email de Inicio de Sesión" 
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing} 
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SecurityInput 
                label="Contraseña Actual" 
                name="currentPassword"
                type="password" 
                placeholder="••••••••••••"
                value={formData.currentPassword}
                onChange={handleChange}
                disabled={!isEditing} 
              />
              <div>
                  <SecurityInput 
                    label="Nueva Contraseña" 
                    name="newPassword"
                    type="password" 
                    placeholder="••••••••••••"
                    value={formData.newPassword}
                    onChange={handleChange}
                    disabled={!isEditing} 
                  />
                  {/* Lista de Requisitos */}
                  <AnimatePresence>
                      {isEditing && formData.newPassword.length > 0 && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Requisitos:</p>
                              <div className={`text-xs font-bold flex items-center gap-1.5 ${pwdReqs.length ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  <CheckCircle2 size={12} /> 12 caracteres mínimo
                              </div>
                              <div className={`text-xs font-bold flex items-center gap-1.5 ${pwdReqs.upper && pwdReqs.lower ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  <CheckCircle2 size={12} /> Mayúscula y minúscula
                              </div>
                              <div className={`text-xs font-bold flex items-center gap-1.5 ${pwdReqs.special ? 'text-emerald-500' : 'text-slate-400'}`}>
                                  <CheckCircle2 size={12} /> Un carácter especial (@$!%*?&)
                              </div>
                          </motion.div>
                      )}
                  </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <SecurityInput 
                label="Teléfono (Para SMS)" 
                name="phone"
                type="tel" 
                placeholder="10 dígitos"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing} 
              />
              <SecurityInput 
                label="Pregunta de Seguridad (Opcional)" 
                name="securityQuestion"
                type="text" 
                placeholder="¿Nombre de tu primera mascota?"
                value={formData.securityQuestion}
                onChange={handleChange}
                disabled={!isEditing} 
              />
            </div>

            {(saveError || saveSuccess) && (
                <div className={`text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 ${saveError ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                    {saveError ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                    {saveError || saveSuccess}
                </div>
            )}

            {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                   <button 
                     type="button"
                     onClick={() => {
                         setIsEditing(false);
                         setFormData(prev => ({ ...prev, email: currentEmail, currentPassword: "", newPassword: "" })); // Reset
                         setSaveError(""); setSaveSuccess("");
                     }}
                     className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     disabled={saving || !isPasswordValid || (formData.phone.length > 0 && formData.phone.length < 10)}
                     className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-slate-800 transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                   >
                     {saving && <Loader2 size={14} className="animate-spin" />}
                     Guardar Cambios
                   </button>
                </motion.div>
            )}
          </form>
        </section>

        {/* SECCIÓN 2: SEGURIDAD AVANZADA (2FA) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-10">
          <div className="md:col-span-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Shield size={16} className="text-[#E83C7E]" />
              Seguridad Avanzada
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Añade una capa extra de protección a tu cuenta exigiendo un código de verificación cada vez que inicies sesión.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <div className={`p-6 rounded-3xl border transition-all duration-300 flex items-center justify-between
                ${is2FAEnabled ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'}
            `}>
                <div className="flex gap-4 items-start">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 mt-0.5
                        ${is2FAEnabled ? 'bg-emerald-200 text-emerald-700' : 'bg-white text-slate-400 shadow-sm'}
                    `}>
                        {is2FAEnabled ? <CheckCircle2 size={20} /> : <Shield size={20} />}
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          Autenticación en dos pasos (2FA)
                          <span className="text-[9px] font-black uppercase tracking-wider bg-slate-200 text-slate-600 px-2 py-0.5 rounded-md">Próximamente</span>
                        </h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
                            Esta función todavía no está conectada — actívala solo cuando el flujo de verificación esté implementado en el backend.
                        </p>
                    </div>
                </div>

                <button 
                  disabled
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none shrink-0 shadow-inner opacity-40 cursor-not-allowed
                    ${is2FAEnabled ? 'bg-[#E83C7E]' : 'bg-slate-200'}
                  `}
                >
                  <motion.div 
                    initial={false}
                    animate={{ x: is2FAEnabled ? 26 : 4 }}
                    className="absolute top-1 w-6 h-6 bg-white rounded-full shadow border border-slate-100" 
                  />
                </button>
            </div>
          </div>
        </section>

        {/* SECCIÓN 3: SESIONES ACTIVAS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-10">
          <div className="md:col-span-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Laptop size={16} className="text-[#E83C7E]" />
              Sesiones Activas
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Por seguridad, Supabase no permite ver el listado de dispositivos desde el navegador — pero sí puedes cerrar todas tus sesiones activas (en todos los dispositivos) desde aquí.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center justify-end mb-4">
                <button
                  onClick={async () => {
                    setSigningOutAll(true);
                    await supabase.auth.signOut({ scope: 'global' });
                    router.replace("/");
                  }}
                  disabled={signingOutAll}
                  className="text-xs font-bold text-[#E83C7E] hover:text-[#c92a65] transition disabled:opacity-50 flex items-center gap-1.5"
                >
                    {signingOutAll && <Loader2 size={12} className="animate-spin" />}
                    Cerrar todas las sesiones
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                            <Laptop size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                {sessionInfo.browser} <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase px-2 py-0.5 rounded-md">Sesión Actual</span>
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">{sessionInfo.lastActive}</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}