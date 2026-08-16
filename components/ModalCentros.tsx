"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";

export interface CentroData {
  titulo: string;
  desc: string;
  dir: string;
  img: string;        
  galeria: string[];  
  stats: {            
    adopciones: string;
    capacidad: string;
    voluntarios: string;
  };
  // NUEVO: Agregamos estas dos propiedades obligatorias al contrato
  telefono: string;
  email: string;
}

interface ModalCentrosProps {
  isOpen: boolean;
  onClose: () => void;
  centro: CentroData | null; 
}

export default function ModalCentros({ isOpen, onClose, centro }: ModalCentrosProps) {
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setViewIndex(0), 300);
    }
  }, [isOpen]);

  if (!centro) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-gray-400 hover:text-black bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition z-50"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <motion.div
              className="flex w-[200%]"
              animate={{ x: viewIndex === 0 ? "0%" : "-50%" }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
            >
                
                {/* ==============================================
                    VISTA 1: MAPA Y DATOS
                    ============================================== */}
                <div className="w-1/2 p-8 flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-semibold text-black mb-2 text-center mt-2">
                        {centro.titulo}
                    </h2>
                    <p className="text-slate-500 mb-8 text-sm">{centro.dir}</p>

                    <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden mb-8 border border-gray-200 shadow-sm relative group">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight={0}
                            marginWidth={0}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(centro.dir + ", Salamanca, Guanajuato")}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            className="absolute inset-0 grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                        ></iframe>
                    </div>

                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-black font-semibold mt-auto mb-8 w-full max-w-md">
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#0072B9]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{centro.stats.adopciones}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#0072B9]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                            <span>{centro.stats.capacidad}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#7DD64C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                            <span>{centro.stats.voluntarios}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-[#7DD64C]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>Abierto 9am - 6pm</span>
                        </div>
                    </div>

                    <div className="flex gap-4 w-full mt-auto">
                        <button 
                            onClick={onClose}
                            className="flex-1 py-3 rounded-xl bg-[#7DD64C] border border-[#7DD64C] text-white font-bold hover:bg-[#7DD64C]/80 transition"
                        >
                            Cerrar
                        </button>
                        <button 
                            onClick={() => setViewIndex(1)}
                            className="flex-1 py-3 rounded-xl bg-[#7DD64C] text-white font-bold hover:bg-[#0072B9] transition shadow-lg"
                        >
                            Contactar Centro
                        </button>
                    </div>
                </div>

                {/* ==============================================
                    VISTA 2: CONTACTO 
                    ============================================== */}
                <div className="w-1/2 p-8 flex flex-col h-full justify-center text-left">
                    
                    <button
                        onClick={() => setViewIndex(0)}
                        className="flex items-center gap-2 text-gray-400 hover:text-[#0072B9] font-bold text-sm mb-8 transition-colors w-fit group"
                    >
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Volver al mapa
                    </button>

                    <h3 className="text-3xl font-black text-black tracking-tight mb-3">
                        Conversemos
                    </h3>
                    <p className="text-gray-500 font-medium text-sm mb-10 leading-relaxed max-w-sm">
                        El equipo de <strong>{centro.titulo}</strong> está listo para ayudarte. Contáctanos por el medio que prefieras.
                    </p>

                    <div className="space-y-4 mb-8">
                        {/* CAMBIO: Enlace y Texto Dinámico del Email */}
                        <a href={`mailto:${centro.email}`} className="flex items-start gap-5 p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-[#0072B9]/30 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#0072B9]/10 flex items-center justify-center text-[#0072B9] shrink-0 group-hover:bg-[#0072B9] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-black mb-1">Correo electrónico</h4>
                                <p className="text-gray-500 text-sm font-medium mb-1">Escríbenos para cualquier duda.</p>
                                <span className="text-[#0072B9] font-bold text-sm">{centro.email}</span>
                            </div>
                        </a>

                        {/* CAMBIO: Enlace y Texto Dinámico del Teléfono */}
                        {/* Quitamos los espacios del teléfono para el atributo 'href' (para que el celular marque bien) */}
                        <a href={`tel:${centro.telefono.replace(/\s+/g, '')}`} className="flex items-start gap-5 p-5 rounded-2xl bg-white border-2 border-gray-100 hover:border-[#7DD64C]/50 hover:shadow-md transition-all group">
                            <div className="w-12 h-12 rounded-full bg-[#7DD64C]/20 flex items-center justify-center text-[#7DD64C] shrink-0 group-hover:bg-[#7DD64C] group-hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                            </div>
                            <div>
                                <h4 className="font-bold text-black mb-1">Teléfono local</h4>
                                <p className="text-gray-500 text-sm font-medium mb-1">Llámanos en horario de atención.</p>
                                <span className="text-[#7DD64C] font-bold text-sm">{centro.telefono}</span>
                            </div>
                        </a>
                    </div>
                </div>

            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}