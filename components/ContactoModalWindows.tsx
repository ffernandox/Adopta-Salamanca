"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface ContactoModalWindowsProps {
  isOpen: boolean;
  onClose: () => void;
}

const COLORS = {
  bg_modal: "#C99E7E",       
  window_title_bg: "#F16913", 
  window_body_bg: "#F2D7B7",  
  border: "#000000",          
  text: "#000000",          
};

const VintageWindow = ({
  title,
  children,
  className = "",
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}) => (
  <div
    style={{ backgroundColor: COLORS.window_body_bg }}
    className={`border-2 border-black font-mono text-black ${className}`}
  >
    <div
      style={{ backgroundColor: COLORS.window_title_bg }}
      className={`border-b-2 border-black px-3 py-1 flex justify-between items-center text-xs`}
    >
      <span className="font-bold">{title}</span>
      <div className="flex gap-1.5 items-center select-none text-[10px]">
        <span>_</span>
        <span>□</span>
        <button
          onClick={onClose}
          className="font-bold px-1.5 bg-gray-200 border border-black active:bg-gray-400 active:scale-95"
        >
          X
        </button>
      </div>
    </div>
    <div className="p-4 flex flex-col items-center">{children}</div>
  </div>
);

const VintageInput = ({
  label,
  value,
  id,
}: {
  label: string;
  value: string;
  id: string;
}) => (
  <div className="w-full mb-4">
    <label htmlFor={id} className="text-xs mb-1 block">
      {label}
    </label>
    <input
      type="text"
      id={id}
      value={value}
      readOnly
      className="w-full bg-white border-2 border-black text-slate-800 px-3 py-1.5 text-xs font-mono focus:outline-none"
    />
  </div>
);

export default function ContactoModalWindows({
  isOpen,
  onClose,
}: ContactoModalWindowsProps) {
  
  const emailAdopta = "adoptasalamanca@email.com";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

        
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 22, stiffness: 200 }}
            style={{ backgroundColor: COLORS.bg_modal }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden border-2 border-black flex flex-col font-mono"
          >
            
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 text-black bg-gray-50 hover:bg-gray-100 p-2 border border-black rounded-lg transition z-50 shadow-md font-bold text-lg active:scale-95"
            >
                X
            </button>

            <div className="text-center mt-12 mb-8 px-8">
              <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-2 drop-shadow-sm">
                Ponte en Contacto
              </h1>
              <p className="text-black/80 font-bold text-sm leading-relaxed max-w-lg mx-auto">
                ¿Tienes alguna duda sobre el proceso de adopción o quieres sumar tu refugio a nuestra red? Escríbenos por tu medio favorito.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 md:p-12 mt-auto">
                
                <div className="space-y-6 flex flex-col">
                    <VintageWindow title="correo" onClose={onClose} className="w-full">
                        <VintageInput 
                            label="Contactanos por nuestro correo"
                            value="id_name"
                            id="correo_id"
                        />
                        <VintageInput 
                            label={emailAdopta}
                            value="password"
                            id="correo_pass"
                        />
                        <a 
                            href={`mailto:${emailAdopta}`}
                            className="w-full"
                        >
                            <button className="w-full mt-4 bg-white border-2 border-black text-black py-2.5 rounded-xl font-bold hover:bg-gray-100 transition shadow-lg text-lg uppercase active:scale-95">
                                Contactar
                            </button>
                        </a>
                    </VintageWindow>

                    <div className="flex-1 mt-auto border-2 border-black rounded-2xl bg-white/20 p-6 flex flex-col items-center text-black">
                        <div className="flex gap-4 items-center">
                            <span className="text-4xl">⏪</span>
                            <span className="text-4xl text-orange-600">▶️</span>
                            <span className="text-4xl">⏩</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6 flex flex-col md:col-span-2">
                    
                    <VintageWindow title="Copy" onClose={onClose} className="w-full flex-1">
                        <div className="flex gap-6 items-center w-full justify-center mb-6 mt-4">
                            <div className="relative w-16 h-20 text-4xl">📁</div>
                            <div className="text-3xl text-orange-600">📄📄</div>
                            <div className="relative w-16 h-20 text-4xl">📁</div>
                        </div>
                        <div className="w-full max-w-md h-8 border-2 border-black bg-white rounded-lg p-1 overflow-hidden">
                            <div className="w-[65%] h-full bg-purple-700 rounded"></div>
                        </div>
                    </VintageWindow>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <VintageWindow title="" onClose={onClose} className="w-full h-full p-2">
                            <form className="space-y-2 text-sm w-full">
                                {['Option 1', 'Option 2', 'Option 3'].map((opt, i) => (
                                    <label key={i} className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="vintage_opt" className="w-5 h-5 accent-orange-600" />
                                        <span>{opt}</span>
                                    </label>
                                ))}
                                <button type="button" className="mt-4 px-6 py-1 bg-white border-2 border-black text-black font-bold hover:bg-gray-100 transition shadow-lg text-sm uppercase">Ok</button>
                            </form>
                        </VintageWindow>

                        <div className="border-2 border-black rounded-full bg-white text-black p-4 flex items-center justify-between text-xl font-bold italic shadow-lg">
                           <span>🔍 Search...</span>
                           <span>⌨️</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 items-end mt-auto">
                        <div className="relative w-full h-24 border-2 border-black rounded-3xl bg-white p-6 flex items-center justify-center font-bold text-3xl italic shadow-2xl">
                           Hello!
                        </div>

                        <VintageWindow title="Error" onClose={onClose} className="w-full p-2 h-full flex flex-col">
                            <button className="px-6 py-1 bg-white border-2 border-black text-black font-bold hover:bg-gray-100 transition shadow-lg text-sm uppercase mt-auto">Cancel</button>
                        </VintageWindow>
                    </div>

                </div>

            </div>

            
            <div className="grid grid-cols-3 md:grid-cols-6 gap-6 px-12 pb-12 w-full max-w-5xl mx-auto mt-6">
              {[
                {icon: '💾', text: 'Floppy'}, {icon: '📁', text: 'Folder'}, {icon: '🌐', text: 'Web'}, 
                {icon: '🖼️', text: 'Gallery'}, {icon: '🎵', text: 'Music'}, {icon: '🎨', text: 'Paint'}
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-2 text-black cursor-pointer group">
                  <div className="w-16 h-16 rounded-2xl bg-white/40 border border-black group-hover:bg-white transition flex items-center justify-center text-4xl shadow-md group-hover:shadow-lg">
                    {item.icon}
                  </div>
                  <span className="text-xs font-bold text-center tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}