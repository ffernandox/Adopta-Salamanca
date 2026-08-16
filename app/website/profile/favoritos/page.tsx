"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, PawPrint, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface FavoritaMascota {
  id: string;
  mascota_id: string;
  nombre: string;
  especie: string;
  edad: number;
  genero: string;
  foto_url: string | null;
  centro: string;
  disponible: boolean;
}

export default function FavoritosPage() {
  const [favorites, setFavorites] = useState<FavoritaMascota[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      interface FavoritoRaw {
        id: string;
        mascota_id: string;
        mascotas: {
          nombre: string;
          especie: string;
          edad: number;
          genero: string;
          foto_url: string | null;
          centro: string;
          disponible: boolean;
        }[] | null;  
      }

      const { data } = await supabase
        .from("favoritos")
        .select(`
          id,
          mascota_id,
          mascotas (nombre, especie, edad, genero, foto_url, centro, disponible)
        `)
        .eq("usuario_id", session.user.id)
        .order("created_at", { ascending: false });

      if (data) {
        const mapped = (data as unknown as FavoritoRaw[])
          .filter((f) => f.mascotas && f.mascotas.length > 0)
          .map((f) => {
            const m = f.mascotas![0];
            return {
              id:         f.id,
              mascota_id: f.mascota_id,
              nombre:     m.nombre,
              especie:    m.especie,
              edad:       m.edad,
              genero:     m.genero,
              foto_url:   m.foto_url,
              centro:     m.centro,
              disponible: m.disponible,
            };
          });
        setFavorites(mapped);
      }
      setLoading(false);
    };
    loadFavorites();
  }, []);

  const removeFavorite = async (favoritoId: string) => {
    await supabase.from("favoritos").delete().eq("id", favoritoId);
    setFavorites(prev => prev.filter(f => f.id !== favoritoId));
  };

  const FALLBACK = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&q=80";

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Mascotas Favoritas</h2>
          <p className="text-sm text-slate-500 font-medium">
            Los peludos que han robado tu corazón. ¡No esperes mucho para enviar tu solicitud!
          </p>
        </div>
        {favorites.length > 0 && (
          <div className="bg-[#E83C7E]/10 border border-[#E83C7E]/20 px-5 py-3 rounded-2xl flex items-center gap-4 shrink-0">
            <div className="bg-white p-2 rounded-xl text-[#E83C7E] shadow-sm">
              <Heart size={20} className="fill-[#E83C7E]" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E83C7E]">Guardados</p>
              <p className="text-xl font-black text-slate-900 leading-none mt-0.5">{favorites.length}</p>
            </div>
          </div>
        )}
      </div>

      {/* Estado de carga */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="font-medium">Cargando favoritos...</span>
        </div>

      /* Estado si no hay favoritos */
      ) : favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <Heart size={36} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-700 mb-2">Aún no tienes favoritos</h3>
          <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed mb-6">
            Explora las mascotas disponibles y guarda las que más te gusten tocando el ícono del corazón.
          </p>
          <Link
            href="/website"
            className="bg-[#E83C7E] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#D43372] transition shadow-lg shadow-[#E83C7E]/20"
          >
            Ver mascotas disponibles
          </Link>
        </div>

      /* Lista de favoritos */
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
          <AnimatePresence>
            {favorites.map((pet) => (
              <motion.div
                key={pet.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                className="bg-white border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={pet.foto_url ?? FALLBACK}
                    alt={pet.nombre}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  {/* Badge disponible */}
                  <span className={`absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full
                    ${pet.disponible ? "bg-[#7DD64C] text-white" : "bg-slate-500 text-white"}`}>
                    {pet.disponible ? "Disponible" : "No disponible"}
                  </span>

                  {/* Botón quitar favorito */}
                  <button
                    onClick={() => removeFavorite(pet.id)}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-500 transition shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-black text-slate-900">{pet.nombre}</h3>
                  <p className="text-sm text-slate-500 font-medium capitalize mb-4">
                    {pet.especie} · {pet.edad} {pet.edad === 1 ? "año" : "años"} · {pet.genero}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
                      Centro {pet.centro}
                    </span>
                    {pet.disponible && (
                      <Link
                        href="/website"
                        className="flex items-center gap-1.5 text-xs font-black text-[#E83C7E] hover:text-[#D43372] transition"
                      >
                        <PawPrint size={14} /> Adoptar
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}