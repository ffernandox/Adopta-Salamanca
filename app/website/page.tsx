"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sponsors from "@/components/Sponsors";
import Centros from "@/components/Centros";
import Mascotas from "@/components/Mascotas";
import HistoriasExito from "@/components/HistoriasExito";
import Footer from "@/components/Footer";
import ResponsibleAdoptionModal from "@/components/ResponsibleAdoptionModal";

const splashText = "ADOPTA SALAMANCA".split("");

const containerVariants: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.2,
    },
  },
  exit: {
    y: "-100vh",
    transition: { duration: 1, ease: [0.76, 0, 0.24, 1] as const }
  }
};

const letterVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const }
  },
};

export default function Home() {
  const [isSplashComplete, setIsSplashComplete] = useState(false);
  
  //Controla si el usuario ya aceptó los términos
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSplashComplete(true);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // El Hero solo se anima si el Splash terminó y los términos se aceptaron
  const isHeroReady = isSplashComplete && termsAccepted;

  return (
    <>
      <AnimatePresence>
        {!isSplashComplete && (
          <motion.div
            key="splash-screen"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[10000] bg-[#0A0A0A] flex items-center justify-center pointer-events-none"
          >
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-40"
            >
              <source src="/fondo_spash.mp4" type="video/mp4" />
            </video>
            
            <h1 className="flex text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter">
              {splashText.map((letter, index) => (
                <div key={index} className="overflow-hidden inline-flex">
                  <motion.span
                    variants={letterVariants}
                    className={letter === " " ? "w-4 md:w-8" : "inline-block"}
                  >
                    {letter}
                  </motion.span>
                </div>
              ))}
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Le damos al Modal la capacidad de avisarnos cuando el usuario acepte */}
      <ResponsibleAdoptionModal 
        isReady={isSplashComplete} 
        onTermsAccepted={() => setTermsAccepted(true)} 
      />

      <main className="relative isolate min-h-screen bg-white overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 -z-10 transform-gpu overflow-hidden blur-[120px]" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden blur-[120px]" aria-hidden="true">
           <div className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 150 }}
          animate={{ 
            opacity: isSplashComplete ? 1 : 0,
            y: isSplashComplete ? 0 : 150
          }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="relative z-10 flex flex-col items-center w-full"
        >
          <Navbar />
          
          <Hero isReady={isHeroReady} />
          
          <div className="w-full -mt-20 mb-20">
              <Sponsors />
          </div>

          <Centros />
          <Mascotas />
          <HistoriasExito />
          <Footer />

        </motion.div>
      </main>
    </>
  );
}