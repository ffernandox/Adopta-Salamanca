"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Definimos la estructura de los datos de una mascota
interface Mascota {
  id: number;
  nombre: string;
  raza: string;
  edad: string;
  vacunas: string;
  esterilizado: boolean;
  img: string;
  centro: "Norte" | "Sur" | "Este"; // Para filtrar
}

export default function Mascotas() {
  // Estado para el filtro activo (Por defecto 'Norte')
  const [activeFilter, setActiveFilter] = useState<"Norte" | "Sur" | "Este">("Norte");

  // Base de datos de mascotas
  const todasLasMascotas: Mascota[] = [
    // --- CENTRO NORTE ---
    {
      id: 1,
      nombre: "Max",
      raza: "Golden Retriever • Perro",
      edad: "2 años",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop",
      centro: "Norte"
    },
    {
      id: 2,
      nombre: "Bella",
      raza: "Beagle • Perro",
      edad: "3 años",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?q=80&w=800&auto=format&fit=crop",
      centro: "Norte"
    },
    {
      id: 3,
      nombre: "Toby",
      raza: "Labrador • Perro",
      edad: "1 año",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=800&auto=format&fit=crop",
      centro: "Norte"
    },
    // --- CENTRO SUR ---
    {
      id: 4,
      nombre: "Luna",
      raza: "Siamés • Gato",
      edad: "2 años",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1513245543132-31f507417b26?q=80&w=800&auto=format&fit=crop",
      centro: "Sur"
    },
    {
      id: 5,
      nombre: "Simba",
      raza: "Persa • Gato",
      edad: "4 años",
      vacunas: "Pendiente 1",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=800&auto=format&fit=crop",
      centro: "Sur"
    },
    {
      id: 6,
      nombre: "Nala",
      raza: "Mestizo • Gato",
      edad: "6 meses",
      vacunas: "Iniciadas",
      esterilizado: false,
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
      centro: "Sur"
    },
    // --- CENTRO ESTE ---
    {
      id: 7,
      nombre: "Rocky",
      raza: "Bulldog • Perro",
      edad: "5 años",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop",
      centro: "Este"
    },
    {
      id: 8,
      nombre: "Coco",
      raza: "Poodle • Perro",
      edad: "2 años",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=800&auto=format&fit=crop",
      centro: "Este"
    },
    {
      id: 9,
      nombre: "Molly",
      raza: "Mix • Perro",
      edad: "3 años",
      vacunas: "Completas",
      esterilizado: true,
      img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop",
      centro: "Este"
    },
  ];

  // Filtramos las mascotas según el botón seleccionado
  const mascotasFiltradas = todasLasMascotas.filter(m => m.centro === activeFilter);

  return (
    <section id="mascotas" className="w-full py-24 px-4 bg-white flex flex-col items-center">
      
      {/* 1. Header de la Sección */}
      <span className="bg-gray-100 text-gray-800 px-4 py-1 rounded-full text-sm font-semibold mb-6">
        Mascotas Disponibles
      </span>

      <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-black tracking-tight">
        Encuentra a Tu Nuevo Mejor Amigo
      </h2>

      <p className="text-gray-500 text-center max-w-2xl text-lg mb-12 leading-relaxed">
        Todas nuestras mascotas han sido cuidadas con amor y están listas para encontrar un hogar permanente.
      </p>

      {/* 2. Filtro (Tabs) Estilo Pastilla */}
      <div className="bg-gray-100 p-1.5 rounded-full flex items-center mb-16 shadow-inner overflow-x-auto max-w-full">
        {(["Norte", "Sur", "Este"] as const).map((centro) => (
            <button
                key={centro}
                onClick={() => setActiveFilter(centro)}
                className={`
                    px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
                    ${activeFilter === centro 
                        ? "bg-black text-white shadow-lg transform scale-105" 
                        : "text-gray-500 hover:text-black hover:bg-gray-200"}
                `}
            >
                Centro de Adopción {centro}
            </button>
        ))}
      </div>

      {/* 3. Grid de Tarjetas (Carousel Visual) */}
      <div className="flex items-center gap-4 w-full max-w-7xl justify-center">
        
        {/* Flecha Izquierda (Decorativa) */}
        <button className="hidden md:flex w-12 h-12 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-black transition flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        {/* Contenedor de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <AnimatePresence mode="wait">
                {mascotasFiltradas.map((mascota) => (
                    <motion.div
                        key={mascota.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-[2.5rem] border border-gray-100 p-4 shadow-sm hover:shadow-xl transition-shadow duration-300 flex flex-col"
                    >
                        {/* Imagen + Botón Corazón */}
                        <div className="relative w-full h-64 rounded-[2rem] overflow-hidden mb-6">
                            <Image 
                                src={mascota.img} 
                                alt={mascota.nombre}
                                fill
                                className="object-cover"
                            />
                            <button className="absolute top-4 right-4 bg-white p-2.5 rounded-full shadow-md hover:scale-110 transition active:scale-95 text-gray-400 hover:text-red-500">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                            </button>
                        </div>

                        {/* Contenido */}
                        <div className="px-2 pb-2 flex-1 flex flex-col">
                            <h3 className="text-2xl font-bold text-gray-900">{mascota.nombre}</h3>
                            <p className="text-gray-500 text-sm mb-6">{mascota.raza}</p>

                            {/* Detalles Técnicos */}
                            <div className="space-y-3 mb-8">
                                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">Edad</span>
                                    <span className="font-semibold text-gray-900">{mascota.edad}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-b border-gray-50 pb-2">
                                    <span className="text-gray-500">Vacunas</span>
                                    <div className="flex items-center gap-1 text-emerald-600 font-medium">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        {mascota.vacunas}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Esterilizado</span>
                                    <div className={`flex items-center gap-1 font-medium ${mascota.esterilizado ? "text-emerald-600" : "text-amber-500"}`}>
                                        {mascota.esterilizado ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Sí
                                            </>
                                        ) : (
                                            <span>No</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Botón Adoptar */}
                            <button className="mt-auto w-full bg-black text-white py-3.5 rounded-2xl font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Adoptar
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {/* Flecha Derecha (Decorativa) */}
        <button className="hidden md:flex w-12 h-12 rounded-full border border-gray-200 items-center justify-center text-gray-400 hover:bg-gray-50 hover:text-black transition flex-shrink-0">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>

      </div>
    </section>
  );
}