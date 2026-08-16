"use client";

import React, { useState } from "react";
import { Shield, Key, Smartphone, Laptop, LogOut, CheckCircle2, AlertCircle, Edit2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  // Estados Generales
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const CURRENT_EMAIL = "vincbrooks32@email.com";

  const [formData, setFormData] = useState({
    email: CURRENT_EMAIL,
    currentPassword: "",
    newPassword: "",
    phone: "5212345678",
    securityQuestion: ""
  });

  // Estados del Modal de Verificación de Correo
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

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

  // Manejo de Guardado
  const handleSaveCredentials = (e: React.FormEvent) => {
      e.preventDefault();
      
      // 1. Validar que si escribió contraseña nueva, cumpla los requisitos
      if (formData.newPassword && !isPasswordValid) return;

      // 2. Si el correo cambió, interceptamos y pedimos código
      if (formData.email !== CURRENT_EMAIL) {
          setShowEmailVerification(true);
          return;
      }

      // 3. Si todo está bien y no cambió correo, guardamos en DB
      submitToDatabase();
  };

  const submitToDatabase = () => {
      // Aquí iría tu fetch/axios a tu API
      console.log("Guardando datos en DB:", formData);
      setShowEmailVerification(false);
      setIsEditing(false);
      setFormData({ ...formData, currentPassword: "", newPassword: "" }); // Limpiar contraseñas tras guardar
      alert("Credenciales actualizadas correctamente.");
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto relative">
      
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

            {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                   <button 
                     type="button"
                     onClick={() => {
                         setIsEditing(false);
                         setFormData({ ...formData, email: CURRENT_EMAIL, currentPassword: "", newPassword: "" }); // Reset
                     }}
                     className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     disabled={!isPasswordValid || formData.phone.length > 0 && formData.phone.length < 10}
                     className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-slate-800 transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
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
                        <h4 className="font-bold text-slate-800">Autenticación en dos pasos (2FA)</h4>
                        <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
                            {is2FAEnabled 
                                ? "La autenticación en dos pasos está activa. Tu cuenta está protegida." 
                                : "Te pediremos un código cuando inicies sesión en un dispositivo nuevo."}
                        </p>
                    </div>
                </div>

                <button 
                  onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                  className={`relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none shrink-0 shadow-inner
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
              Revisa los dispositivos que han iniciado sesión en tu cuenta. Revoca el acceso a cualquier dispositivo que no reconozcas.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center justify-end mb-4">
                <button className="text-xs font-bold text-[#E83C7E] hover:text-[#c92a65] transition">
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
                                Mac OS Safari <span className="bg-emerald-100 text-emerald-700 text-[9px] uppercase px-2 py-0.5 rounded-md">Sesión Actual</span>
                            </h4>
                            <p className="text-xs text-slate-500 font-medium">Salamanca, Gto. • Hace 2 min</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl group hover:border-slate-200 transition-colors">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white text-slate-400 rounded-xl flex items-center justify-center shadow-sm">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-800">iPhone 14 Pro</h4>
                            <p className="text-xs text-slate-500 font-medium">Irapuato, Gto. • Hace 3 días</p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-red-500 transition-colors p-2 bg-white rounded-lg opacity-0 group-hover:opacity-100 shadow-sm border border-slate-100">
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
          </div>
        </section>

      </div>

      {/* VERIFICACIÓN DE CAMBIO DE CORREO */}
      <AnimatePresence>
        {showEmailVerification && (
            <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowEmailVerification(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl z-[100001] relative border border-slate-100 text-center">
                    
                    <button onClick={() => setShowEmailVerification(false)} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-full transition"><X size={16} strokeWidth={3}/></button>
                    
                    <div className="w-16 h-16 bg-[#E83C7E]/10 rounded-2xl flex items-center justify-center text-[#E83C7E] mx-auto mb-6 shadow-inner"><Shield size={32} strokeWidth={2.5} /></div>
                    
                    <h3 className="text-2xl font-black text-slate-800 mb-2 tracking-tighter">Código de Seguridad</h3>
                    <p className="text-slate-500 font-medium mb-6 leading-relaxed text-sm">
                      Para cambiar tu correo a <span className="font-bold text-slate-800">{formData.email}</span>, ingresa el código de 6 dígitos que enviamos a tu correo actual ({CURRENT_EMAIL}).
                    </p>
                    
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full text-center text-3xl font-black tracking-[0.5em] bg-slate-50 border border-slate-200 rounded-2xl py-4 focus:outline-none focus:border-[#E83C7E] focus:ring-2 focus:ring-[#E83C7E]/20 transition-all mb-6"
                    />

                    <button 
                      onClick={submitToDatabase}
                      disabled={verificationCode.length !== 6}
                      className="w-full py-4 rounded-xl bg-[#E83C7E] text-white font-black hover:bg-[#D43372] transition active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#E83C7E]/30"
                    >
                      Verificar y Guardar
                    </button>
                    
                    <button className="mt-4 text-xs font-bold text-slate-400 hover:text-slate-600 transition">¿No recibiste el código? Reenviar</button>
                </motion.div>
            </div>
        )}
      </AnimatePresence>

    </div>
  );
}