"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, Check, Home, Building, Tent, 
  Image as ImageIcon, FileText, AlertCircle, 
  Search, MapPin, ExternalLink, UploadCloud,
  AlertTriangle, Calendar, ChevronDown, Info
} from "lucide-react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface PetData {
  id?: string;
  name: string;
  shelter: string;
}

interface CreateApplicationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  selectedPet?: PetData | null;
}

const STEPS = ["Datos Personales", "Perfil del Hogar", "Documentos", "Revisión"];

const INITIAL_DATA = {
  firstName: "",
  lastName: "",
  dob: "",
  gender: "",
  phone: "",
  email: "",
  petInterest: "",
  housingType: "",
  housingOwnership: "Propia",
  outdoorSpace: "Patio bardeado",
  hasChildren: "No",
  hasOtherPets: "No",
  otherPetsDetails: "",
  hoursAlone: "0 a 4 horas",
  sleepLocation: "Dentro de casa",
  familyAgreement: "Sí",
};


interface CustomDatePickerProps {
  value: string;
  onChange: (date: string) => void;
  isValid?: boolean;
}

const CustomDatePicker = ({ value, onChange, isValid }: CustomDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<'month' | 'year' | null>(null);
  const [savedScroll, setSavedScroll] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  
  const parseDateString = (dateStr: string) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const initialDate = parseDateString(value) || new Date(2000, 0, 1);
  const [tempDate, setTempDate] = useState<Date | null>(parseDateString(value));
  const [navMonth, setNavMonth] = useState(initialDate.getMonth());
  const [navYear, setNavYear] = useState(initialDate.getFullYear());

  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1945 + 1 }, (_, i) => currentYear - i);

  const closePicker = () => {
    setIsOpen(false);
    setDropdownOpen(null);
    const scrollArea = document.getElementById("drawer-scroll-area");
    if (scrollArea) {
      scrollArea.scrollTo({ top: savedScroll, behavior: "smooth" });
    }
  };

  const togglePicker = () => {
    const scrollArea = document.getElementById("drawer-scroll-area");
    if (!isOpen) {
      if (scrollArea) {
        setSavedScroll(scrollArea.scrollTop);
        setTimeout(() => {
          containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
      setTempDate(parseDateString(value));
      setIsOpen(true);
    } else {
      closePicker();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closePicker();
      }
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleApply = () => {
    if (tempDate) {
      const formattedDate = `${tempDate.getFullYear()}-${String(tempDate.getMonth() + 1).padStart(2, '0')}-${String(tempDate.getDate()).padStart(2, '0')}`;
      onChange(formattedDate);
    }
    closePicker();
  };

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; 
  };

  const daysInCurrentMonth = getDaysInMonth(navYear, navMonth);
  const firstDayIndex = getFirstDayOfMonth(navYear, navMonth);
  const daysInPrevMonth = getDaysInMonth(navYear, navMonth === 0 ? 11 : navMonth - 1);

  const displayValue = value ? value.split("-").reverse().join("/") : "DD/MM/YYYY";

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={togglePicker}
        className={`w-full p-3.5 rounded-xl border text-sm font-bold flex items-center justify-between cursor-pointer transition-all bg-white
          ${isOpen ? 'border-blue-500 ring-2 ring-blue-50' : isValid ? 'border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10 text-slate-900' : 'border-gray-200 hover:border-blue-400 text-slate-900'}`}
      >
        <span>{displayValue}</span>
        {isValid && !isOpen ? <Check size={18} className="text-emerald-500" /> : <Calendar size={18} className={value ? "text-blue-600" : "text-slate-400"} />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 md:left-auto md:right-0 mt-2 w-[320px] bg-white rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-[7000] p-5 overflow-visible"
          >
            <div className="flex items-center justify-between gap-3 mb-6 relative z-10">
              <div className="relative flex-1">
                <button 
                  type="button"
                  onClick={() => setDropdownOpen(dropdownOpen === 'month' ? null : 'month')}
                  className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-sm hover:bg-slate-100 transition-colors"
                >
                  <span>{months[navMonth]}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <AnimatePresence>
                  {dropdownOpen === 'month' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-100 shadow-xl rounded-xl z-50 max-h-48 overflow-y-auto custom-scrollbar"
                    >
                      {months.map((m, i) => (
                        <button 
                          key={`month-opt-${i}`} type="button" 
                          onClick={() => { setNavMonth(i); setDropdownOpen(null); }}
                          className={`w-full text-left px-3 py-2 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors ${navMonth === i ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                          {m}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative flex-1">
                <button 
                  type="button"
                  onClick={() => setDropdownOpen(dropdownOpen === 'year' ? null : 'year')}
                  className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 text-slate-800 font-bold py-2.5 px-3 rounded-xl text-sm hover:bg-slate-100 transition-colors"
                >
                  <span>{navYear}</span>
                  <ChevronDown size={14} className="text-slate-400" />
                </button>
                <AnimatePresence>
                  {dropdownOpen === 'year' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-100 shadow-xl rounded-xl z-50 max-h-48 overflow-y-auto custom-scrollbar"
                    >
                      {years.map((y) => (
                        <button 
                          key={`year-opt-${y}`} type="button" 
                          onClick={() => { setNavYear(y); setDropdownOpen(null); }}
                          className={`w-full text-left px-3 py-2 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors ${navYear === y ? 'bg-blue-50 text-blue-600' : 'text-slate-600'}`}
                        >
                          {y}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="grid grid-cols-7 mb-2">
              {['LUN', 'MAR', 'MIE', 'JUE', 'VIE', 'SAB', 'DOM'].map((day, i) => (
                <div key={`day-header-${i}`} className="text-[10px] font-black text-slate-400 text-center uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-y-1 gap-x-1 mb-6 relative z-0">
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-prev-${i}`} className="h-9 flex items-center justify-center text-sm font-medium text-slate-300">
                  {daysInPrevMonth - firstDayIndex + i + 1}
                </div>
              ))}
              
              {Array.from({ length: daysInCurrentMonth }).map((_, i) => {
                const dayNumber = i + 1;
                const isSelected = tempDate?.getDate() === dayNumber && 
                                   tempDate?.getMonth() === navMonth && 
                                   tempDate?.getFullYear() === navYear;

                return (
                  <button
                    key={`day-btn-${dayNumber}`}
                    type="button"
                    onClick={() => setTempDate(new Date(navYear, navMonth, dayNumber))}
                    className={`h-9 w-9 mx-auto rounded-xl flex items-center justify-center text-sm font-bold transition-all
                      ${isSelected 
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                        : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                  >
                    {dayNumber}
                  </button>
                );
              })}

              {Array.from({ length: 42 - (firstDayIndex + daysInCurrentMonth) }).map((_, i) => (
                <div key={`empty-next-${i}`} className="h-9 flex items-center justify-center text-sm font-medium text-slate-300">
                  {i + 1}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button 
                type="button"
                onClick={closePicker}
                className="px-5 py-2.5 text-xs font-black text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors uppercase tracking-widest"
              >
                Cancelar
              </button>
              <button 
                type="button"
                onClick={handleApply}
                disabled={!tempDate}
                className="px-6 py-2.5 text-xs font-black bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all disabled:opacity-50 shadow-md shadow-blue-200 uppercase tracking-widest active:scale-95"
              >
                Aplicar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface CustomSelectProps {
    value: string;
    options: string[];
    onChange: (val: string) => void;
    placeholder?: string;
}

const CustomSelect = ({ value, options, onChange, placeholder = "Seleccionar..." }: CustomSelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    return (
        <div className="relative w-full" ref={ref}>
            <button 
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full p-3.5 rounded-xl border text-sm font-bold flex items-center justify-between transition-all bg-white
                  ${isOpen ? 'border-blue-500 ring-2 ring-blue-50 text-blue-600' : 'border-gray-200 hover:border-blue-400 text-slate-900'}
                `}
            >
                <span className="truncate">{value || placeholder}</span>
                <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : 'text-slate-400'}`} />
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 z-[8000] overflow-hidden"
                    >
                        {options.map((opt, i) => (
                            <button
                                key={`select-opt-${i}`}
                                type="button"
                                onClick={() => { onChange(opt); setIsOpen(false); }}
                                className={`w-full text-left px-4 py-3.5 text-sm font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-slate-50 last:border-0
                                    ${value === opt ? 'bg-blue-50/50 text-blue-600' : 'text-slate-700'}
                                `}
                            >
                                {opt}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function CreateApplicationDrawer({ 
  isOpen, 
  onClose, 
  isAdmin = false,
  selectedPet = null 
}: CreateApplicationDrawerProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_DATA);
  const [errorMessage, setErrorMessage] = useState("");
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [emailSuggestions, setEmailSuggestions] = useState<string[]>([]);
  const [showEmailDropdown, setShowEmailDropdown] = useState(false);

  const [prevPet, setPrevPet] = useState(selectedPet?.name || "");
  const [userProfileIsComplete, setUserProfileIsComplete] = useState(false);
  const [mockAddress, setMockAddress] = useState("Sin dirección registrada");
  const [submitting, setSubmitting] = useState(false);

  const emailDomains = ["@gmail.com", "@outlook.com", "@hotmail.com", "@yahoo.com"];

  const derivedPetInterest = selectedPet 
    ? `${selectedPet.name} (${selectedPet.shelter})` 
    : formData.petInterest;

  if (selectedPet && selectedPet.name !== prevPet) {
    setFormData(prev => ({ ...prev, petInterest: selectedPet.name }));
    setPrevPet(selectedPet.name);
  }

  useEffect(() => {
    if (!isOpen) return;
    const loadProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre, apellido, telefono, fecha_nacimiento, genero, direccion")
        .eq("id", session.user.id)
        .single();
      if (perfil) {
        setFormData(prev => ({
          ...prev,
          firstName: perfil.nombre             ?? prev.firstName,
          lastName:  perfil.apellido           ?? prev.lastName,
          phone:     perfil.telefono           ?? prev.phone,
          email:     session.user.email        ?? prev.email,
          dob:       perfil.fecha_nacimiento   ?? prev.dob,
          gender:    perfil.genero             ?? prev.gender,
        }));
        if (perfil.direccion) {
          setMockAddress(perfil.direccion);
          setUserProfileIsComplete(true);
        }
      } else {
        setFormData(prev => ({ ...prev, email: session.user.email ?? prev.email }));
      }
    };
    loadProfile();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 1500);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
      setFormData({...formData, phone: value.replace(/\D/g, '').slice(0, 10)});
    } else if (name === "email") {
      setFormData({...formData, email: value});
      if (value.length > 0 && !value.includes("@")) {
        setEmailSuggestions(emailDomains.map(domain => `${value}${domain}`));
        setShowEmailDropdown(true);
      } else {
        setShowEmailDropdown(false);
      }
    } else {
      setFormData({...formData, [name]: value});
    }
  };

  const handleSelectEmail = (suggestion: string) => {
    setFormData({...formData, email: suggestion});
    setShowEmailDropdown(false);
  };

  const isOver18 = (dateString: string) => {
    if (!dateString) return false;
    const [year, month, day] = dateString.split("-").map(Number);
    const today = new Date();
    const birthDate = new Date(year, month - 1, day);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  };

  const isValidEmail = (email: string) => {
    if (!email) return false; 
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isFieldValid = (field: string) => {
    switch (field) {
      case 'firstName': return formData.firstName.length > 2;
      case 'lastName': return formData.lastName.length > 2;
      case 'phone': return formData.phone.length === 10;
      case 'email': return isValidEmail(formData.email);
      case 'dob': return isOver18(formData.dob);
      default: return false;
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.dob || !formData.phone || !derivedPetInterest || !formData.gender || !formData.email) {
        setErrorMessage("Todos los campos son obligatorios.");
        return false;
      }
      if (!isOver18(formData.dob)) {
        setErrorMessage("Debes ser mayor de 18 años.");
        return false;
      }
      if (!isValidEmail(formData.email)) {
        setErrorMessage("Formato de correo incorrecto.");
        return false;
      }
      if (formData.phone.length !== 10) {
        setErrorMessage("El teléfono debe tener 10 dígitos.");
        return false;
      }
    }
    if (currentStep === 2) {
      if (!isAdmin && !userProfileIsComplete) {
        setErrorMessage("Completa tu dirección en el perfil.");
        return false;
      }
      if (!formData.housingType) {
        setErrorMessage("Selecciona tu tipo de vivienda.");
        return false;
      }
      if (!formData.hoursAlone || !formData.sleepLocation || !formData.familyAgreement) {
        setErrorMessage("Completa todos los detalles del hogar.");
        return false;
      }
    }
    return true;
  };

  const handleNextStep = async () => {
    if (!validateCurrentStep()) return;

    if (currentStep === 4) {
      setSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await supabase.from("solicitudes").insert({
          usuario_id: session.user.id,
          mascota_id: selectedPet?.id ?? null,
          estado:     "pendiente",
          datos_hogar: {
            firstName: formData.firstName,
            lastName:  formData.lastName,
            dob:       formData.dob,
            gender:    formData.gender,
            phone:     formData.phone,
            email:     formData.email,
            housingType:      formData.housingType,
            housingOwnership: formData.housingOwnership,
            outdoorSpace:     formData.outdoorSpace,
            hasChildren:      formData.hasChildren,
            hasOtherPets:     formData.hasOtherPets,
            otherPetsDetails: formData.otherPetsDetails,
            hoursAlone:       formData.hoursAlone,
            sleepLocation:    formData.sleepLocation,
            familyAgreement:  formData.familyAgreement,
          },
        });
      }
      setSubmitting(false);
      resetAndClose();
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handleAttemptClose = () => {
    const isDirty = JSON.stringify(formData) !== JSON.stringify(INITIAL_DATA);
    if (isDirty) setShowExitConfirmation(true);
    else resetAndClose();
  };

  const resetAndClose = () => {
    setShowExitConfirmation(false);
    onClose();
    setTimeout(() => {
      setCurrentStep(1);
      setFormData(INITIAL_DATA);
    }, 300);
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleAttemptClose}
            className="fixed inset-0 z-[6000] bg-slate-900/40 backdrop-blur-sm"
          />
          
          <motion.div
            key="drawer-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-3xl bg-white shadow-2xl z-[6001] flex flex-col rounded-l-[2.5rem] overflow-hidden"
          >
            <div className="pt-10 pb-6 px-10 border-b border-gray-100 text-center relative z-20">
              <button onClick={handleAttemptClose} className="absolute top-6 right-6 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition">
                <X size={20}/>
              </button>
              <h2 className="text-2xl font-black text-slate-900 mb-8 tracking-tight">Nueva Solicitud de Adopción</h2>
              
              <div className="w-full max-w-lg mx-auto flex justify-between relative px-4">
                 <div className="absolute top-4 left-10 right-10 h-[2px] bg-gray-100 -z-10" />
                 {STEPS.map((step, i) => {
                    const stepNum = i + 1;
                    return (
                      <div key={`step-dot-${i}`} className="flex flex-col items-center gap-2 bg-white px-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${currentStep > stepNum ? 'bg-blue-600 text-white' : currentStep === stepNum ? 'bg-blue-600 text-white ring-4 ring-blue-50' : 'bg-white border-2 border-gray-200 text-gray-400'}`}>
                            {currentStep > stepNum ? <Check size={14} strokeWidth={3} /> : stepNum}
                        </div>
                        <span className={`text-[9px] font-black uppercase tracking-wider ${currentStep >= stepNum ? 'text-slate-800' : 'text-gray-400'}`}>{step}</span>
                      </div>
                    );
                 })}
              </div>
            </div>

            <div id="drawer-scroll-area" className="flex-1 overflow-y-auto p-10 bg-slate-50/30 custom-scrollbar relative">
              
              <AnimatePresence>
                  {errorMessage && (
                    <motion.div 
                      key="error-toast" 
                      initial={{ opacity: 0, y: -20, x: "-50%" }} 
                      animate={{ opacity: 1, y: 0, x: "-50%" }} 
                      exit={{ opacity: 0, y: -20, x: "-50%" }} 
                      className="fixed top-32 left-1/2 bg-red-500 text-white p-4 rounded-2xl text-xs font-bold z-[7000] flex items-center gap-3 shadow-xl"
                    >
                        <AlertCircle size={18}/> {errorMessage}
                    </motion.div>
                  )}
              </AnimatePresence>

              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6 pb-20">
                   
                   <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-2xl flex items-center gap-3 shadow-sm">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                        <Info size={16} />
                      </div>
                      <p className="text-sm font-bold text-blue-900">Verifica que tus datos sean correctos para poder continuar.</p>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col h-full justify-end space-y-2 relative">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Nombre*</label>
                        <div className="relative mt-auto">
                          <input name="firstName" value={formData.firstName} onChange={handleChange} className={`w-full p-3.5 rounded-xl border text-sm font-bold outline-none transition-all ${isFieldValid('firstName') ? 'border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10 text-slate-900' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 bg-white'}`} placeholder="Ej. Ana" />
                          {isFieldValid('firstName') && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                        </div>
                      </div>
                      <div className="flex flex-col h-full justify-end space-y-2 relative">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Apellidos*</label>
                        <div className="relative mt-auto">
                          <input name="lastName" value={formData.lastName} onChange={handleChange} className={`w-full p-3.5 rounded-xl border text-sm font-bold outline-none transition-all ${isFieldValid('lastName') ? 'border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10 text-slate-900' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 bg-white'}`} placeholder="Ej. López" />
                          {isFieldValid('lastName') && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col h-full justify-end space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Fecha de nacimiento*</label>
                        <div className="mt-auto">
                            <CustomDatePicker 
                            value={formData.dob}
                            onChange={(date) => setFormData({...formData, dob: date})}
                            isValid={isFieldValid('dob')}
                            />
                        </div>
                      </div>
                      
                      <div className="flex flex-col h-full justify-end space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Género*</label>
                        <div className="mt-auto">
                            <motion.div 
                            animate={!formData.gender ? { x: [-3, 3, -3, 3, 0] } : { x: 0 }}
                            transition={{ repeat: !formData.gender ? Infinity : 0, repeatDelay: 4, duration: 0.4 }}
                            className={`flex items-center gap-6 h-[48px] px-4 rounded-xl border transition-all ${formData.gender ? 'border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10' : 'border-red-400 bg-red-50/30'}`}
                            >
                                {['Masculino', 'Femenino'].map(g => (
                                <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="radio" checked={formData.gender === g} onChange={() => setFormData({...formData, gender: g})} className="w-4 h-4 text-blue-600" />
                                    <span className={`text-sm font-bold ${formData.gender === g ? 'text-slate-900' : 'text-slate-600'}`}>{g}</span>
                                </label>
                                ))}
                            </motion.div>
                            {!formData.gender && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest absolute">Selecciona una opción</p>}
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col h-full justify-end space-y-2 pt-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Teléfono (10 dígitos)*</label>
                        <div className={`mt-auto flex items-center w-full rounded-xl border transition-all overflow-hidden ${isFieldValid('phone') ? 'border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10' : 'border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-50 bg-white'}`}>
                          <div className="flex items-center gap-2 pl-3 pr-2 py-3.5 bg-transparent border-r border-gray-100 select-none">
                             <img src="https://flagcdn.com/w20/mx.png" alt="MX" className="w-5 h-auto rounded-sm shadow-sm" />
                             <span className="text-xs font-bold text-slate-500">+52</span>
                          </div>
                          <input 
                             name="phone" 
                             value={formData.phone} 
                             onChange={handleChange} 
                             maxLength={10} 
                             placeholder="4641234567" 
                             className="flex-1 px-3 py-3.5 text-sm font-bold bg-transparent outline-none text-slate-900 placeholder:text-slate-400 tracking-[0.1em]" 
                          />
                          {isFieldValid('phone') && <Check size={18} className="text-emerald-500 mr-3" />}
                        </div>
                      </div>
                      
                      <div className="flex flex-col h-full justify-end space-y-2 relative pt-4">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Correo Electrónico*</label>
                        <div className="relative mt-auto">
                          <input 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            autoComplete="off"
                            placeholder="usuario@ejemplo.com" 
                            className={`w-full p-3.5 rounded-xl border text-sm font-bold outline-none transition-all ${isFieldValid('email') ? 'border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10 text-slate-900' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-50 bg-white'}`} 
                          />
                          {isFieldValid('email') && !showEmailDropdown && <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />}
                        </div>
                        
                        <AnimatePresence>
                          {showEmailDropdown && (
                            <motion.div 
                              initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                              className="absolute top-full left-0 w-full mt-1 bg-white border border-slate-100 shadow-xl rounded-xl z-50 overflow-hidden"
                            >
                              {emailSuggestions.map((suggestion, idx) => (
                                <button 
                                  key={`email-sugg-${idx}`}
                                  type="button"
                                  onClick={() => handleSelectEmail(suggestion)}
                                  className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors border-b border-slate-50 last:border-0"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                   </div>

                   <div className="flex flex-col h-full justify-end space-y-2 pt-2">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Mascota de Interés*</label>
                      <div className="relative mt-auto">
                        <input 
                          readOnly 
                          disabled 
                          value={derivedPetInterest} 
                          className="w-full p-3.5 rounded-xl border border-emerald-500 ring-2 ring-emerald-50 bg-emerald-50/10 text-sm font-bold text-slate-900 cursor-not-allowed outline-none" 
                        />
                        <Check size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                      </div>
                   </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-20">
                   {!isAdmin && (
                      <div className={`p-5 rounded-[2rem] border flex items-center justify-between transition-all shadow-sm ${userProfileIsComplete ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100 ring-2 ring-rose-200'}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${userProfileIsComplete ? 'bg-white text-emerald-500' : 'bg-white text-rose-500'}`}>
                             {userProfileIsComplete ? <Home size={24}/> : <AlertCircle size={24}/>}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800">{userProfileIsComplete ? mockAddress : "Falta tu dirección oficial"}</p>
                            <p className={`text-[10px] font-black uppercase tracking-wider ${userProfileIsComplete ? 'text-emerald-600' : 'text-rose-600'}`}>
                               {userProfileIsComplete ? "Verificado desde tu perfil" : "Debes completar tu perfil para continuar"}
                            </p>
                          </div>
                        </div>
                        <Link href="/website/profile/directions" className="p-2 bg-white rounded-xl shadow-sm text-slate-400 hover:text-indigo-600 transition">
                          <ExternalLink size={18}/>
                        </Link>
                      </div>
                   )}

                   <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-700">¿En qué tipo de vivienda reside?*</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                            {id:'Casa', icon:Home}, {id:'Departamento', icon:Building}, {id:'Otro', icon:Tent}
                        ].map((t, i) => (
                          <button key={`house-type-${i}`} onClick={()=>setFormData({...formData, housingType: t.id})} className={`p-5 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${formData.housingType === t.id ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-md' : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200'}`}>
                            <t.icon size={28}/> <span className="text-xs font-black">{t.id}</span>
                          </button>
                        ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col h-full justify-end space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">La vivienda es:</label>
                        <div className="mt-auto">
                            <CustomSelect 
                                value={formData.housingOwnership} 
                                options={["Propia", "Rentada", "Vivo con familiares"]} 
                                onChange={(val) => setFormData({...formData, housingOwnership: val})} 
                            />
                        </div>
                      </div>
                      <div className="flex flex-col h-full justify-end space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Espacios al aire libre:</label>
                        <div className="mt-auto">
                            <CustomSelect 
                                value={formData.outdoorSpace} 
                                options={["Patio Bardeado", "Jardín Abierto", "Balcón / Terraza", "Sin espacio exterior"]} 
                                onChange={(val) => setFormData({...formData, outdoorSpace: val})} 
                            />
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 p-5 bg-blue-50/50 border border-blue-100 rounded-3xl">
                      <div className="flex flex-col h-full justify-end space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">¿Cuántas horas estará sola la mascota?</label>
                        <div className="mt-auto">
                            <CustomSelect 
                                value={formData.hoursAlone} 
                                options={["0 a 4 horas", "4 a 8 horas", "Más de 8 horas"]} 
                                onChange={(val) => setFormData({...formData, hoursAlone: val})} 
                            />
                        </div>
                      </div>
                      <div className="flex flex-col h-full justify-end space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">¿Dónde dormirá la mascota?</label>
                        <div className="mt-auto">
                            <CustomSelect 
                                value={formData.sleepLocation} 
                                options={["Dentro de casa", "Patio / Exterior", "Azotea / Cochera"]} 
                                onChange={(val) => setFormData({...formData, sleepLocation: val})} 
                            />
                        </div>
                      </div>
                      <div className="col-span-2 space-y-3 mt-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">¿Están todos de acuerdo con la adopción?</label>
                        <div className="flex gap-4 h-[48px] items-center">
                            {['Sí', 'No'].map((opt, idx) => (
                                <label key={`family-opt-${idx}`} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={formData.familyAgreement === opt} onChange={()=>setFormData({...formData, familyAgreement: opt})} className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-600">{opt}</span>
                                </label>
                            ))}
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col h-full justify-end space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">¿Hay niños pequeños?</label>
                        <div className="flex gap-4 h-[48px] items-center mt-auto">
                            {['Sí', 'No'].map((opt, idx) => (
                                <label key={`children-opt-${idx}`} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={formData.hasChildren === opt} onChange={()=>setFormData({...formData, hasChildren: opt})} className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-600">{opt}</span>
                                </label>
                            ))}
                        </div>
                      </div>
                      <div className="flex flex-col h-full justify-end space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">¿Tiene otras mascotas?</label>
                        <div className="flex gap-4 h-[48px] items-center mt-auto">
                            {['Sí', 'No'].map((opt, idx) => (
                                <label key={`pets-opt-${idx}`} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" checked={formData.hasOtherPets === opt} onChange={()=>setFormData({...formData, hasOtherPets: opt})} className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-bold text-slate-600">{opt}</span>
                                </label>
                            ))}
                        </div>
                      </div>
                   </div>

                   {formData.hasOtherPets === 'Sí' && (
                     <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-3">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">Detalles de mascotas actuales</label>
                        <textarea name="otherPetsDetails" rows={3} value={formData.otherPetsDetails} onChange={handleChange} placeholder="Ej. Dos perros pequeños vacunados..." className="w-full p-4 rounded-xl border border-gray-200 text-sm font-bold focus:border-blue-500 outline-none transition bg-white resize-none" />
                     </motion.div>
                   )}
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                   <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 mb-2">
                      <p className="text-sm text-blue-800 font-bold flex items-center gap-2"><FileText size={16}/> Sube tus documentos para validar la solicitud.</p>
                   </div>
                   {['INE Frontal/Reversa', 'Comprobante Domicilio'].map((doc, i) => (
                      <div key={`doc-${i}`} className="space-y-2">
                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{doc}*</label>
                        <div className="w-full h-32 border-2 border-dashed border-gray-200 hover:border-blue-400 hover:bg-blue-50/50 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer bg-white group transition-all">
                           <UploadCloud className="text-gray-300 group-hover:text-blue-500 transition-colors" size={32} />
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 mt-2">Subir Archivo</p>
                        </div>
                      </div>
                   ))}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                   <div className="p-8 rounded-[3rem] bg-emerald-50 text-emerald-800 border border-emerald-100 flex flex-col items-center text-center shadow-sm">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Check size={40} className="text-emerald-500" strokeWidth={3} />
                      </div>
                      <h3 className="text-2xl font-black mb-1 text-emerald-900 tracking-tight">¡Todo Listo!</h3>
                      <p className="text-sm font-medium text-emerald-700 max-w-xs">Verifica que tus datos sean correctos antes de enviar la solicitud al refugio.</p>
                   </div>
                   <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-sm">
                      <h4 className="font-black text-slate-900 mb-6 uppercase text-[10px] tracking-[0.2em] border-b pb-4">Resumen de Datos</h4>
                      <div className="grid grid-cols-2 gap-y-5">
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Candidato</p><p className="text-sm font-bold text-slate-800">{formData.firstName} {formData.lastName}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Mascota</p><p className="text-sm font-bold text-blue-600">{derivedPetInterest}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Contacto</p><p className="text-sm font-bold text-slate-800">{formData.phone}</p></div>
                          <div><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Vivienda</p><p className="text-sm font-bold text-slate-800">{formData.housingType}</p></div>
                      </div>
                   </div>
                </motion.div>
              )}
            </div>

            <div className="p-8 border-t border-gray-100 bg-white flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.02)] z-20">
               <button onClick={()=>setCurrentStep(s=>s-1)} disabled={currentStep===1} className="text-xs font-black text-slate-400 uppercase tracking-widest px-4 disabled:opacity-0 transition">Atrás</button>
               <button onClick={handleNextStep} disabled={submitting} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-slate-800 transition active:scale-95 disabled:opacity-70 flex items-center gap-2">
                   {submitting ? (
                     <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Enviando...</>
                   ) : currentStep === 4 ? "Enviar Solicitud" : "Siguiente"}
               </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showExitConfirmation && (
              <div className="fixed inset-0 z-[8000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExitConfirmation(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl z-[8001] relative text-center">
                    <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6"><AlertTriangle size={32} /></div>
                    <h3 className="text-xl font-black text-slate-800 mb-2">¿Seguro que quieres salir?</h3>
                    <p className="text-slate-500 text-sm font-medium mb-6">Se perderán todos los datos ingresados en esta solicitud.</p>
                    <div className="flex flex-col gap-2">
                        <button onClick={resetAndClose} className="w-full py-3.5 rounded-xl bg-red-500 text-white font-black text-xs uppercase tracking-widest hover:bg-red-600 transition shadow-lg shadow-red-200">Salir sin guardar</button>
                        <button onClick={() => setShowExitConfirmation(false)} className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition">Regresar</button>
                    </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}