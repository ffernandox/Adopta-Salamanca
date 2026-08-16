"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock, CheckCircle2, XCircle, Calendar,
  MapPin, PawPrint, ChevronRight, Home, Loader2, FileText
} from "lucide-react";
import { supabase } from "@/lib/supabase";

//  Tipos 
type EstadoSolicitud = "pendiente" | "aprobada" | "rechazada";

interface Solicitud {
  id: string;
  estado: EstadoSolicitud;
  creado_en: string;
  datos_hogar: Record<string, string> | null;
  mascotas: {
    nombre: string;
    especie: string;
    foto_url: string | null;
    centro: string;
  }[] | null;
}

//  Configuración de estados 
const getStatusConfig = (estado: EstadoSolicitud) => {
  switch (estado) {
    case "aprobada":  return { color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", icon: CheckCircle2, label: "Aprobada" };
    case "pendiente": return { color: "text-amber-600",   bg: "bg-amber-50",   border: "border-amber-200",   icon: Clock,        label: "En Revisión" };
    case "rechazada": return { color: "text-rose-600",    bg: "bg-rose-50",    border: "border-rose-200",    icon: XCircle,      label: "No Aprobada" };
    default:          return { color: "text-slate-600",   bg: "bg-slate-50",   border: "border-slate-200",   icon: Clock,        label: "Pendiente" };
  }
};

//  Stepper de seguimiento 
const Stepper = ({ estado }: { estado: EstadoSolicitud }) => {
  const steps = [
    { id: "pendiente", label: "Revisión" },
    { id: "interview", label: "Entrevista" },
    { id: "resolution", label: "Resolución" },
  ];
  const stepIndex = estado === "pendiente" ? 0 : 2;
  const isRejected = estado === "rechazada";

  return (
    <div className="flex items-start justify-between mt-8 px-2 relative">
      {steps.map((step, index) => {
        const isCompleted = index < stepIndex || (estado === "aprobada" && index <= 2);
        const isCurrent   = index === stepIndex;
        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all
                ${isCompleted && !isRejected   ? "bg-emerald-500 border-emerald-500 text-white"
                : isRejected && index === 2    ? "bg-rose-500 border-rose-500 text-white"
                : isCurrent                    ? "bg-[#E83C7E] border-[#E83C7E] text-white"
                :                                "bg-white border-slate-200 text-slate-400"}`}
              >
                {isCompleted && !isRejected ? <CheckCircle2 size={14} /> : isRejected && index === 2 ? <XCircle size={14} /> : index + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                ${isCompleted && !isRejected ? "text-emerald-600"
                : isRejected && index === 2  ? "text-rose-600"
                : isCurrent                  ? "text-[#E83C7E]"
                :                              "text-slate-400"}`}
              >
                {isRejected && index === 2 ? "Rechazada" : step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 bg-slate-100 relative overflow-hidden rounded-full mt-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: index < stepIndex ? "100%" : "0%" }}
                  className={`absolute top-0 left-0 h-full ${isRejected && index === 1 ? "bg-rose-400" : "bg-emerald-400"}`}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

//  Página principal 
export default function SolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSolicitudes = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      const { data } = await supabase
        .from("solicitudes")
        .select(`
          id, estado, creado_en, datos_hogar,
          mascotas (nombre, especie, foto_url, centro)
        `)
        .eq("usuario_id", session.user.id)
        .order("creado_en", { ascending: false });

      if (data) setSolicitudes(data as unknown as Solicitud[]);
      setLoading(false);
    };
    loadSolicitudes();
  }, []);

  const FALLBACK_DOG = "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&q=80";
  const activas = solicitudes.filter(s => s.estado === "pendiente").length;

  return (
    <div className="animate-in fade-in duration-500 max-w-5xl mx-auto">

      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Mis Solicitudes de Adopción</h2>
          <p className="text-sm text-slate-500 font-medium">Da seguimiento al proceso de las mascotas que deseas integrar a tu familia.</p>
        </div>
        {activas > 0 && (
          <div className="bg-[#E83C7E]/10 border border-[#E83C7E]/20 px-5 py-3 rounded-2xl flex items-center gap-4 shrink-0">
            <div className="bg-white p-2 rounded-xl text-[#E83C7E] shadow-sm"><PawPrint size={20} /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E83C7E]">En Proceso</p>
              <p className="text-xl font-black text-slate-900 leading-none mt-0.5">{activas}</p>
            </div>
          </div>
        )}
      </div>

      {/* Cargando */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="font-medium">Cargando solicitudes...</span>
        </div>

      /* Estado si no hay solicitudes */
      ) : solicitudes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
            <FileText size={36} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-700 mb-2">No tienes solicitudes aún</h3>
          <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed mb-6">
            Cuando envíes una solicitud de adopción podrás darle seguimiento desde aquí.
          </p>
          <a
            href="/website"
            className="bg-[#E83C7E] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-[#D43372] transition shadow-lg shadow-[#E83C7E]/20"
          >
            Explorar mascotas
          </a>
        </div>

      /* Lista */
      ) : (
        <div className="space-y-6 pb-10">
          {solicitudes.map((sol) => {
            const config  = getStatusConfig(sol.estado);
            const StatusIcon = config.icon;
            const mascota  = Array.isArray(sol.mascotas) ? sol.mascotas[0] : sol.mascotas;
            const petName  = mascota?.nombre ?? "Mascota";
            const petImg   = mascota?.foto_url ?? FALLBACK_DOG;
            const petEsp   = mascota?.especie ?? "—";
            const centro   = mascota?.centro ? `Centro ${mascota.centro}` : "—";
            const fecha = new Date(sol.creado_en).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });

            return (
              <motion.div
                key={sol.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-[2rem] p-6 md:p-8 shadow-sm hover:shadow-md transition-all"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Folio: {sol.id.slice(0, 8).toUpperCase()}
                  </span>
                  <div className={`px-4 py-1.5 rounded-full flex items-center gap-2 border ${config.bg} ${config.border} w-fit`}>
                    <StatusIcon size={14} className={config.color} />
                    <span className={`text-xs font-black uppercase tracking-wider ${config.color}`}>{config.label}</span>
                  </div>
                </div>

                {/* Mascota */}
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-md shrink-0 border-4 border-slate-50">
                    <img src={petImg || FALLBACK_DOG} alt={petName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">{petName}</h3>
                    <p className="text-sm font-bold text-slate-500 mb-4 capitalize">{petEsp}</p>
                    <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start">
                      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold">
                        <Home size={16} /> {centro}
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-xl text-sm font-bold">
                        <Calendar size={16} /> {fecha}
                      </div>
                    </div>
                  </div>
                </div>

                <Stepper estado={sol.estado} />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}