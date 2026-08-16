"use client";

import React from "react";
import Image from "next/image";
import { Heart, Check, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export interface PetData {
  id: number;
  name: string;
  type: 'Perro' | 'Gato';
  breed: string;
  center: string;
  age: string;
  gender: "Macho" | "Hembra";
  avatarUrl: string;
  mainImageUrl: string;
  readinessLabel: string;
  readinessPercentage: number;
  isNew?: boolean;
}

export default function PetCard({ data }: { data: PetData }) {
  // CORRECCION: Generamos un numero "aleatorio" pero constante basado en el ID de la mascota.
  // Asi evitamos el error de "impure function" y React renderiza siempre el mismo valor.
  const favoritesCount = (data.id * 83) % 500 + 50;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
      transition={{ duration: 0.3 }}
      // Contenedor Dark Liquid Glass
      className="w-full max-w-[340px] bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2rem] p-4 shadow-2xl group flex flex-col relative"
    >
      {/* =========================================
          1. IMAGEN DE LA MASCOTA (Estilo Retrato)
          ========================================= */}
      <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-5 border border-slate-700/30 shadow-inner">
        {/* Imagen con ligero zoom al pasar el mouse */}
        <Image 
          src={data.mainImageUrl} 
          alt={data.name} 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        
        {/* Etiqueta NUEVO */}
        {data.isNew && (
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-white/10 text-yellow-300 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg">
            <Sparkles size={12} className="text-yellow-400" />
            NUEVO
          </div>
        )}
        
        {/* Gradiente sutil en la parte inferior para fundirse con la tarjeta */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-slate-900/80 to-transparent pointer-events-none"></div>
      </div>

      {/* =========================================
          2. INFORMACION PRINCIPAL
          ========================================= */}
      <div className="px-2 flex flex-col flex-1">
        
        {/* Raza (Arriba, pequeno) */}
        <span className="text-indigo-400 font-bold text-xs uppercase tracking-wider mb-1">
          {data.breed}
        </span>

        {/* Nombre + Icono Verificado */}
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-2xl font-black text-white tracking-tight">
            {data.name}
          </h2>
          {/* Icono de Verificado estilo Sophie Bennett */}
          <div className="w-5 h-5 bg-[#00A650] rounded-full flex items-center justify-center shadow-sm shrink-0">
            <Check size={12} strokeWidth={4} className="text-white" />
          </div>
        </div>

        {/* Descripcion en 2 renglones */}
        <div className="space-y-1.5 mb-6">
          <p className="text-slate-300 font-medium text-sm flex items-center gap-2">
            <MapPin size={14} className="text-slate-500 shrink-0" />
            <span className="truncate">{data.center}</span>
          </p>
          <p className="text-slate-400 font-medium text-sm pl-5">
            {data.age} • {data.gender}
          </p>
        </div>

        {/* =========================================
            3. FOOTER (Corazon + Boton Ver Perfil)
            ========================================= */}
        <div className="mt-auto pt-4 border-t border-slate-700/50 flex items-center justify-between">
          
          {/* Corazon con Tooltip de Favoritos */}
          <div className="relative group/heart flex items-center gap-2 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer">
            <Heart size={20} className="group-hover/heart:fill-rose-400/20 transition-all" />
            <span className="font-bold text-sm text-slate-300 group-hover/heart:text-rose-300 transition-colors">
              {favoritesCount}
            </span>

            {/* Tooltip Flotante */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-slate-800 border border-slate-700 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg opacity-0 group-hover/heart:opacity-100 transition-all pointer-events-none shadow-xl whitespace-nowrap translate-y-2 group-hover/heart:translate-y-0 z-50">
              {favoritesCount} personas guardaron a {data.name}
              {/* Triangulito del tooltip */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
            </div>
          </div>

          {/* Boton "Ver Perfil" */}
          <button className="bg-slate-100 hover:bg-white text-slate-900 px-6 py-2 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-95">
            Ver Perfil
          </button>

        </div>
      </div>
    </motion.div>
  );
}