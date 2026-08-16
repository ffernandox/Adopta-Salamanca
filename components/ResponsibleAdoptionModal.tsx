"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartHandshake, CheckCircle2, ShieldAlert, Home } from "lucide-react";
import { createPortal } from "react-dom";

interface ResponsibleAdoptionModalProps {
  isReady?: boolean; 
  onTermsAccepted?: () => void; 
}

export default function ResponsibleAdoptionModal({ 
  isReady = true, 
  onTermsAccepted 
}: ResponsibleAdoptionModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      
      if (isReady) {
        const hasAccepted = sessionStorage.getItem("acceptedAdoptionTerms");
        if (!hasAccepted) {
          setIsOpen(true);
          document.body.style.overflow = "hidden";
        } else {
          if (onTermsAccepted) onTermsAccepted();
        }
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [isReady]);

  const handleAccept = () => {
    sessionStorage.setItem("acceptedAdoptionTerms", "true");
    setIsOpen(false);
    document.body.style.overflow = "unset";
    if (onTermsAccepted) onTermsAccepted();
  };

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(16px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 bg-slate-900/60"
            onClick={(e) => e.stopPropagation()} 
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300, delay: 0.3 }}
            className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="bg-slate-900 p-8 text-center relative overflow-hidden">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl"></div>
                
                <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
                    <HeartHandshake size={40} className="text-white" />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Adopción Responsable</h2>
                <p className="text-slate-300 font-medium text-sm max-w-md mx-auto leading-relaxed">
                    Adoptar es un compromiso de por vida. Para proteger a nuestras mascotas, por favor lee atentamente nuestras políticas antes de continuar.
                </p>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar bg-slate-50/50">
                <div className="space-y-8">
                    <div className="flex gap-5">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1 shadow-sm border border-blue-200">
                            <ShieldAlert size={18} className="text-blue-600" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900 mb-1">Derecho de Admisión</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                El refugio se reserva el derecho absoluto de aprobar o rechazar cualquier solicitud basándose en el bienestar exclusivo de la mascota. Completar los formularios no garantiza en ninguna circunstancia la adopción final.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 mt-1 shadow-sm border border-emerald-200">
                            <CheckCircle2 size={18} className="text-emerald-600" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900 mb-1">Compromiso de Bienestar</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Como adoptante, te comprometes legal y moralmente a proveer atención veterinaria continua, alimentación premium y un ambiente seguro. Queda estrictamente prohibido mantener a la mascota amarrada, confinada en azoteas o utilizada para fines de guardia o crianza.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-5">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center shrink-0 mt-1 shadow-sm border border-rose-200">
                            <Home size={18} className="text-rose-600" />
                        </div>
                        <div>
                            <h4 className="text-base font-bold text-slate-900 mb-1">Visitas de Seguimiento</h4>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                Aceptas que el personal autorizado del refugio pueda realizar visitas domiciliarias aleatorias o solicitar evidencias fotográficas y en video de forma periódica para asegurar la correcta adaptación y estado de la mascota.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-white border-t border-slate-100 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
                <button 
                    onClick={handleAccept}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95 flex items-center justify-center gap-2"
                >
                    Entiendo y Acepto las Condiciones
                </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}