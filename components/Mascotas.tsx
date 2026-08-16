"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Check, ArrowUpRight, Loader2 } from "lucide-react";
import CreateApplicationDrawer from "@/components/CreateApplicationDrawer";
import PetDetailsOverlay from "@/components/PetDetailsOverlay";
import LoginModal from "@/components/LoginModal";
import { supabase } from "@/lib/supabase";

// ── Tipos ──────────────────────────────────────────────────
interface Mascota {
  id: string;
  nombre: string;
  especie: string;       // "Perro" | "Gato"
  edad: number;          // INTEGER
  esterilizado: boolean;
  foto_url: string | null;
  centro: "Norte" | "Sur" | "Este";
  descripcion?: string;
  urgente?: boolean;
  disponible?: boolean;
}

const FALLBACKS: Record<string, string> = {
  perro: "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=800&auto=format&fit=crop",
  gato:  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
};

export default function Mascotas() {
  const [activeFilter, setActiveFilter] = useState<"Norte" | "Sur" | "Este">("Norte");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loadingMascotas, setLoadingMascotas] = useState(true);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showAdoptionDrawer, setShowAdoptionDrawer] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Mascota | null>(null);
  const [detailsPet, setDetailsPet] = useState<Mascota | null>(null);

  // ── Verificar sesión ──────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  // ── Cargar mascotas desde Supabase (tiempo real) ──────────
  useEffect(() => {
    const fetch = async () => {
      setLoadingMascotas(true);
      const { data } = await supabase
        .from("mascotas")
        .select("*")
        .eq("disponible", true)
        .order("creado_en", { ascending: false });
      if (data) setMascotas(data as Mascota[]);
      setLoadingMascotas(false);
    };
    fetch();

    const channel = supabase
      .channel("mascotas_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "mascotas" }, fetch)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ show: boolean; name: string }>({ show: false, name: "" });

  // ── Cargar favoritos del usuario ──────────────────────────
  useEffect(() => {
    const loadFavorites = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data } = await supabase
        .from("favoritos")
        .select("mascota_id")
        .eq("usuario_id", session.user.id);
      if (data) setFavorites(new Set(data.map((f: { mascota_id: string }) => f.mascota_id)));
    };
    loadFavorites();
  }, [isLoggedIn]);

  const handleFavoriteClick = async (mascota: Mascota) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { setShowLoginModal(true); return; }

    const isFav = favorites.has(mascota.id);
    if (isFav) {
      await supabase.from("favoritos").delete()
        .eq("usuario_id", session.user.id).eq("mascota_id", mascota.id);
      setFavorites(prev => { const s = new Set(prev); s.delete(mascota.id); return s; });
    } else {
      await supabase.from("favoritos").insert({ usuario_id: session.user.id, mascota_id: mascota.id });
      setFavorites(prev => new Set(prev).add(mascota.id));
      setToast({ show: true, name: mascota.nombre });
      setTimeout(() => setToast({ show: false, name: "" }), 3000);
    }
  };
  const handleAdoptClick = (mascota: Mascota) => {
    setSelectedPet(mascota);
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setShowAdoptionDrawer(true);
    }
  };

  const handleLoginClose = () => {
    setShowLoginModal(false);
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && selectedPet) setTimeout(() => setShowAdoptionDrawer(true), 300);
    });
  };

  const mascotasFiltradas = mascotas.filter((m) => m.centro === activeFilter);

  return (
    <section id="mascotas" className="w-full py-24 px-4 bg-slate-50 flex flex-col items-center relative">

      <span className="bg-white text-slate-600 px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6 border border-slate-200 shadow-sm">
        Compañeros
      </span>

      <h2 className="text-4xl md:text-5xl font-black text-center mb-6 text-slate-900 tracking-tight">
        Encuentra a Tu Nuevo Mejor Amigo
      </h2>

      <p className="text-slate-500 text-center max-w-2xl text-lg mb-12 leading-relaxed font-medium">
        Todas nuestras mascotas han sido cuidadas con amor y están listas para encontrar un hogar permanente.
      </p>

      {/* Filtros */}
      <div className="bg-white p-1.5 rounded-full flex items-center mb-16 shadow-sm border border-slate-200 overflow-x-auto max-w-full">
        {(["Norte", "Sur", "Este"] as const).map((centro) => (
          <button
            key={centro}
            onClick={() => setActiveFilter(centro)}
            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 whitespace-nowrap
              ${activeFilter === centro
                ? "bg-[#0072B9] text-white shadow-md transform scale-105"
                : "text-slate-500 hover:text-[#0072B9] hover:bg-slate-50"}`}
          >
            Sede {centro}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loadingMascotas ? (
        <div className="flex items-center gap-3 py-20 text-slate-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="font-medium">Cargando mascotas...</span>
        </div>
      ) : mascotasFiltradas.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <p className="font-bold text-lg">No hay mascotas en el Centro {activeFilter} por ahora.</p>
          <p className="text-sm mt-2">Pronto habrá nuevos compañeros esperando.</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 w-full max-w-7xl justify-center">
          {/* Flecha izq */}
          <button className="hidden md:flex w-12 h-12 rounded-full border-2 bg-white border-slate-200 items-center justify-center text-slate-400 hover:border-[#FFD335] hover:text-[#FFD335] transition-all flex-shrink-0 group shadow-sm">
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <AnimatePresence mode="wait">
              {mascotasFiltradas.map((mascota) => (
                <motion.div
                  key={mascota.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[2rem] border border-slate-100 p-4 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group"
                >
                  <div className="relative w-full h-64 rounded-3xl overflow-hidden mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={mascota.foto_url ?? FALLBACKS[mascota.especie] ?? FALLBACKS.Perro}
                      alt={mascota.nombre}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {mascota.urgente && (
                      <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Urgente
                      </span>
                    )}
                    <button
                      onClick={() => handleFavoriteClick(mascota)}
                      className={`absolute top-4 right-4 backdrop-blur-sm p-2.5 rounded-full shadow-sm hover:scale-110 transition-all active:scale-95
                        ${favorites.has(mascota.id) ? "bg-[#FFD335] text-white" : "bg-white/90 text-slate-400 hover:text-[#FFD335]"}`}
                    >
                      <Heart size={20} className={favorites.has(mascota.id) ? "fill-white" : ""} />
                    </button>
                  </div>

                  <div className="px-2 pb-2 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{mascota.nombre}</h3>
                    <p className="text-slate-500 text-sm mb-6 font-medium">{mascota.especie}</p>

                    <div className="space-y-3 mb-8">
                      <div className="flex justify-between items-center text-sm border-b border-slate-50 pb-2">
                        <span className="text-slate-500 font-medium">Edad</span>
                        <span className="font-bold text-slate-800">{mascota.edad} {mascota.edad === 1 ? "año" : "años"}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">Esterilizado</span>
                        <div className={`flex items-center gap-1 font-bold ${mascota.esterilizado ? "text-[#7DD64C]" : "text-slate-400"}`}>
                          {mascota.esterilizado ? <><Check size={16} strokeWidth={3} /> Sí</> : <span>No</span>}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setDetailsPet(mascota)}
                      className="mt-auto w-full bg-slate-50 text-slate-600 border border-slate-200 py-3 rounded-2xl font-bold hover:border-[#0072B9] hover:text-[#0072B9] transition-all flex items-center justify-center gap-2 mb-3 text-sm group/btn"
                    >
                      Ver más detalles <ArrowUpRight size={18} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => handleAdoptClick(mascota)}
                      className="w-full bg-[#7DD64C] text-white py-4 rounded-2xl font-bold hover:bg-[#6bb83f] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm uppercase tracking-wider"
                    >
                      Adoptar a {mascota.nombre.split(" ")[0]}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Flecha der */}
          <button className="hidden md:flex w-12 h-12 rounded-full border-2 bg-white border-slate-200 items-center justify-center text-slate-400 hover:border-[#FFD335] hover:text-[#FFD335] transition-all flex-shrink-0 group shadow-sm">
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      )}

      {/* ── Toast: Favorito guardado ── */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] bg-slate-900 text-white px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <Heart size={18} className="fill-[#FFD335] text-[#FFD335]" />
            <span><span className="text-[#FFD335]">{toast.name}</span> se guardó en tus favoritos</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LoginModal — abre en tab "signup" ── */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={handleLoginClose}
        initialTab="signup"
      />

      {/* ── Drawer de adopción ── */}
      <CreateApplicationDrawer
        isOpen={showAdoptionDrawer}
        onClose={() => setShowAdoptionDrawer(false)}
        selectedPet={selectedPet ? {
          id: selectedPet.id,
          name: selectedPet.nombre,
          shelter: `Centro ${selectedPet.centro}`
        } : null}
      />

      {/* ── Overlay detalle ── */}
      <PetDetailsOverlay
        isOpen={!!detailsPet}
        onClose={() => setDetailsPet(null)}
        pet={detailsPet ? {
          id: 0,
          nombre:       detailsPet.nombre,
          raza:         detailsPet.especie,
          edad:         `${detailsPet.edad} ${detailsPet.edad === 1 ? "año" : "años"}`,
          vacunas:      detailsPet.esterilizado ? "Completas" : "Pendientes",
          esterilizado: detailsPet.esterilizado,
          img:          detailsPet.foto_url ?? FALLBACKS[detailsPet.especie] ?? "",
          centro:       detailsPet.centro,
          descripcion:  detailsPet.descripcion,
        } : null}
      />
    </section>
  );
}