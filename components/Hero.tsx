"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { TextAnimate } from "@/components/ui/text-animate";

// 1. Definimos la propiedad que el Hero va a recibir desde tu página principal
interface HeroProps {
  isReady?: boolean; 
}

// 2. Por defecto le ponemos 'true' para que no se rompa si no le pasas el prop, 
// pero la idea es que tú lo controles desde afuera.
export default function Hero({ isReady = true }: HeroProps) {
  const dogImageUrl = "/hero-dog2.png"; // Asegúrate de tener esta imagen en tu carpeta public

  return (
    <section className="relative w-full min-h-screen bg-[#F4EFE6] overflow-hidden flex flex-col pt-24 lg:pt-31">
      
      {/* =========================================
          CAPA 0: TEXTO GIGANTE (Condicionado al estado isReady)
          ========================================= */}
      <div className="relative z-0 w-full text-center px-4 flex flex-col items-center flex-shrink-0">
        
        {/* LÍNEA 1 */}
        <h1 className="text-[10vw] md:text-[9vw] leading-[0.85] font-black tracking-tighter uppercase flex flex-row items-center justify-center min-h-[1em]">
          {isReady ? (
            <>
              <TextAnimate animation="blurInUp" by="character" duration={1.5} className="text-[#2D2A26]">
                {"Tu Nuevo "}
              </TextAnimate>
              <TextAnimate animation="blurInUp" by="character" duration={1.5} className="text-[#4CD137]">
                {"Mejor"}
              </TextAnimate>
            </>
          ) : (
            <span className="opacity-0">{"Tu Nuevo Mejor"}</span>
          )}
        </h1>

        {/* LÍNEA 2 */}
        <h1 className="text-[10vw] md:text-[9vw] leading-[0.85] font-black tracking-tighter uppercase flex flex-row items-center justify-center min-h-[1em]">
          {isReady ? (
            <>
              <TextAnimate animation="blurInUp" by="character" duration={1.5} className="text-[#4CD137]">
                {"Amigo "}
              </TextAnimate>
              <TextAnimate animation="blurInUp" by="character" duration={1.5} className="text-[#2D2A26]">
                {"Está "}
              </TextAnimate>
              <TextAnimate animation="blurInUp" by="character" duration={1.5} className="text-[#0072B9]">
                {"Aquí"}
              </TextAnimate>
            </>
          ) : (
            <span className="opacity-0">{"Amigo Está Aquí"}</span>
          )}
        </h1>
      </div>

      {/* =========================================
          CAPA 10: EL PERRITO (Solo aparece si isReady es true)
          ========================================= */}
      {isReady && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.5 }} // El perro sale 0.5s después de las letras
          className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 w-full max-w-[280px] sm:max-w-sm md:max-w-lg lg:max-w-md flex justify-center pointer-events-none"
        >
          <Image
            src={dogImageUrl}
            alt="Perrito Adopción"
            width={800}
            height={800}
            className="w-full h-auto object-contain object-bottom drop-shadow-2xl"
            priority
          />
        </motion.div>
      )}

      {/* =========================================
          CAPA 20 & 30: FLOTANTES (Se desvanecen suavemente al estar listos)
          ========================================= */}
      <div className={`absolute left-8 xl:left-24 bottom-24 z-20 hidden lg:flex flex-col items-start transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
       <svg width="160" height="200" viewBox="0 0 160 200" className="absolute -top-[200px] left-[50px] text-[#FFD335] opacity-90 pointer-events-none">
            <path d="M150,10 C150,100 20,80 20,180" stroke="currentColor" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M35,165 L20,180 L10,155" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>

        <p className="font-bold text-slate-800 text-lg mb-1">Familias felices</p>
        <div className="flex items-center gap-1 text-sm text-slate-600 font-medium mb-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          4.9 (800+ Adopciones)
        </div>
        
        <div className="flex -space-x-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#F4EFE6] overflow-hidden bg-slate-200 shadow-sm">
              <Image 
                src={`https://i.pravatar.cc/100?img=${i + 10}`} 
                alt="Avatar" 
                width={40} 
                height={40} 
              />
            </div>
          ))}
        </div>
      </div>

      <div className={`absolute right-8 xl:right-24 bottom-24 z-20 hidden lg:flex flex-col items-start max-w-[300px] transition-opacity duration-1000 delay-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-slate-700 mb-8 font-medium leading-relaxed text-sm">
          Reunimos en un solo lugar todo lo que tu nuevo integrante necesita para vivir feliz, saludable y lleno de energía.
        </p>
        
      </div>

      <div className={`flex flex-col lg:hidden z-20 px-6 pb-12 w-full gap-6 mt-auto relative bg-gradient-to-t from-[#F4EFE6] via-[#F4EFE6]/90 to-transparent pt-32 transition-opacity duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-slate-700 text-center font-medium leading-relaxed">
          Reunimos en un solo lugar todo lo que tu nuevo integrante necesita para vivir feliz, saludable y lleno de energía.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button  className="bg-[#A881E6] text-white px-6 py-4 rounded-full font-bold shadow-lg w-full">
            Adopta ahora
          </button>
          <button className="border-2 border-slate-900 text-slate-900 px-6 py-4 rounded-full font-bold w-full">
            Explorar
          </button>
        </div>
        
        <div className="flex flex-col items-center justify-center pt-6 border-t border-slate-300/60">
          <p className="font-bold text-slate-800 mb-1">Familias felices</p>
          <div className="flex items-center gap-1 text-sm text-slate-600 font-medium mb-3">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            4.9 (800+ Adopciones)
          </div>
        </div>
      </div>

    </section>
  );
}