"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { 
  User, Building2, Bell, Settings, 
  Mail, Phone, Camera, Edit2, Save, X, ShieldAlert, 
  AlertCircle, ShieldCheck, MapPin, Globe, Instagram, Clock, Info,
  Monitor, MailWarning, MessageSquare, CheckCircle2, XCircle, Palette, Moon, Sun, AlignLeft,
  LayoutGrid, UploadCloud, Link, Eye, AlertTriangle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// =========================================================================
// INTERFACES
// =========================================================================

interface SettingsInputProps {
  label: string;
  value: string;
  onChange?: (val: string) => void;
  icon?: React.ElementType;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  helperText?: string;
  error?: string;
  maxLength?: number;
  isTextArea?: boolean;
  rows?: number;
}

interface ScheduleInputProps {
  start: string;
  end: string;
  onStartChange: (val: string) => void;
  onEndChange: (val: string) => void;
  disabled?: boolean;
}

interface ShelterInfo {
  name: string;
  description: string;
  address: string;
  website: string;
  instagram: string;
  capacity: string;
  startHour: string;
  endHour: string;
  coverImage: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  newPass: string;
  avatar: string;
  handle: string;
}

// =========================================================================
// COMPONENTES COMPARTIDOS
// =========================================================================

const SettingsTab = ({ icon: Icon, label, isActive, onClick }: { icon: React.ElementType, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold border
      ${isActive 
        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.1)]' 
        : 'bg-transparent text-slate-400 border-transparent hover:bg-slate-800/50 hover:text-slate-200'}
    `}
  >
    <Icon size={18} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
    {label}
  </button>
);

const SettingsInput = ({ 
  label, value, onChange, icon: Icon, type = "text", placeholder = "", disabled = false, helperText = "", error = "", maxLength, isTextArea = false, rows = 3
}: SettingsInputProps) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
      {helperText && <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-md">{helperText}</span>}
    </div>
    <div className="relative group">
      {Icon && <Icon className={`absolute left-4 ${isTextArea ? 'top-4' : 'top-3.5'} transition-colors ${disabled ? 'text-slate-600' : 'text-slate-400 group-focus-within:text-indigo-400'}`} size={18} />}
      
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none transition-all resize-none custom-scrollbar
            ${disabled 
              ? 'bg-slate-800/30 border-slate-700/50 text-slate-500 cursor-not-allowed' 
              : 'bg-slate-800/50 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder-slate-600'}
          `}
        />
      ) : (
        <input 
          type={type}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={`w-full border rounded-xl ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 text-sm font-bold focus:outline-none transition-all
            ${disabled 
              ? 'bg-slate-800/30 border-slate-700/50 text-slate-500 cursor-not-allowed' 
              : 'bg-slate-800/50 border-slate-700 text-white focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder-slate-600'}
          `}
        />
      )}
    </div>
    <AnimatePresence>
      {error && !disabled && (
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-[11px] font-bold text-rose-400 flex items-center gap-1 mt-1">
          <AlertCircle size={12} /> {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

const ToggleSwitch = ({ label, description, icon: Icon, active, onToggle }: { label: string, description: string, icon: React.ElementType, active: boolean, onToggle: () => void }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${active ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'bg-slate-800/40 border-slate-700/50'}`}>
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors border ${active ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 border-slate-700 text-slate-500'}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className={`text-sm font-black leading-none mb-1 transition-colors ${active ? 'text-emerald-50' : 'text-slate-300'}`}>{label}</p>
        <p className="text-[11px] font-medium text-slate-500">{description}</p>
      </div>
    </div>
    <button 
      type="button"
      onClick={onToggle}
      className={`relative w-12 h-6 rounded-full transition-colors focus:outline-none border shadow-inner ${active ? 'bg-emerald-500 border-emerald-400' : 'bg-slate-700 border-slate-600'}`}
    >
      <motion.div 
        animate={{ x: active ? 26 : 4 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
      />
    </button>
  </div>
);

const ScheduleInput = ({ start, end, onStartChange, onEndChange, disabled }: ScheduleInputProps) => {
  const endInputRef = useRef<HTMLInputElement>(null);
  
  const formatTime = (val: string) => {
    const nums = val.replace(/\D/g, "");
    if (nums.length <= 2) return nums;
    return `${nums.slice(0, 2)}:${nums.slice(2, 4)}`;
  };
  
  const handleStart = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = formatTime(e.target.value);
    onStartChange(f);
    if (f.length === 5) endInputRef.current?.focus();
  };
  
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario</label>
      <div className={`flex items-center gap-3 border rounded-xl px-4 py-3 transition-all ${disabled ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-800/50 border-slate-700 focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-indigo-500'}`}>
        <Clock size={18} className={disabled ? 'text-slate-600' : 'text-slate-400'} />
        <div className="flex items-center gap-2">
          <input 
            type="text" 
            placeholder="00:00" 
            value={start} 
            onChange={handleStart} 
            disabled={disabled} 
            maxLength={5} 
            className="w-12 bg-transparent text-sm font-bold text-white outline-none placeholder-slate-600 disabled:text-slate-500" 
          />
          <span className="text-slate-600 font-bold">-</span>
          <input 
            ref={endInputRef} 
            type="text" 
            placeholder="00:00" 
            value={end} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onEndChange(formatTime(e.target.value))} 
            disabled={disabled} 
            maxLength={5} 
            className="w-12 bg-transparent text-sm font-bold text-white outline-none placeholder-slate-600 disabled:text-slate-500" 
          />
        </div>
      </div>
    </div>
  );
};

const FileUpload = ({ label, helperText }: { label: string, helperText: string }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</label>
    <div className="border-2 border-dashed border-slate-700 bg-slate-800/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-indigo-500 hover:bg-slate-800/80 transition-all group">
      <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-500 mb-6 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 group-hover:border-indigo-500/30 transition-all">
        <UploadCloud size={32} />
      </div>
      <p className="text-sm font-black text-white mb-1">Arrastra y suelta o haz clic para subir</p>
      <p className="text-xs text-slate-400 font-medium">{helperText}</p>
      <p className="text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-widest">(Formato sugerido: PNG, JPG • Máx. 5MB)</p>
    </div>
  </div>
);

// =========================================================================
// MODAL DE VERIFICACIÓN
// =========================================================================
const VerificationModal = ({ isOpen, onClose, onVerify, target }: { isOpen: boolean, onClose: () => void, onVerify: () => void, target: string }) => {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCode = [...code];
    newCode[index] = val.slice(-1);
    setCode(newCode);
    if (val && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-md w-full shadow-[0_10px_50px_rgba(0,0,0,0.8)] relative border border-slate-700 text-center">
        <div className="w-16 h-16 bg-indigo-500/20 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mx-auto mb-6 shadow-sm">
          <ShieldCheck size={32} strokeWidth={2.5} />
        </div>
        <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">Verifica tu identidad</h3>
        <p className="text-slate-400 font-medium mb-8 text-sm px-4">Código enviado a <span className="text-slate-200 font-bold">{target}</span></p>
        
        <div className="flex justify-center gap-2 mb-8">
          {code.map((digit, i) => (
            <input 
              key={i} 
              ref={(el) => { inputRefs.current[i] = el; }} 
              type="text" 
              maxLength={1} 
              value={digit} 
              onChange={(e) => handleChange(i, e.target.value)} 
              onKeyDown={(e) => handleKeyDown(i, e)} 
              className="w-12 h-14 bg-slate-800/80 border-2 border-slate-700 rounded-xl text-center text-xl font-black text-white focus:border-indigo-500 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 outline-none transition-all shadow-inner" 
            />
          ))}
        </div>
        
        <div className="flex flex-col gap-3">
          <button onClick={onVerify} className="w-full py-4 bg-indigo-600 text-white border border-indigo-500/50 rounded-2xl font-black uppercase text-xs tracking-widest shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition active:scale-95">Confirmar</button>
          <button onClick={onClose} className="w-full py-3 text-slate-500 font-bold text-xs hover:text-slate-300 transition">Cancelar</button>
        </div>
      </motion.div>
    </div>, document.body
  );
};

// =========================================================================
// SECCIÓN: MI PERFIL
// =========================================================================
const MyProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [formErrors, setFormErrors] = useState({ email: false, phone: false });
  const [errorMessage, setErrorMessage] = useState("");

  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    phone: "",
    newPass: "",
    avatar:  "",
    handle: ""
  });

  //  Cargar datos reales desde Supabase
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      setUserId(session.user.id);

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre, apellido, telefono, avatar_url")
        .eq("id", session.user.id)
        .single();

      setProfile({
        name:    perfil ? [perfil.nombre, perfil.apellido].filter(Boolean).join(" ") : "",
        email:   session.user.email ?? "",
        phone:   perfil?.telefono ?? "",
        newPass: "",
        avatar:  perfil?.avatar_url ?? `https://i.pravatar.cc/300?u=${session.user.id}`,
        handle:  `@${(session.user.email ?? "").split("@")[0]}`,
      });
    };
    loadProfile();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;

  const errors = {
    email: isEditing && profile.email && !emailRegex.test(profile.email) ? "Formato incorrecto" : "",
    phone: isEditing && profile.phone && profile.phone.length < 10 ? "Mínimo 10 dígitos" : "",
    pass: isEditing && profile.newPass && !passRegex.test(profile.newPass) ? "No cumple nivel de seguridad 2026" : ""
  };

  const handlePhoneChange = (val: string) => {
    const onlyNums = val.replace(/\D/g, '').slice(0, 10);
    setProfile({ ...profile, phone: onlyNums });
    setFormErrors(prev => ({...prev, phone: false}));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile(prev => ({ ...prev, avatar: imageUrl }));
    }
  };

  // LOGICA: Bloquear guardado si borran campos obligatorios
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (profile.newPass !== "" && !!errors.pass) return;

    const currentErrors = { 
      email: profile.email.trim() === "", 
      phone: profile.phone.trim() === "" 
    };
    
    setFormErrors(currentErrors);

    if (currentErrors.email || currentErrors.phone) {
      setErrorMessage("No se pueden guardar datos incompletos. Los campos de correo y teléfono son requeridos.");
      setTimeout(() => setErrorMessage(""), 5000);
      return;
    }

    setSaving(true);

    // Separar nombre y apellido
    const parts = profile.name.trim().split(" ");
    const nombre   = parts[0] ?? "";
    const apellido = parts.slice(1).join(" ") || null;

    if (userId) {
      await supabase.from("perfiles").upsert({
        id:       userId,
        nombre,
        apellido,
        telefono: profile.phone || null,
      });
    }

    setSaving(false);
    setErrorMessage("");
    setShowVerify(true);
  };

  return (
    <div className="flex flex-col gap-6 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* ========================================================= */}
      {/* BANNER ESTILO "EMMA GANNON" */}
      {/* ========================================================= */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] flex flex-col overflow-hidden border border-slate-700/50 shadow-2xl">
        {/* Luces de fondo del banner */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        {/* Imagen de Portada (Generica por ahora) */}
        <div className="relative h-48 sm:h-60 overflow-hidden bg-slate-800">
          <img 
            src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=2069&auto=format&fit=crop" 
            alt="Cover" 
            className="w-full h-full object-cover opacity-70" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
        </div>

        {/* Sección Inferior del Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 relative z-10 px-8 pb-8">
          
          {/* Avatar con Botón Lápiz */}
          <div className="relative -mt-16 sm:-mt-20 shrink-0">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-32 rounded-full border-4 border-slate-900 shadow-xl overflow-hidden bg-slate-800 cursor-pointer group"
            >
              <img src={profile.avatar || undefined} alt="Admin" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white">
                 <Camera size={32} />
              </div>
            </div>
            
            {/* Botón Lápiz Flotante */}
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-2 w-10 h-10 bg-indigo-600 rounded-full border-4 border-slate-900 flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,70,229,0.8)] hover:bg-indigo-500 transition-colors"
            >
              <Edit2 size={14} />
            </button>

            {/* Input oculto */}
            <input 
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Textos del Usuario */}
          <div className="flex-1 pb-2">
            <h2 className="text-3xl font-black text-white tracking-tighter flex items-center gap-2">
              {profile.name}
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                <CheckCircle2 size={12} strokeWidth={4} className="text-slate-900" />
              </div>
            </h2>
            <p className="text-slate-400 font-medium text-sm mt-1">{profile.handle} • Administrador General</p>
          </div>
          
          {/* Botón Vista Adoptante */}
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg hover:bg-slate-700 transition active:scale-95 shrink-0 mb-2">
            <Eye size={16} />
            <span>Vista Adoptante</span>
          </button>
        </div>
      </motion.div>

      {/* ========================================================= */}
      {/* FORMULARIO DE EDICIÓN */}
      {/* ========================================================= */}
      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-slate-700/50 shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700/50">
          <h3 className="text-xl font-black text-white tracking-tighter">Información de Contacto</h3>
          <button 
            type="button"
            onClick={() => setIsEditing(!isEditing)} 
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 border ${isEditing ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'}`}
          >
            {isEditing ? <X size={14}/> : <Edit2 size={14}/>} {isEditing ? "Cancelar Edición" : "Editar Datos"}
          </button>
        </div>

        {/* ALERTA DE ERROR */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -10, height: 0 }} className="bg-rose-500/10 text-rose-400 p-4 rounded-2xl flex items-center gap-3 border border-rose-500/30 font-semibold text-sm mb-6">
              <AlertTriangle size={20} className="shrink-0" />
              <p>{errorMessage}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <form className="space-y-6" onSubmit={handleSaveChanges}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsInput label="Nombre" value={profile.name} onChange={(v: string) => setProfile({...profile, name: v})} icon={User} disabled={!isEditing} />
            <SettingsInput label="Nombre de Usuario" value={profile.handle} onChange={(v: string) => setProfile({...profile, handle: v})} icon={User} disabled={!isEditing} helperText="Ej. @carlosadmin" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <SettingsInput label="Email (Obligatorio)" value={profile.email} onChange={(v: string) => { setProfile({...profile, email: v}); setFormErrors(prev => ({...prev, email: false})) }} icon={Mail} disabled={!isEditing} error={errors.email} />
              <AnimatePresence>
                {formErrors.email && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-rose-400 text-xs font-semibold flex items-center gap-1 pl-1">
                    <AlertTriangle size={12} /> Requerido para conexión con Backend.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <SettingsInput label="Teléfono (Obligatorio)" value={profile.phone} onChange={handlePhoneChange} icon={Phone} disabled={!isEditing} error={errors.phone} maxLength={10} />
              <AnimatePresence>
                {formErrors.phone && (
                  <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="text-rose-400 text-xs font-semibold flex items-center gap-1 pl-1">
                    <AlertTriangle size={12} /> Requerido para conexión con Backend.
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700/50">
            <h3 className="text-sm font-black text-slate-300 mb-6 uppercase tracking-widest">Seguridad de la Cuenta</h3>
            <SettingsInput label="Nueva Contraseña" value={profile.newPass} onChange={(v: string) => setProfile({...profile, newPass: v})} type="password" disabled={!isEditing} error={errors.pass} placeholder="Dejar en blanco para mantener la actual" />
          </div>
          
          {/* Nota de Backend */}
          <div className="mt-6 bg-indigo-500/5 border border-indigo-500/20 p-4 rounded-2xl flex gap-3 text-indigo-300">
             <Globe size={20} className="shrink-0 mt-0.5" />
             <p className="text-xs font-medium leading-relaxed">
               <strong>Nota del Sistema:</strong> Los campos de Correo Electrónico y Teléfono están directamente vinculados con las tarjetas de contacto públicas de tu Website. Cualquier cambio aquí se reflejará en la base de datos (Backend) de los adoptantes.
             </p>
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-end pt-6 border-t border-slate-700/50">
                {/* Deshabilitar botón solo si hay error en regex de contraseña o email, el form vacío se valida al dar clic */}
                <button type="submit" disabled={saving || (profile.newPass !== "" && !!errors.pass) || !!errors.email} className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 border border-indigo-500/50 transition active:scale-95 disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none flex items-center gap-2">
                  <Save size={18} /> {saving ? "Guardando..." : "Guardar Cambios"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      <VerificationModal 
        isOpen={showVerify} 
        onClose={() => setShowVerify(false)} 
        onVerify={() => { setShowVerify(false); setIsEditing(false); alert("¡Cambios guardados y sincronizados con el Backend!"); }}
        target={profile.email}
      />
    </div>
  );
};

// =========================================================================
// SECCIÓN: EL ALBERGUE 
// =========================================================================
const ShelterSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [shelter, setShelter] = useState<ShelterInfo>({
    name: "Refugio Esperanza Salamanca",
    description: "Dedicados al rescate y rehabilitación de animales en situación de calle desde 2015. Nuestro objetivo es encontrar hogares amorosos para cada mascota.",
    address: "Calle Hidalgo #123, Zona Centro, Salamanca, Gto.",
    website: "https://esperanzasalamanca.org",
    instagram: "@esperanza_salamanca",
    capacity: "50",
    startHour: "09:00",
    endHour: "18:00",
    coverImage: ""
  });

  return (
    <div className="flex flex-col gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-slate-700/50 shadow-2xl p-8">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-700/50">
          <div>
            <h3 className="text-xl font-black text-white tracking-tighter">Perfil del Albergue</h3>
            <p className="text-sm text-slate-400 font-medium mt-1">Información pública visible para los adoptantes.</p>
          </div>
          <button onClick={() => setIsEditing(!isEditing)} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition active:scale-95 border ${isEditing ? 'bg-slate-800/50 text-slate-400 border-slate-700 hover:text-white' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20'}`}>
            {isEditing ? <X size={14}/> : <Edit2 size={14}/>} {isEditing ? "Cancelar" : "Editar Perfil"}
          </button>
        </div>
        
        <form className="space-y-8" onSubmit={(e: React.FormEvent) => { e.preventDefault(); setIsEditing(false); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SettingsInput label="Nombre del Refugio" value={shelter.name} onChange={(v: string) => setShelter({...shelter, name: v})} icon={Building2} disabled={!isEditing} />
            <SettingsInput label="Capacidad Máxima" value={shelter.capacity} onChange={(v: string) => setShelter({...shelter, capacity: v.replace(/\D/g,'')})} icon={Info} disabled={!isEditing} helperText="Cupos disponibles" />
          </div>
          
          <SettingsInput label="Descripción" value={shelter.description} onChange={(v: string) => setShelter({...shelter, description: v})} icon={AlignLeft} disabled={!isEditing} isTextArea={true} rows={4} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <SettingsInput label="Dirección Física" value={shelter.address} onChange={(v: string) => setShelter({...shelter, address: v})} icon={MapPin} disabled={!isEditing} />
            <ScheduleInput start={shelter.startHour} end={shelter.endHour} onStartChange={(v: string) => setShelter({...shelter, startHour: v})} onEndChange={(v: string) => setShelter({...shelter, endHour: v})} disabled={!isEditing} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <SettingsInput label="Sitio Web" value={shelter.website} onChange={(v: string) => setShelter({...shelter, website: v})} icon={Globe} disabled={!isEditing} />
            <SettingsInput label="Instagram" value={shelter.instagram} onChange={(v: string) => setShelter({...shelter, instagram: v})} icon={Instagram} disabled={!isEditing} />
          </div>

          {/* ZONA DE SUBIDA DE IMAGEN*/}
          <div className={`pt-8 mt-8 border-t border-slate-700/50 ${!isEditing ? 'opacity-50 pointer-events-none' : ''}`}>
             <FileUpload 
                label="Foto de Portada del Albergue" 
                helperText="Esta imagen se mostrará automáticamente en las tarjetas de centros en tu Website público una vez conectemos el Backend." 
              />
          </div>

          <AnimatePresence>
            {isEditing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="flex justify-end pt-6 border-t border-slate-700/50">
                <button type="submit" className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 border border-indigo-500/50 transition active:scale-95 flex items-center gap-2">
                  <Save size={18} /> Actualizar Información
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};

// =========================================================================
// SECCIÓN: NOTIFICACIONES 
// =========================================================================
const NotificationsSection = () => {
  const [notifs, setNotifs] = useState({
    emailRegistrations: true,
    emailAppointments: true,
    emailSummary: false,
    pushNewUser: true,
    pushUpdates: false
  });

  return (
    <div className="flex flex-col gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-slate-700/50 shadow-2xl p-8">
        <div className="mb-8 pb-4 border-b border-slate-700/50">
          <h3 className="text-xl font-black text-white tracking-tighter">Notificaciones</h3>
          <p className="text-sm text-slate-400 font-medium mt-1">Controla cómo y cuándo recibes alertas del sistema.</p>
        </div>

        <div className="space-y-10">
          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Mail size={14} className="text-slate-400" /> Alertas por Correo Electrónico</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch label="Nuevos Registros" description="Avisa cuando un adoptante cree su cuenta." icon={User} active={notifs.emailRegistrations} onToggle={() => setNotifs({...notifs, emailRegistrations: !notifs.emailRegistrations})} />
              <ToggleSwitch label="Nuevas Citas" description="Alerta al agendar una entrevista o entrega." icon={Clock} active={notifs.emailAppointments} onToggle={() => setNotifs({...notifs, emailAppointments: !notifs.emailAppointments})} />
              <ToggleSwitch label="Resumen Diario" description="Recibe una lista de tareas cada mañana." icon={MailWarning} active={notifs.emailSummary} onToggle={() => setNotifs({...notifs, emailSummary: !notifs.emailSummary})} />
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2"><Monitor size={14} className="text-slate-400" /> Notificaciones de Escritorio</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch label="Alertas en Tiempo Real" description="Muestra ventanas emergentes en el navegador." icon={Bell} active={notifs.pushNewUser} onToggle={() => setNotifs({...notifs, pushNewUser: !notifs.pushNewUser})} />
              <ToggleSwitch label="Actualizaciones de App" description="Avisos sobre mantenimiento y nuevas funciones." icon={Settings} active={notifs.pushUpdates} onToggle={() => setNotifs({...notifs, pushUpdates: !notifs.pushUpdates})} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// SECCIÓN: PREFERENCIAS 
// =========================================================================
const PreferencesSection = () => {
  const [pref, setPref] = useState({
    duration: "1 hora",
    theme: "dark", 
    approvalMsg: "¡Felicidades! Tu perfil ha sido aprobado. Pronto nos contactaremos para tu cita.",
    rejectionMsg: "Hola, revisamos tus documentos y son ilegibles. Por favor súbelos de nuevo."
  });

  return (
    <div className="flex flex-col gap-8 relative z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-slate-700/50 shadow-2xl p-8">
        <div className="mb-8 pb-4 border-b border-slate-700/50">
          <h3 className="text-xl font-black text-white tracking-tighter">Preferencias del Sistema</h3>
          <p className="text-sm text-slate-400 font-medium mt-1">Configura reglas y valores predeterminados.</p>
        </div>

        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Clock size={14} /> Duración de Citas</h4>
              <div className="flex gap-2">
                {["30 min", "45 min", "1 hora"].map((d) => (
                  <button key={d} onClick={() => setPref({...pref, duration: d})} className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-colors ${pref.duration === d ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(79,70,229,0.2)]' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2"><Palette size={14} /> Apariencia</h4>
              <div className="flex gap-2">
                <button onClick={() => setPref({...pref, theme: 'light'})} className={`flex-1 py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-colors ${pref.theme === 'light' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(79,70,229,0.2)]' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'}`}><Sun size={16} /> Claro</button>
                <button onClick={() => setPref({...pref, theme: 'dark'})} className={`flex-1 py-3 rounded-xl text-sm font-bold border flex items-center justify-center gap-2 transition-colors ${pref.theme === 'dark' ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(79,70,229,0.2)]' : 'bg-slate-800/50 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200'}`}><Moon size={16} /> Oscuro</button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-700/50">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2"><MessageSquare size={14} /> Plantillas de Mensajes por Defecto</h4>
            <div className="space-y-6">
              <SettingsInput label="Mensaje de Aprobación" value={pref.approvalMsg} onChange={(v: string) => setPref({...pref, approvalMsg: v})} icon={CheckCircle2} isTextArea={true} />
              <SettingsInput label="Mensaje de Rechazo" value={pref.rejectionMsg} onChange={(v: string) => setPref({...pref, rejectionMsg: v})} icon={XCircle} isTextArea={true} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 mt-8 border-t border-slate-700/50">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold border border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition active:scale-95 flex items-center gap-2"><Save size={18} /> Guardar Preferencias</button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// PÁGINA PRINCIPAL DE AJUSTES
// =========================================================================
export default function AjustesPage() {
  const [activeTab, setActiveTab] = useState<string>("profile");
  const tabs = [
    { id: "profile", label: "Mi Perfil", icon: User },
    { id: "shelter", label: "El Albergue", icon: Building2 },
    { id: "notifications", label: "Notificaciones", icon: Bell },
    { id: "preferences", label: "Preferencias", icon: Settings },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 relative">
      
      {/* Luces de fondo globales para la vista de ajustes */}
      <div className="fixed top-[20%] right-[-5%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-5%] w-[30%] h-[30%] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none z-0" />

      <h1 className="text-3xl font-black text-white tracking-tighter relative z-10 uppercase">Ajustes</h1>
      
      <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden relative pb-8 z-10">
        
        {/* SIDEBAR DE TABS */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] border border-slate-700/50 shadow-2xl p-4 flex flex-col gap-2 sticky top-0">
            {tabs.map(tab => (
              <SettingsTab 
                key={tab.id} 
                icon={tab.icon} 
                label={tab.label} 
                isActive={activeTab === tab.id} 
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>

        {/* CONTENIDO DINÁMICO */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
           <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "profile" && <MyProfileSection />}
              {activeTab === "shelter" && <ShelterSection />}
              {activeTab === "notifications" && <NotificationsSection />}
              {activeTab === "preferences" && <PreferencesSection />}
            </motion.div>
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
}