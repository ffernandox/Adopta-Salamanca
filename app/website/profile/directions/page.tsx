"use client";

import React, { useState } from "react";
import { Home, FileText, UploadCloud, Edit2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const mockCPData: Record<string, { state: string, city: string, colonias: string[] }> = {
    "36700": { state: "Guanajuato", city: "Salamanca", colonias: ["Centro", "Bellavista", "San Juan", "Guanajuato"] },
    "36730": { state: "Guanajuato", city: "Salamanca", colonias: ["Nativitas", "El Deportivo", "Tampico"] },
    "36800": { state: "Guanajuato", city: "Irapuato", colonias: ["Centro", "Barrio de San José", "Los Cobos"] },
};

interface DirectionInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  isSelect?: boolean;
  options?: string[];
  isTextarea?: boolean;
}

const DirectionInput = ({ label, isSelect, options, isTextarea, disabled, ...props }: DirectionInputProps) => (
  <div className="w-full">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
    <div className="relative">
      {isSelect ? (
        <>
          <select 
            disabled={disabled}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
            className={`w-full border rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all appearance-none
              ${disabled ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed opacity-70' : 'bg-white border-slate-200 text-slate-800 focus:border-[#E83C7E] focus:ring-2 focus:ring-[#E83C7E]/20'}
            `}
          >
            <option value="">Selecciona una opción...</option>
            {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</span>
        </>
      ) : isTextarea ? (
        <textarea
            disabled={disabled}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            className={`w-full border rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all resize-none custom-scrollbar placeholder:font-medium placeholder:text-slate-400
                ${disabled ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed opacity-70' : 'bg-white border-slate-200 text-slate-800 focus:border-[#E83C7E] focus:ring-2 focus:ring-[#E83C7E]/20'}
            `}
            rows={3}
        />
      ) : (
        <input 
          disabled={disabled}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
          className={`w-full border rounded-2xl px-4 py-3 text-sm font-bold outline-none transition-all placeholder:font-medium placeholder:text-slate-400
            ${disabled ? 'bg-slate-50 border-slate-100 text-slate-500 cursor-not-allowed opacity-70' : 'bg-white border-slate-200 text-slate-800 focus:border-[#E83C7E] focus:ring-2 focus:ring-[#E83C7E]/20'}
          `}
        />
      )}
    </div>
  </div>
);

export default function DirectionsPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [hasDocument, setHasDocument] = useState(true);
  
  const [availableColonias, setAvailableColonias] = useState<string[]>(mockCPData["36700"].colonias);

  const [formData, setFormData] = useState({
    zipCode: "36700",
    state: "Guanajuato",
    city: "Salamanca",
    colonia: "Centro",
    street: "Zaragoza",
    numExt: "102",
    numInt: "",
    references: "Casa blanca con portón negro, frente a la panadería."
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "zipCode") {
        const newZip = value.replace(/\D/g, '').slice(0, 5);
        
        if (newZip.length === 5) {
            const data = mockCPData[newZip];
            if (data) {
                setAvailableColonias(data.colonias);
                setFormData(prev => ({
                    ...prev,
                    zipCode: newZip,
                    state: data.state,
                    city: data.city,
                    colonia: data.colonias[0] || "" 
                }));
            } else {
                setAvailableColonias([]);
                setFormData(prev => ({ ...prev, zipCode: newZip, state: "", city: "", colonia: "" }));
            }
        } else {
            setAvailableColonias([]);
            setFormData(prev => ({ ...prev, zipCode: newZip, state: "", city: "", colonia: "" }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = 
    formData.zipCode.length === 5 && 
    formData.state !== "" &&
    formData.colonia !== "" && 
    formData.street.length >= 3 && 
    formData.numExt !== "" && 
    formData.references.length >= 15;

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;
      
      console.log("Dirección guardada de forma segura:", formData);
      setIsEditing(false);
  };

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">
      
      <div className="mb-10">
        <h2 className="text-2xl font-black text-slate-800 mb-2">Mis Direcciones</h2>
        <p className="text-sm text-slate-500 font-medium">
          Asegúrate de proporcionar una dirección exacta. Separa tu calle de tu número exterior para asegurar una validación correcta en tu proceso de adopción.
        </p>
      </div>

      <div className="divide-y divide-slate-100">

        {/* SECCIÓN 1: DIRECCIÓN RESIDENCIAL */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-10 relative">
          <div className="md:col-span-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2">
              <Home size={16} className="text-[#E83C7E]" />
              Domicilio Actual
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed mb-4">
              Ingresa tu Código Postal y el sistema llenará automáticamente tu Estado y Municipio. Las referencias son obligatorias para ubicar tu casa.
            </p>
            
            {!isEditing && (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:border-[#E83C7E] hover:text-[#E83C7E] px-4 py-2 rounded-xl transition-all shadow-sm"
                >
                  <Edit2 size={14} /> Editar Dirección
                </button>
            )}
          </div>
          
          <form onSubmit={handleSave} className="md:col-span-2 space-y-5">
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="relative">
                 <DirectionInput 
                   label="Código Postal" 
                   name="zipCode"
                   placeholder="Ej. 36700"
                   value={formData.zipCode}
                   onChange={handleChange}
                   disabled={!isEditing} 
                 />
                 {isEditing && formData.zipCode.length === 5 && formData.state && (
                    <CheckCircle2 size={16} className="absolute right-4 top-10 text-emerald-500 pointer-events-none" />
                 )}
              </div>
              <DirectionInput 
                label="Estado" 
                name="state"
                value={formData.state || "Ingresa CP..."}
                disabled 
              />
              <DirectionInput 
                label="Municipio" 
                name="city"
                value={formData.city || "Ingresa CP..."}
                disabled 
              />
            </div>

            <DirectionInput 
                label="Colonia / Asentamiento" 
                name="colonia"
                isSelect
                options={availableColonias}
                value={formData.colonia}
                onChange={handleChange}
                disabled={!isEditing || availableColonias.length === 0} 
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                <div className="sm:col-span-6">
                    <DirectionInput 
                        label="Calle" 
                        name="street"
                        placeholder="Ej. Av. Zaragoza"
                        value={formData.street}
                        onChange={handleChange}
                        disabled={!isEditing} 
                    />
                </div>
                <div className="sm:col-span-3">
                    <DirectionInput 
                        label="No. Exterior" 
                        name="numExt"
                        placeholder="Ej. 102 o S/N"
                        value={formData.numExt}
                        onChange={handleChange}
                        disabled={!isEditing} 
                    />
                </div>
                <div className="sm:col-span-3">
                    <DirectionInput 
                        label="No. Interior" 
                        name="numInt"
                        placeholder="Opcional"
                        value={formData.numInt}
                        onChange={handleChange}
                        disabled={!isEditing} 
                    />
                </div>
            </div>

            <div>
                <DirectionInput 
                    label="Referencias de la casa (Obligatorio)" 
                    name="references"
                    isTextarea
                    placeholder="Describe el color de tu casa, portón, si está cerca de un parque, negocio, etc. Mínimo 15 caracteres."
                    value={formData.references}
                    onChange={handleChange}
                    disabled={!isEditing} 
                />
                {isEditing && formData.references.length < 15 && (
                    <p className="text-xs text-amber-500 font-bold mt-2">
                        Faltan {15 - formData.references.length} caracteres para una referencia válida.
                    </p>
                )}
            </div>

            {isEditing && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                   <button 
                     type="button"
                     onClick={() => setIsEditing(false)}
                     className="px-6 py-3 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 transition"
                   >
                     Cancelar
                   </button>
                   <button 
                     type="submit"
                     disabled={!isFormValid}
                     className="bg-slate-900 text-white px-8 py-3 rounded-xl text-sm font-black hover:bg-slate-800 transition shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                   >
                     Guardar Domicilio
                   </button>
                </motion.div>
            )}
          </form>
        </section>

        {/* SECCIÓN 2: COMPROBANTE DE DOMICILIO */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 py-10">
          <div className="md:col-span-1">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-2">
              <FileText size={16} className="text-[#E83C7E]" />
              Comprobante
            </h3>
            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Sube un recibo de luz, agua o teléfono no mayor a 3 meses de antigüedad. Esto valida tu información ante los albergues.
            </p>
          </div>
          
          <div className="md:col-span-2">
            
            {hasDocument ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-between">
                    <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">Comprobante validado</h4>
                            <p className="text-xs text-slate-500 font-medium mt-0.5">recibo_luz_febrero_2026.pdf</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => setHasDocument(false)}
                      className="px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-xs font-bold hover:text-red-500 hover:border-red-200 transition shadow-sm"
                    >
                      Reemplazar
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#E83C7E]/50 transition-colors cursor-pointer group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-400 group-hover:text-[#E83C7E] shadow-sm mb-4 transition-colors">
                        <UploadCloud size={28} />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Haz clic o arrastra tu archivo aquí</h4>
                    <p className="text-xs text-slate-500 font-medium">Soporta PDF, JPG o PNG (Max 5MB)</p>
                    <input type="file" className="hidden" />
                    
                    <button 
                      onClick={() => setHasDocument(true)}
                      className="mt-6 bg-[#E83C7E] text-white px-6 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-[#E83C7E]/20 hover:scale-105 transition-transform"
                    >
                      Seleccionar Archivo
                    </button>
                </div>
            )}
            
          </div>
        </section>

      </div>
    </div>
  );
}