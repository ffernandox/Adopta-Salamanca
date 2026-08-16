"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { 
  X, UploadCloud, Check, PawPrint, Activity, 
  AlertTriangle, AlertCircle, FileImage, Trash2, Hash, Building2
} from "lucide-react";
import HealthAndSafetyTwoToneIcon from '@mui/icons-material/HealthAndSafetyTwoTone';
import MedicalInformationTwoToneIcon from '@mui/icons-material/MedicalInformationTwoTone';
import HealingTwoToneIcon from '@mui/icons-material/HealingTwoTone';

interface CustomPickerProps {
  icon?: React.ElementType; 
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onOpen?: (element: HTMLDivElement) => void; 
}

const CustomPicker = ({ 
  icon: Icon, 
  value, 
  options, 
  onChange, 
  placeholder = "Seleccionar...", 
  disabled = false,
  onOpen 
}: CustomPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const pickerRef = useRef<HTMLDivElement>(null);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
  };

  const handleOpenClick = () => {
    if (!disabled) {
      setIsOpen(true);
      if (onOpen && pickerRef.current) {
        onOpen(pickerRef.current);
      }
    }
  };

  return (
    <div ref={pickerRef} className={`relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div 
        onClick={handleOpenClick}
        className={`w-full bg-gray-50/50 border ${isOpen ? 'border-blue-400 ring-2 ring-black/5' : 'border-gray-200'} rounded-xl ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3 text-sm font-medium text-gray-900 cursor-pointer flex items-center justify-between transition hover:border-gray-300`}
      >
        <div className="flex items-center gap-2 overflow-hidden">
          {Icon && <Icon className="absolute left-4 text-gray-400" size={18} />}
          {value ? (
            <motion.span key={value} initial={{ y: -5, opacity: 0, x: -2 }} animate={{ y: 0, opacity: 1, x: [2, -2, 2, 0] }} transition={{ duration: 0.3 }} className="font-bold text-gray-900 truncate">
              {value}
            </motion.span>
          ) : (
            <span className="text-gray-400 font-normal truncate">{placeholder}</span>
          )}
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-xs text-gray-400 shrink-0 ml-2">▼</motion.span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[85000]" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="absolute left-0 top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-[85001] py-2 overflow-hidden">
              <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col items-center gap-1 scroll-smooth px-2">
                {options.map((opt: string) => {
                  const isSelected = opt === value;
                  return (
                    <motion.div key={opt} onClick={() => handleSelect(opt)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} className={`w-full py-2.5 px-3 cursor-pointer text-center transition-colors relative flex justify-center items-center rounded-xl ${isSelected ? "text-base font-black text-gray-900" : "text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                      {isSelected && <motion.div layoutId={`activeSelectIndicator-${placeholder}`} className="absolute inset-0 bg-blue-50 rounded-xl -z-10 border border-blue-100/50" />}
                      {opt}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};


interface CreatePetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_FORM_STATE = {
  name: "",
  type: "Perro",
  center: "Norte",
  ageNumber: "",
  ageUnit: "Años",
  gender: "Macho",
  size: "Mediano",
  sterilized: false,
  vaccinated: false,
  enfermedades: false,
  description: ""
};

export default function CreatePetModal({ isOpen, onClose }: CreatePetModalProps) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [extraFiles, setExtraFiles] = useState<(File | null)[]>([null, null, null, null]);
  const extraInputRefs = useRef<(HTMLInputElement | null)[]>([null, null, null, null]);
  
  const [showWarning, setShowWarning] = useState(false);
  const controls = useAnimation();

  const [closeAttempts, setCloseAttempts] = useState(0);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const formContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const isDirty = JSON.stringify(formData) !== JSON.stringify(INITIAL_FORM_STATE) || selectedFile !== null || extraFiles.some(Boolean);

  const handleCloseAttempt = () => {
    if (!isDirty) {
      resetAndClose();
      return;
    }

    if (closeAttempts === 0) {
      setShowWarning(true);
      controls.start({
        x: [0, -10, 10, -10, 10, 0],
        transition: { duration: 0.4 }
      });
      setCloseAttempts(1);
      setTimeout(() => setShowWarning(false), 2000);
    } else {
      setShowExitConfirmation(true);
    }
  };

  const resetAndClose = () => {
    onClose();
    setShowExitConfirmation(false);
    setTimeout(() => {
        setFormData(INITIAL_FORM_STATE);
        setSelectedFile(null);
        setExtraFiles([null, null, null, null]);
        setCloseAttempts(0);
        setShowWarning(false);
    }, 300);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
      setSelectedFile(file);
    } else {
      alert("Por favor selecciona una imagen válida (PNG, JPG, GIF) menor a 5MB.");
    }
  };

  const scrollToMakeVisible = (element: HTMLDivElement) => {
    setTimeout(() => {
      if (!formContainerRef.current || !element) return;

      const container = formContainerRef.current;
      const elementRect = element.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const estimatedDropdownHeight = 250; 
      
      const elementBottomEdge = elementRect.bottom + estimatedDropdownHeight;
      const containerBottomEdge = containerRect.bottom;

      if (elementBottomEdge > containerBottomEdge) {
        const scrollAmount = elementBottomEdge - containerBottomEdge + 20;
        
        container.scrollBy({
          top: scrollAmount,
          behavior: 'smooth' 
        });
      }
    }, 100);
  };


  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);

    const centroMap: Record<string, string> = {
      "Centro Norte": "Norte",
      "Centro Sur":   "Sur",
      "Centro Este":  "Este",
    };

    let fotoUrl: string | null = null;
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("fotos-mascotas")
        .upload(fileName, selectedFile, { cacheControl: "3600", upsert: false });
      if (!uploadError && uploadData) {
        const { data: urlData } = supabase.storage.from("fotos-mascotas").getPublicUrl(uploadData.path);
        fotoUrl = urlData.publicUrl;
      }
    }

    const fotosUrls: string[] = [];
    for (const file of extraFiles) {
      if (!file) continue;
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data: uploadData } = await supabase.storage
        .from("fotos-mascotas")
        .upload(fileName, file, { cacheControl: "3600", upsert: false });
      if (uploadData) {
        const { data: urlData } = supabase.storage.from("fotos-mascotas").getPublicUrl(uploadData.path);
        fotosUrls.push(urlData.publicUrl);
      }
    }

    const { error: insertError } = await supabase.from("mascotas").insert({
      nombre:       formData.name,
      especie:      formData.type.toLowerCase(),
      edad:         parseInt(formData.ageNumber) || 1,
      genero:       formData.gender,
      esterilizado: formData.sterilized,
      descripcion:  formData.description || null,
      centro:       centroMap[formData.center] ?? "Norte",
      foto_url:     fotoUrl,
      fotos_urls:   fotosUrls.length > 0 ? fotosUrls : null,
      urgente:      false,
      activo:       true,
      disponible:   true,
    });

    setSaving(false);

    if (insertError) {
      console.error("Error guardando mascota:", insertError.message);
      setSaveError(insertError.message);
      return;
    }

    resetAndClose();
  };

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          
          <div className="fixed inset-0 z-[6000] flex items-center justify-center p-4">
            
            {/* BACKDROP */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ 
                  opacity: 1,
                  backgroundColor: showWarning ? "rgba(239, 68, 68, 0.2)" : "rgba(15, 23, 42, 0.6)"
              }}
              exit={{ opacity: 0 }}
              onClick={handleCloseAttempt}
              className="absolute inset-0 backdrop-blur-sm transition-colors duration-300"
            />

            <AnimatePresence>
              {showWarning && (
                  <motion.div 
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-10 z-[10000] bg-rose-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 font-bold text-sm pointer-events-none"
                  >
                      <AlertCircle size={18} className="text-white fill-white/20"/>
                      ¡Cuidado! Tienes cambios sin guardar. (Haz clic de nuevo para salir)
                  </motion.div>
              )}
            </AnimatePresence>

            {/* CARD DEL FORMULARIO */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={controls}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`relative w-full max-w-2xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ${showWarning ? 'ring-4 ring-rose-200' : ''}`}
            >
              
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                  <div>
                      <h2 className="text-2xl font-black text-gray-900">Registrar Nuevo Huésped</h2>
                      <p className="text-gray-500 text-sm">Completa la información para publicar una nueva mascota.</p>
                  </div>
                  
                  <button onClick={handleCloseAttempt} className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition">
                      <X size={20} className="text-gray-500"/>
                  </button>
              </div>

             
              <div ref={formContainerRef} className="p-8 overflow-y-auto custom-scrollbar">
                  <form id="newPetForm" onSubmit={handleSubmit} className="flex flex-col gap-8">
                      
                      <div className="flex flex-col gap-3">
                          <label className="text-sm font-bold text-gray-700">Fotografía Principal</label>
                          <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`relative w-full border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 ${isDragging ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-gray-300 bg-gray-50/30 hover:bg-gray-50 hover:border-gray-400'}`}
                          >
                            <input 
                              type="file" 
                              ref={fileInputRef} 
                              onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])} 
                              accept="image/png, image/jpeg, image/jpg, image/webp, image/gif" 
                              className="hidden" 
                            />
                            
                            <AnimatePresence mode="wait">
                              {!selectedFile ? (
                                <motion.div key="upload" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-blue-500 mb-4">
                                    <UploadCloud size={26} strokeWidth={2.5} />
                                  </div>
                                  <h4 className="text-base font-bold text-gray-900">Arrastra y suelta tu imagen</h4>
                                  <p className="text-xs text-gray-400 font-medium mt-1 mb-5">SVG, PNG, JPG o GIF hasta 5MB</p>
                                  <button type="button" onClick={() => fileInputRef.current?.click()} className="px-5 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all flex items-center gap-2">
                                    Buscar archivo
                                  </button>
                                </motion.div>
                              ) : (
                                <motion.div key="file" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 w-full max-w-md">
                                  <div className="w-12 h-12 bg-blue-50 rounded-xl text-blue-600 flex items-center justify-center shrink-0">
                                    <FileImage size={24} />
                                  </div>
                                  <div className="flex-1 min-w-0 text-left">
                                    <p className="text-sm font-bold text-gray-900 truncate">{selectedFile.name}</p>
                                    <p className="text-xs text-gray-500 font-medium">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                  </div>
                                  <button type="button" onClick={() => setSelectedFile(null)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0">
                                    <Trash2 size={18} />
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-bold text-gray-700">Fotos Adicionales</label>
                          <span className="text-xs text-gray-400 font-medium">{extraFiles.filter(Boolean).length}/4 subidas</span>
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                          {extraFiles.map((file, idx) => {
                            const preview = file ? URL.createObjectURL(file) : null;
                            return (
                              <div key={idx} className="relative aspect-square">
                                {preview ? (
                                  <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm group">
                                    <img src={preview} alt={`Foto ${idx+2}`} className="w-full h-full object-cover" />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = [...extraFiles];
                                        updated[idx] = null;
                                        setExtraFiles(updated);
                                      }}
                                      className="absolute top-1.5 right-1.5 bg-rose-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-md"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => extraInputRefs.current[idx]?.click()}
                                    className="w-full h-full rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/30 transition flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-blue-500"
                                  >
                                    <UploadCloud size={20} strokeWidth={2} />
                                    <span className="text-[10px] font-bold">Foto {idx + 2}</span>
                                  </button>
                                )}
                                <input
                                  type="file"
                                  ref={(el) => { extraInputRefs.current[idx] = el; }}
                                  accept="image/png, image/jpeg, image/jpg, image/webp"
                                  className="hidden"
                                  onChange={(e) => {
                                    const f = e.target.files?.[0];
                                    if (!f) return;
                                    if (f.size > 5 * 1024 * 1024) { alert("Máximo 5MB por foto"); return; }
                                    const updated = [...extraFiles];
                                    updated[idx] = f;
                                    setExtraFiles(updated);
                                  }}
                                />
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-xs text-gray-400 font-medium">Estas fotos aparecerán en la galería del perfil de la mascota.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          <div className="space-y-2">
                              <div className="flex justify-between">
                                  <label className="text-sm font-bold text-gray-700">Nombre</label>
                                  <span className="text-xs text-gray-400">{formData.name.length}/15</span>
                              </div>
                              <input 
                                  type="text" 
                                  placeholder="Ej. Rocky" 
                                  maxLength={15}
                                  required
                                  value={formData.name} 
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="text-gray-900 w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition bg-gray-50/50 font-medium"
                              />
                          </div>
                          
                          <div className="space-y-2 relative z-50">
                              <label className="text-sm font-bold text-gray-700">Centro / Ubicación</label>
                              <CustomPicker 
                                icon={Building2} 
                                value={formData.center} 
                                options={["Centro Norte", "Centro Sur", "Centro Este"]} 
                                onChange={(val) => setFormData({...formData, center: val})}
                                onOpen={scrollToMakeVisible} 
                              />
                          </div>

                          <div className="space-y-2 relative z-40">
                              <label className="text-sm font-bold text-gray-700">Especie</label>
                              <div className="flex gap-2">
                                  {['Perro', 'Gato'].map(type => (
                                      <button 
                                          key={type}
                                          type="button"
                                          onClick={() => setFormData({...formData, type})}
                                          className={`flex-1 py-3 rounded-xl font-bold border transition flex items-center justify-center gap-2
                                              ${formData.type === type ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}
                                          `}
                                      >
                                          {type === 'Perro' ? <PawPrint size={16}/> : <Activity size={16}/>}
                                          {type}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          <div className="space-y-2 relative z-30">
                              <label className="text-sm font-bold text-gray-700">Edad Aproximada</label>
                              <div className="flex gap-3">
                                <div className="relative flex-1">
                                  <Hash className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                  <input 
                                    required 
                                    type="text" 
                                    maxLength={2}
                                    value={formData.ageNumber} 
                                    onChange={(e) => {
                                      const onlyNums = e.target.value.replace(/\D/g, '');
                                      setFormData({...formData, ageNumber: onlyNums});
                                    }} 
                                    placeholder="Ej. 2" 
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition"
                                  />
                                </div>
                                <div className="w-[120px] shrink-0">
                                  <CustomPicker 
                                    value={formData.ageUnit} 
                                    options={["Meses", "Años"]} 
                                    onChange={(val) => setFormData({...formData, ageUnit: val})}
                                    onOpen={scrollToMakeVisible}
                                  />
                                </div>
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="text-sm font-bold text-gray-700 mb-3 block">Estado de Salud</label>
                          <div className="grid grid-cols-2 gap-4">
                              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${formData.sterilized ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${formData.sterilized ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                      {formData.sterilized && <Check size={14} className="text-white"/>}
                                  </div>
                                  <input type="checkbox" className="hidden" checked={formData.sterilized} onChange={() => setFormData({...formData, sterilized: !formData.sterilized})}/>
                                  <div className="flex items-center gap-2">
                                      <HealthAndSafetyTwoToneIcon className={formData.sterilized ? "text-green-600" : "text-gray-400"} fontSize="medium"/>
                                      <span className={`text-sm ${formData.sterilized ? "font-bold text-green-800" : "font-medium text-gray-600"}`}>Esterilizado</span>
                                  </div>
                              </label>

                              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${formData.vaccinated ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${formData.vaccinated ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                      {formData.vaccinated && <Check size={14} className="text-white"/>}
                                  </div>
                                  <input type="checkbox" className="hidden" checked={formData.vaccinated} onChange={() => setFormData({...formData, vaccinated: !formData.vaccinated})}/>
                                  <div className="flex items-center gap-2">
                                      <MedicalInformationTwoToneIcon className={formData.vaccinated ? "text-green-600" : "text-gray-400"} fontSize="medium"/>
                                      <span className={`text-sm ${formData.vaccinated ? "font-bold text-green-800" : "font-medium text-gray-600"}`}>Vacunado</span>
                                  </div>
                              </label>

                              <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 ${formData.enfermedades ? 'border-green-500 bg-green-50/30' : 'border-gray-200 hover:bg-gray-50'}`}>
                                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors shrink-0 ${formData.enfermedades ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                      {formData.enfermedades && <Check size={14} className="text-white"/>}
                                  </div>
                                  <input type="checkbox" className="hidden" checked={formData.enfermedades} onChange={() => setFormData({...formData, enfermedades: !formData.enfermedades})}/>
                                  <div className="flex items-center gap-2">
                                      <HealingTwoToneIcon className={formData.enfermedades ? "text-green-600" : "text-gray-400"} fontSize="medium"/>
                                      <span className={`text-sm ${formData.enfermedades ? "font-bold text-green-800" : "font-medium text-gray-600"}`}>Enfermedades</span>
                                  </div>
                              </label>
                          </div>
                      </div>

                      <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Historia / Descripción</label>
                          <textarea 
                              rows={4} 
                              placeholder="Cuenta un poco sobre su personalidad..." 
                              value={formData.description}
                              onChange={(e) => setFormData({...formData, description: e.target.value})}
                              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition bg-gray-50/50 font-medium resize-none custom-scrollbar"
                          ></textarea>
                      </div>
                  </form>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3 sticky bottom-0 z-10">
                  <button onClick={handleCloseAttempt} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition">
                      Cancelar
                  </button>
                  <div className="flex flex-col items-end gap-1">
                    {saveError && (
                      <p className="text-xs text-red-500 font-medium max-w-[220px] text-right">{saveError}</p>
                    )}
                    <button 
                      type="submit" 
                      form="newPetForm"
                      disabled={!formData.name || !formData.ageNumber || saving}
                      className="px-8 py-3 rounded-xl font-bold bg-[#D9F99D] text-black hover:shadow-lg hover:-translate-y-0.5 transition flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
                    >
                      {saving ? (
                        <><div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />Guardando...</>
                      ) : (
                        <><Check size={18} />Guardar Mascota</>
                      )}
                    </button>
                  </div>
              </div>
            </motion.div>
          </div>

        
          <AnimatePresence>
            {showExitConfirmation && (
              <>
                <motion.div 
                   initial={{ opacity: 0 }} 
                   animate={{ opacity: 1 }} 
                   exit={{ opacity: 0 }}
                   onClick={() => setShowExitConfirmation(false)}
                   className="fixed inset-0 z-[7000] bg-slate-900/60 backdrop-blur-md" 
                />
                
                <div className="fixed inset-0 z-[7001] flex items-center justify-center p-4 pointer-events-none">
                  <motion.div 
                     initial={{ opacity: 0, scale: 0.95, y: 20 }}
                     animate={{ opacity: 1, scale: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95, y: 20 }}
                     className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-center border border-white/50 pointer-events-auto"
                  >
                     <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle size={32} className="text-red-500" />
                     </div>
                     
                     <h3 className="text-xl font-bold text-slate-900 mb-2">¿Descartar cambios?</h3>
                     <p className="text-sm text-gray-500 mb-6">
                        Tienes información sin guardar. Si sales ahora, perderás todos los datos capturados.
                     </p>
                     
                     <div className="flex gap-3">
                        <button 
                          onClick={() => setShowExitConfirmation(false)} 
                          className="flex-1 py-3 rounded-xl font-bold text-slate-700 bg-gray-100 hover:bg-gray-200 transition"
                        >
                          Regresar
                        </button>
                        <button 
                          onClick={resetAndClose} 
                          className="flex-1 py-3 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition shadow-lg shadow-red-200"
                        >
                          Descartar
                        </button>
                     </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

        </>
      )}
    </AnimatePresence>,
    document.body
  );
}