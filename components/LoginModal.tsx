"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Mail, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const loginSchema = z.object({
  email: z.string().email({ message: "Introduce un email válido" }),
  password: z
    .string()
    .min(6, { message: "Mínimo 6 caracteres" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Datos:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Reduje la altura máxima a 600px para que se vea más compacto */}
      <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-[900px] h-auto md:h-[600px] flex overflow-hidden z-10 animate-in zoom-in-95 duration-300">
        
        {/* === COLUMNA IZQUIERDA (Formulario) === */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white relative">
            
            <button onClick={onClose} className="absolute top-5 left-5 md:hidden p-2 text-gray-400 hover:text-black">
                <X size={20} />
            </button>

            {/* Logo y Título más compactos */}
            <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-6 bg-black rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                </div>
                <h2 className="text-lg font-bold text-gray-900">Adopta Salamanca</h2>
            </div>

            <h3 className="text-sm text-gray-500 mb-6 font-medium">
              {activeTab === "signin" ? "¡Hola de nuevo! Te extrañamos." : "Crea tu cuenta en segundos."}
            </h3>

            {/* Switch más delgado */}
            <div className="flex bg-gray-100 p-1 rounded-full mb-6 relative">
                <button 
                    type="button"
                    onClick={() => setActiveTab("signin")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === "signin" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Iniciar Sesión
                </button>
                <button 
                    type="button"
                    onClick={() => setActiveTab("signup")}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${activeTab === "signup" ? "bg-white text-blue-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                    Registrarse
                </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
                
                {/* Input Email */}
                <div>
                    <div className="relative">
                        <input 
                            {...register("email")}
                            type="email" 
                            placeholder="Introduce tu correo" 
                            className={`w-full bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-100"} text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pl-4 outline-none transition-all focus:bg-white focus:shadow-md placeholder:text-gray-400`}
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <Mail size={16} />
                        </div>
                    </div>
                    {errors.email && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.email.message}</p>}
                </div>

                {/* Input Password */}
                <div>
                    <div className="relative">
                        <input 
                            {...register("password")}
                            type={showPassword ? "text" : "password"} 
                            placeholder="Introduce tu contraseña" 
                            className={`w-full bg-gray-50 border ${errors.password ? "border-red-500" : "border-gray-100"} text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 pl-4 outline-none transition-all focus:bg-white focus:shadow-md placeholder:text-gray-400`}
                        />
                        <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="mt-1 text-[10px] text-red-500 font-medium">{errors.password.message}</p>}
                </div>

                {/* Checkbox y Forgot Password */}
                <div className="flex items-center justify-between mt-2 text-xs">
                    <div className="flex items-center">
                        <input id="remember" type="checkbox" className="w-3.5 h-3.5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500" />
                        <label htmlFor="remember" className="ml-2 text-gray-500">Recordarme</label>
                    </div>
                    <a href="#" className="text-blue-500 hover:underline font-medium">¿Olvidaste la contraseña?</a>
                </div>

                {/* Botón Principal */}
                <button 
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-semibold rounded-xl text-sm px-5 py-3 transition-transform active:scale-[0.98] disabled:opacity-70 mt-4"
                >
                    {isSubmitting ? "Procesando..." : activeTab === "signin" ? "Login" : "Registrarse"}
                </button>
            </form>

            <div className="relative flex py-2 items-center mb-4 mt-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-3 text-gray-600 text-[10px] uppercase tracking-wider">O continúa con</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Botones Sociales Compactos */}
            <div className="flex flex-col gap-2.5">
                <button type="button" className="flex items-center justify-center w-full bg-black text-white rounded-xl py-2.5 hover:bg-gray-800 transition text-sm font-medium">
                   <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.21-1.23 3.91-1.12 1.5.09 2.3.64 3.1 1.76-1.63.97-1.37 3.5.7 4.5-.48 2.05-1.18 3.98-2.79 7.09zM12.03 5.39c.27-1.74 1.35-3.06 2.85-3.39.26 1.83-1.09 3.42-2.85 3.39z"/></svg>
                   Apple
                </button>
                <button type="button" className="flex items-center justify-center w-full bg-white border border-gray-200 text-gray-700 rounded-xl py-2.5 hover:bg-gray-50 transition text-sm font-medium">
                   <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                   Google
                </button>
            </div>
        </div>

        {/* === COLUMNA DERECHA (Imagen del Labrador) === */}
        {/* Quitamos el bg-blue-600 para que no afecte el color de la foto */}
        <div className="hidden md:block w-1/2 relative bg-gray-100 overflow-hidden">
            <Image 
                // 👇 ¡AQUÍ ESTÁ LA FOTO DEL LABRADOR! Reemplaza esta URL si consigues la directa de Freepik.
                src="https://images.unsplash.com/photo-1531486613315-3671081d848f?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Un hermoso Labrador Retriever esperando ser adoptado"
                fill
                className="object-cover" // Quitamos opacity-90 para que se vea nítida
            />
            {/* Overlay oscuro sutil para leer el texto blanco, en lugar del azul */}
            <div className="absolute inset-0 bg-black/20"></div>
            
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