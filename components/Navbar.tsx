"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LoginModal from "./LoginModal"; // Asegúrate de que esta ruta sea correcta

export default function Navbar() {
  // --- ESTADOS ---
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Controla el menú móvil
  const [isLoginOpen, setIsLoginOpen] = useState(false); // Controla el modal de Login
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null); // Controla el efecto hover en desktop

  const navItems = [
    { name: "Inicio", link: "#inicio" },
    { name: "Centros", link: "#centros" },
    { name: "Mascotas", link: "#mascotas" },
    { name: "Historias", link: "#historias" },
  ];

  return (
    <>
      {/* Navbar Flotante */}
      <div className="fixed top-5 inset-x-0 max-w-4xl mx-auto z-[5000] px-4">
        <div className="relative flex items-center justify-between w-full">
          
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={cn(
              "flex flex-row items-center justify-between space-x-2",
              "rounded-full border border-gray-200 shadow-lg",
              "bg-white/70 backdrop-blur-md",
              "dark:bg-black/70 dark:border-white/20",
              "px-2 py-2 w-full"
            )}
          >
            {/* Logo */}
            <Link href="/" className="font-bold text-black dark:text-white flex items-center gap-2 px-2">
               <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs">
                  🐾
               </div>
               <span className="hidden sm:block">AdoptaSalamanca</span>
            </Link>

            {/* --- ENLACES DE ESCRITORIO --- */}
            <div 
              className="hidden md:flex flex-row items-center"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {navItems.map((navItem, idx) => (
                <Link
                  key={`link=${idx}`}
                  href={navItem.link}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 transition-colors"
                >
                  <span className="relative z-10">{navItem.name}</span>
                  <AnimatePresence>
                    {hoveredIndex === idx && (
                      <motion.span
                        layoutId="hoverBackground"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { duration: 0.15 } }}
                        exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
                        className="absolute inset-0 bg-gray-200/80 dark:bg-white/10 rounded-full -z-0"
                      />
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </div>

            {/* Botón de Acción (Escritorio) */}
            <div className="hidden md:flex items-center space-x-2 px-2">
              <button 
                onClick={() => setIsLoginOpen(true)} // Corregido: usa isLoginOpen
                className="bg-black text-white dark:bg-white dark:text-black px-6 py-2 rounded-full text-xs font-bold hover:opacity-80 transition"
              >
                Iniciar Sesión
              </button>
            </div>

            {/* Botón Hamburguesa (Móvil) */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)} // Corregido: usa isMenuOpen
              className="md:hidden text-gray-600 dark:text-gray-300 focus:outline-none px-2"
            >
              {isMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
              ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 </svg>
              )}
            </button>
          </motion.div>

          {/* --- MENÚ MÓVIL DESPLEGABLE --- */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className={cn(
                  "absolute top-full left-0 right-0 mt-2 p-4 rounded-3xl",
                  "bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl",
                  "dark:bg-neutral-900/90 dark:border-white/10",
                  "flex flex-col gap-4 overflow-hidden z-[40]"
                )}
              >
                {navItems.map((navItem, idx) => (
                  <Link
                    key={`mobile-link-${idx}`}
                    href={navItem.link}
                    onClick={() => setIsMenuOpen(false)} // Cierra al hacer clic
                    className="text-lg font-medium text-gray-700 dark:text-gray-200 hover:text-purple-600 transition-colors px-2"
                  >
                    {navItem.name}
                  </Link>
                ))}
                
                <div className="h-px bg-gray-200 dark:bg-gray-700 w-full" />
                
                <button 
                  onClick={() => {
                    setIsMenuOpen(false); // Cierra menú móvil
                    setIsLoginOpen(true); // Abre modal de Login
                  }}
                  className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition"
                >
                  Iniciar Sesión
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* --- MODAL LOGIN (Renderizado fuera del navbar fijo) --- */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </>
  );
}