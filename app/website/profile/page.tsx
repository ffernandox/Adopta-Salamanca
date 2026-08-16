"use client";

import React, { useState, useEffect } from "react";
import { Camera, X, ShieldAlert, MapPin, Loader2, Check } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface StandardInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  onClear?: () => void;
}

const StandardInput = ({ label, onClear, disabled, ...props }: StandardInputProps) => (
  <div className="mb-6 w-full">
    {label && <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>}
    <div className="relative group">
      <input 
        disabled={disabled}
        {...props} 
        className={`w-full border rounded-2xl px-4 py-3.5 text-sm font-bold outline-none transition-all placeholder:font-medium placeholder:text-slate-400 shadow-[0_2px_10px_rgba(0,0,0,0.02)]
          ${disabled ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed opacity-80' : 'bg-white border-slate-200 text-slate-800 focus:border-[#E83C7E] focus:ring-1 focus:ring-[#E83C7E]'}
        `}
      />
      {onClear && props.value && !disabled && (
        <button 
          onClick={onClear} 
          type="button"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1 transition-colors"
        >
          <X size={14} strokeWidth={3} />
        </button>
      )}
    </div>
  </div>
);

export default function ProfileInformationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    secondName: "",
    email: "",
    phone: "",
    addressSelect1: "Guanajuato",
    addressSelect2: "Salamanca",
    zipCode: "",
    street: "",
  });

  //  Cargar perfil desde Supabase 
  useEffect(() => {
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }
      setUserId(session.user.id);

      const { data } = await supabase
        .from("perfiles")
        .select("nombre, apellido, telefono, direccion, ciudad, estado_republica, codigo_postal")
        .eq("id", session.user.id)
        .single();

      setFormData({
        firstName:      data?.nombre             ?? "",
        secondName:     data?.apellido           ?? "",
        email:          session.user.email       ?? "",
        phone:          data?.telefono           ?? "",
        addressSelect1: data?.estado_republica   ?? "Guanajuato",
        addressSelect2: data?.ciudad             ?? "Salamanca",
        zipCode:        data?.codigo_postal      ?? "",
        street:         data?.direccion          ?? "",
      });
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const clearFirstName  = () => setFormData({ ...formData, firstName: "" });
  const clearSecondName = () => setFormData({ ...formData, secondName: "" });

  //  Guardar cambios en Supabase 
  const handleSave = async () => {
    if (!userId) return;
    setSaving(true);
    await supabase.from("perfiles").upsert({
      id:               userId,
      nombre:           formData.firstName,
      apellido:         formData.secondName,
      telefono:         formData.phone       || null,
      direccion:        formData.street      || null,
      ciudad:           formData.addressSelect2,
      estado_republica: formData.addressSelect1,
      codigo_postal:    formData.zipCode     || null,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <Loader2 size={28} className="animate-spin text-slate-400" />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl">
      
      <div className="mb-8">
        <h2 className="text-xl font-black text-slate-800 mb-2">Información del Usuario</h2>
        <p className="text-sm text-slate-500 font-medium">
          Aquí puedes editar tu información pública y demográfica.<br/>
          Los cambios se reflejarán en tus solicitudes de adopción.
        </p>
      </div>

      <div className="flex flex-col-reverse xl:flex-row gap-12 xl:gap-20">
        
        <div className="flex-1">
          
          {/* Correo Bloqueado */}
          <div className="mb-6">
              <StandardInput 
                label="Correo electrónico de la cuenta" 
                name="email"
                value={formData.email} 
                disabled
              />
              <p className="text-xs font-bold text-slate-500 mt-[-16px] flex items-center gap-1.5 ml-2">
                <ShieldAlert size={14} className="text-amber-500"/>
                Para actualizar tu correo o contraseña, ve a <Link href="/website/profile/security" className="text-[#E83C7E] hover:underline">Seguridad</Link>.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StandardInput 
              label="Nombre (s)" 
              name="firstName"
              value={formData.firstName} 
              onChange={handleChange}
              onClear={clearFirstName}
            />
            <StandardInput 
              label="Apellidos" 
              name="secondName"
              value={formData.secondName} 
              onChange={handleChange} 
              onClear={clearSecondName}
            />
          </div>

          {/*  DIRECCIÓN BLOQUEADA CON REDIRECCIÓN A DIRECCIONES */}
          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Dirección Residencial</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
               <div className="relative">
                 <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-500 cursor-not-allowed appearance-none opacity-80">
                    <option>{formData.addressSelect1}</option>
                 </select>
               </div>
               <div className="relative">
                 <select disabled className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-sm font-bold text-slate-500 cursor-not-allowed appearance-none opacity-80">
                    <option>{formData.addressSelect2}</option>
                 </select>
               </div>
               <StandardInput 
                  name="zipCode"
                  value={formData.zipCode}
                  disabled
               />
            </div>
            <StandardInput 
              name="street"
              value={formData.street}
              disabled
            />
            <p className="text-xs font-bold text-slate-500 mt-[-16px] flex items-center gap-1.5 ml-2">
              <MapPin size={14} className="text-indigo-500"/>
              Para modificar tu domicilio, ve a <Link href="/website/profile/directions" className="text-[#E83C7E] hover:underline">Direcciones</Link>.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className={`mt-6 px-8 py-3.5 rounded-2xl font-black tracking-wide transition shadow-lg active:scale-95 flex items-center gap-2 disabled:opacity-70
              ${saved ? "bg-green-500 text-white shadow-green-200" : "bg-[#E83C7E] text-white hover:bg-[#D43372] shadow-[#E83C7E]/20"}`}
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" />Guardando...</>
            ) : saved ? (
              <><Check size={16} />Guardado</>
            ) : "Guardar Cambios"}
          </button>
        </div>

        <div className="shrink-0 flex flex-col items-start xl:w-64">
           <label className="block text-sm font-bold text-slate-700 mb-4">Foto de perfil</label>
           
           <div className="relative group">
              <div className="w-48 h-48 rounded-full overflow-hidden shadow-xl border border-slate-100 relative">
                 <img src="https://i.pravatar.cc/300?img=11" alt="Profile Large" className="w-full h-full object-cover" />
                 
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera size={32} className="text-white" />
                 </div>
              </div>
           </div>
           
           <p className="text-xs text-slate-400 font-medium mt-6 text-left max-w-[200px]">
             Te recomendamos usar una imagen cuadrada en formato JPG o PNG.
           </p>
        </div>

      </div>
    </div>
  );
}