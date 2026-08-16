"use client";

import { motion, AnimatePresence } from "framer-motion";
interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapModal({ isOpen, onClose }: MapModalProps) {
    // URL del mapa de Google Maps
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14958.799726207947!2d-101.20424455!3d20.57547505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x842c9a660275000b%3A0x5471630556666000!2sSalamanca%2C%20Gto.!5e0!3m2!1ses-419!2smx!4v1706700000000!5m2!1ses-419!2smx";

  return (
    <AnimatePresence>
      {isOpen && (
        // 1. Overlay 
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Al hacer clic en el fondo, se cierra el modal
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          {/* 2. Mapa */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-black hover:bg-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 3. Iframe de Google Maps */}
            <div className="w-full h-[500px] md:h-[600px]">
              <iframe
                src={mapSrc}
                width="1000"
                height="600"
                style={{ border: 0, width: "100%", height: "100%" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}