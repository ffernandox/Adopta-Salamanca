"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, ArrowLeft, MoreHorizontal, 
  Trash2, RefreshCw, MessageSquare, Phone, 
  Calendar, CheckCircle, Clock, X, ChevronRight,
  Check, XCircle, ArrowUpDown, Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CreateApplicationDrawer from "@/components/CreateApplicationDrawer";
import { supabase } from "@/lib/supabase";

// ── Tipos reales de la BD 
type EstadoDB = "pendiente" | "aprobada" | "rechazada";

interface SolicitudRow {
  id: string;
  usuario_id: string;
  estado: EstadoDB;
  creado_en: string;
  datos_hogar: Record<string, string> | null;
  mascotas: { nombre: string; especie: string } | null;
  perfiles:  { nombre: string; apellido: string | null } | null;
}

// Mapa para mostrar etiquetas
const LABEL: Record<EstadoDB, string> = {
  pendiente: "Pendiente",
  aprobada:  "Aprobada",
  rechazada: "Rechazada",
};

const STATUS_STYLE: Record<EstadoDB, string> = {
  aprobada:  "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rechazada: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  pendiente: "bg-amber-500/20 text-amber-400 border-amber-500/30",
};

type TabFilter = EstadoDB | "todas";

export default function SolicitudesPage() {
  const [rows, setRows]             = useState<SolicitudRow[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [activeTab, setActiveTab]   = useState<TabFilter>("todas");
  const [sortOrder, setSortOrder]   = useState("recientes");
  const [openActionId, setOpenActionId]   = useState<string | null>(null);
  const [showStatusSubmenu, setShowStatusSubmenu] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen]   = useState(false);

  //  Cargar solicitudes 
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      // 1. Solicitudes + mascota
      const { data: solData } = await supabase
        .from("solicitudes")
        .select(`
          id, estado, creado_en, datos_hogar,
          mascotas (nombre, especie)
        `)
        .order("creado_en", { ascending: false });

      if (!solData) { setLoading(false); return; }

      // 2. IDs únicos de usuarios
      const usuarioIds = [...new Set(
        (solData as unknown as { usuario_id?: string }[])
          .map(s => s.usuario_id)
          .filter(Boolean)
      )];

      // 3. Traer perfiles por esos IDs
      const { data: perfilesData } = await supabase
        .from("perfiles")
        .select("id, nombre, apellido")
        .in("id", usuarioIds as string[]);

      const perfilesMap: Record<string, { nombre: string; apellido: string | null }> = {};
      (perfilesData ?? []).forEach((p: { id: string; nombre: string; apellido: string | null }) => {
        perfilesMap[p.id] = { nombre: p.nombre, apellido: p.apellido };
      });

      // 4. Unir manualmente
      const merged = (solData as unknown as (SolicitudRow & { usuario_id: string })[]).map(s => ({
        ...s,
        perfiles: perfilesMap[s.usuario_id] ?? null,
      }));

      setRows(merged);
      setLoading(false);
    };
    loadData();
  }, [refreshKey]);

  //  Cambiar estado 
  const handleStatusChange = async (id: string, newEstado: EstadoDB) => {
    await supabase.from("solicitudes").update({ estado: newEstado }).eq("id", id);
    setRows(prev => prev.map(r => r.id === id ? { ...r, estado: newEstado } : r));
    setOpenActionId(null);
    setShowStatusSubmenu(false);
  };

  //  Eliminar 
  const handleDelete = async (id: string) => {
    await supabase.from("solicitudes").delete().eq("id", id);
    setRows(prev => prev.filter(r => r.id !== id));
    setOpenActionId(null);
  };

  //  Filtrar y ordenar 
  const filtered = rows
    .filter(r => activeTab === "todas" || r.estado === activeTab)
    .filter(r => {
      if (!search) return true;
      const nombre = [r.perfiles?.nombre, r.perfiles?.apellido].filter(Boolean).join(" ").toLowerCase();
      const mascota = r.mascotas?.nombre?.toLowerCase() ?? "";
      return nombre.includes(search.toLowerCase()) || mascota.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      const diff = new Date(b.creado_en).getTime() - new Date(a.creado_en).getTime();
      return sortOrder === "recientes" ? diff : -diff;
    });

  const tabs: { key: TabFilter; label: string }[] = [
    { key: "todas",     label: "Todas" },
    { key: "pendiente", label: "Pendiente" },
    { key: "aprobada",  label: "Aprobada" },
    { key: "rechazada", label: "Rechazada" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300 relative">

      {openActionId !== null && (
        <div className="fixed inset-0 z-40 bg-transparent" onClick={() => { setOpenActionId(null); setShowStatusSubmenu(false); }} />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Solicitudes de Adopción</h1>
            <p className="text-slate-400 text-sm font-medium">Gestiona y valida los documentos de los candidatos.</p>
          </div>
        </div>
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/30 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/50 transition-all"
        >
          + Nueva Solicitud
        </button>
      </div>

      {/* Contenedor principal */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-8 flex flex-col shadow-2xl overflow-visible min-h-[600px] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Toolbar */}
        <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 z-30">

          {/* Tabs */}
          <div className="flex bg-slate-800/50 border border-slate-700/50 p-1.5 rounded-xl relative">
            {tabs.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`relative px-4 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${activeTab === key ? "text-white" : "text-slate-400 hover:text-slate-200"}`}
              >
                {activeTab === key && (
                  <motion.div layoutId="activeTabBg" className="absolute inset-0 bg-slate-700/80 border border-slate-600 shadow-md rounded-lg" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                )}
                <span className="relative z-10">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-end">

            {/* Ordenar */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between gap-3 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-bold text-slate-300 outline-none hover:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 transition-all cursor-pointer w-48 shadow-sm group"
              >
                <span>{sortOrder === "recientes" ? "Más Recientes" : "Más Antiguos"}</span>
                <motion.span className="text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center" whileHover={{ rotate: 180, scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <ArrowUpDown size={16} strokeWidth={2.5} />
                </motion.span>
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsSortOpen(false)} />
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute top-full mt-2 left-0 w-full bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 py-1">
                      {["recientes", "antiguos"].map(opt => (
                        <button key={opt} onClick={() => { setSortOrder(opt); setIsSortOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm font-bold transition-colors flex items-center justify-between ${sortOrder === opt ? "bg-indigo-500/20 text-indigo-400" : "text-slate-300 hover:bg-slate-800"}`}>
                          {opt === "recientes" ? "Más Recientes" : "Más Antiguos"}
                          {sortOrder === opt && <Check size={14} className="text-indigo-400" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Buscador */}
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all w-64 shadow-sm"
              />
            </div>
          </div>
        </div>

        {/* Tabla */}
        {loading ? (
          <div className="flex items-center justify-center flex-1 gap-3 text-slate-400">
            <Loader2 size={24} className="animate-spin" />
            <span className="font-medium">Cargando solicitudes...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-3 text-slate-500">
            <p className="font-bold text-lg">No hay solicitudes{activeTab !== "todas" ? ` con estado "${LABEL[activeTab as EstadoDB]}"` : ""}</p>
          </div>
        ) : (
          <div className="overflow-visible flex-1">
            <table className="w-full text-left border-collapse">
              <thead className="border-b border-slate-700/50">
                <tr className="text-slate-500 text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-4 pl-2">Candidato</th>
                  <th className="pb-4">Mascota</th>
                  <th className="pb-4">Estado</th>
                  <th className="pb-4">Fecha</th>
                  <th className="pb-4 text-right pr-4">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence>
                  {filtered.map(item => {
                    const nombreCompleto = [item.perfiles?.nombre, item.perfiles?.apellido].filter(Boolean).join(" ") || "Usuario";
                    const inicial = nombreCompleto.charAt(0).toUpperCase();
                    const mascotaLabel = item.mascotas ? `${item.mascotas.nombre} (${item.mascotas.especie})` : "—";
                    const fecha = new Date(item.creado_en).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
                    const email = item.datos_hogar?.email ?? "—";

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="group hover:bg-slate-800/40 border-b border-slate-800/50 last:border-0 transition-colors"
                      >
                        <td className="py-4 pl-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-400 shadow-sm">
                              {inicial}
                            </div>
                            <div>
                              <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{nombreCompleto}</p>
                              <p className="text-xs text-slate-500">{email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-slate-300 font-bold capitalize">{mascotaLabel}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border shadow-sm ${STATUS_STYLE[item.estado]}`}>
                            {LABEL[item.estado]}
                          </span>
                        </td>
                        <td className="py-4 text-slate-400 font-medium">{fecha}</td>

                        <td className="py-4 text-right pr-4 relative">
                          <button
                            onClick={e => { e.stopPropagation(); setOpenActionId(openActionId === item.id ? null : item.id); setShowStatusSubmenu(false); }}
                            className={`p-2 rounded-lg transition-colors relative z-50 ${openActionId === item.id ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" : "text-slate-400 hover:bg-slate-700 hover:text-white border border-transparent"}`}
                          >
                            <MoreHorizontal size={18} />
                          </button>

                          <AnimatePresence>
                            {openActionId === item.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10, x: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute right-10 top-2 z-[60] w-64 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700 p-2 flex flex-col gap-1 text-left"
                                style={{ transformOrigin: "top right" }}
                              >
                                <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700/50 mb-1">
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Acciones</p>
                                  <button onClick={() => setOpenActionId(null)} className="text-slate-500 hover:text-rose-400 hover:bg-rose-500/20 p-1 rounded-md transition"><X size={14} /></button>
                                </div>

                                {/* Cambiar estado */}
                                <div className="relative" onMouseEnter={() => setShowStatusSubmenu(true)} onMouseLeave={() => setShowStatusSubmenu(false)}>
                                  <button className={`flex items-center justify-between w-full px-3 py-2.5 text-sm rounded-xl transition font-medium border ${showStatusSubmenu ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "text-slate-300 hover:bg-slate-800/80 border-transparent"}`}>
                                    <div className="flex items-center gap-3">
                                      <RefreshCw size={16} className={showStatusSubmenu ? "text-indigo-400" : "text-slate-500"} />
                                      Cambiar Estatus
                                    </div>
                                    <ChevronRight size={16} className="text-slate-500" />
                                  </button>
                                  <AnimatePresence>
                                    {showStatusSubmenu && (
                                      <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="absolute right-full top-0 mr-2 w-48 bg-slate-900/95 backdrop-blur-xl rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700 p-1.5 z-[70]">
                                        <div className="text-[10px] font-bold text-slate-500 px-3 py-1.5 uppercase tracking-widest border-b border-slate-700/50 mb-1">Seleccionar Estado</div>
                                        {([
                                          { value: "aprobada",  label: "Aprobada",  color: "text-emerald-400", bg: "hover:bg-emerald-500/20", icon: CheckCircle },
                                          { value: "pendiente", label: "Pendiente", color: "text-amber-400",   bg: "hover:bg-amber-500/20",   icon: Clock },
                                          { value: "rechazada", label: "Rechazada", color: "text-rose-400",    bg: "hover:bg-rose-500/20",    icon: XCircle },
                                        ] as const).map(s => (
                                          <button key={s.value} onClick={() => handleStatusChange(item.id, s.value)} className={`flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg transition font-medium text-slate-300 border border-transparent ${s.bg}`}>
                                            <s.icon size={14} className={s.color} />
                                            {s.label}
                                            {item.estado === s.value && <span className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
                                          </button>
                                        ))}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>

                                <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 rounded-xl transition font-medium">
                                  <MessageSquare size={16} className="text-purple-400" /> Comentarios
                                </button>
                                <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 rounded-xl transition font-medium">
                                  <Phone size={16} className="text-emerald-400" /> Contactar
                                </button>
                                <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/80 rounded-xl transition font-medium">
                                  <Calendar size={16} className="text-orange-400" /> Agendar Cita
                                </button>
                                <div className="h-px bg-slate-700/50 my-1" />
                                <button onClick={() => handleDelete(item.id)} className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/30 border border-transparent rounded-xl transition font-bold">
                                  <Trash2 size={16} /> Eliminar Solicitud
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <CreateApplicationDrawer
        isOpen={isDrawerOpen}
        onClose={() => { setIsDrawerOpen(false); setRefreshKey(k => k + 1); }}
      />
    </div>
  );
}