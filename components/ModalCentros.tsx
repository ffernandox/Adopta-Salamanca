"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export interface CentroData {
  titulo: string;
  desc: string;
  dir: string;
  img: string;        // Imagen principal
  galeria: string[];  // Array de imágenes extra para el modal
  stats: {            // Estadísticas específicas de cada centro
    adopciones: string;
    capacidad: string;
    voluntarios: string;
  };
}

interface ModalCentrosProps {
  isOpen: boolean;
  onClose: () => void;
  centro: CentroData | null; 
}

export default function ModalCentros({ isOpen, onClose, centro }: ModalCentrosProps) {
  
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
            className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden p-8 flex flex-col items-center"
          >
            
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {/* Título DINÁMICO */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
                {centro.titulo}
            </h2>
            <p className="text-gray-400 mb-8 text-sm">{centro.dir}</p>

            {/* Galería de imágenes DINÁMICAS */}
            <div className="flex justify-center gap-2 md:gap-4 w-full overflow-x-auto pb-4">
                {centro.galeria.map((imgUrl, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20, rotate: -5 }}
                        animate={{ opacity: 1, x: 0, rotate: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.4 }} 
                        className="relative flex-shrink-0 w-24 h-32 md:w-32 md:h-44 rounded-xl overflow-hidden border-2 border-transparent hover:border-white/50 hover:scale-105 hover:z-10 transition-all duration-300 cursor-pointer"
                    >
                        <Image 
                            src={imgUrl}
                            alt={`Galería ${idx}`}
                            fill
                            className="object-cover"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Datos DINÁMICOS */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-neutral-400 text-sm mt-8 mb-8 w-full max-w-md">
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>{centro.stats.adopciones}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                    <span>{centro.stats.capacidad}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                    <span>{centro.stats.voluntarios}</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Abierto 9am - 6pm</span>
                </div>
            </div>

            <div className="flex gap-4 w-full mt-auto">
                <button 
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl bg-transparent border border-neutral-700 text-white font-medium hover:bg-neutral-800 transition"
                >
                    Cerrar
                </button>
                <button 
                    className="flex-1 py-3 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition shadow-lg"
                >
                    Contactar Centro
                </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}