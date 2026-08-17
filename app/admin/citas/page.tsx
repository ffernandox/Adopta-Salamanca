"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { 
  Plus, ChevronLeft, ChevronRight, 
  Clock, MoreVertical, User, CheckCircle2, X, Dog, Tag, Building2, AlertCircle, Heart, Phone, AlignLeft, Calendar, Video
} from "lucide-react";

import AppointmentDetailPanel from "@/components/AppointmentDetailPanel";
import { supabase } from "@/lib/supabase";

// =========================================================================
// SIMULACIÓN DE SESIÓN Y USUARIO LOGUEADO
// Pendiente: cuando la tabla "perfiles" tenga un campo de albergue/centro,
// sustituir esto por el valor real del admin logueado.
// =========================================================================
const LOGGED_IN_SHELTER = "Refugio Esperanza"; 

// =========================================================================
// BASE DE DATOS SIMULADA
// =========================================================================
const SHELTERS = ["Refugio Esperanza", "Huellitas de Amor", "Sanctuary Paws", "Amigos Peludos"];

const PETS_BY_SHELTER: Record<string, string[]> = {
  "Refugio Esperanza": ["Bucky", "Luna", "Max", "Kira"],
  "Huellitas de Amor": ["Rocky", "Coco", "Simba", "Nala"],
  "Sanctuary Paws": ["Thor", "Zeus", "Bella", "Lola"],
  "Amigos Peludos": ["Molly", "Daisy", "Toby", "Bruno"]
};

const today = new Date();
const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

export interface Appointment {
  id: string;
  date: string; 
  time: string;
  duration: string;
  title: string;
  pet: string;
  shelter: string;
  adopter: string;
  phone: string;  
  notes: string;  
  type: string;
  color: string;
  status?: 'Pendiente' | 'Completado'; 
}

// Forma de una fila tal como la devuelve Supabase (tabla "citas")
interface CitaRow {
  id: string;
  fecha: string;
  hora: string;
  duracion: string;
  tipo: string;
  centro: string;
  mascota_nombre: string;
  adoptante: string;
  telefono: string | null;
  notas: string | null;
  estado: 'Pendiente' | 'Completado';
}

// Mapea una fila de la tabla "citas" (Supabase) a la forma que usa la UI
const mapRowToAppointment = (row: CitaRow): Appointment => ({
  id: row.id,
  date: row.fecha,
  time: row.hora,
  duration: row.duracion,
  title: row.tipo === "Entrega" ? "Entrega de Mascota" : row.tipo === "Salud" ? "Revisión Veterinaria" : "Entrevista de Adopción",
  pet: row.mascota_nombre,
  shelter: row.centro,
  adopter: row.adoptante,
  phone: row.telefono || "",
  notes: row.notas || "",
  type: row.tipo,
  color: row.tipo === "Entrega" ? "bg-emerald-500" : row.tipo === "Salud" ? "bg-amber-500" : "bg-indigo-500",
  status: row.estado,
});

// =========================================================================
// COMPONENTE: SELECTOR UNIVERSAL ANIMADO 
// =========================================================================
interface CustomPickerProps {
  icon: React.ElementType; 
  value: string;
  options: string[];
  onChange: (val: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const CustomPicker = ({ icon: Icon, value, options, onChange, placeholder = "Seleccionar...", disabled = false }: CustomPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div onClick={() => !disabled && setIsOpen(true)} className={`w-full bg-slate-800/50 backdrop-blur-md border ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-700/50'} rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-300 cursor-pointer flex items-center justify-between transition hover:border-slate-600 shadow-sm`}>
        <div className="flex items-center gap-2">
          <Icon className="absolute left-4 text-slate-500" size={18} />
          {value ? <span className="font-bold text-white truncate max-w-[130px]">{value}</span> : <span className="text-slate-500 font-normal truncate max-w-[130px]">{placeholder}</span>}
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-xs text-slate-500">▼</motion.span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[85000]" onClick={() => setIsOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: -10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: -10 }} transition={{ type: "spring", damping: 25, stiffness: 300 }} className="absolute left-0 top-full mt-2 w-full bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700 z-[85001] py-4 overflow-hidden">
              <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col items-center gap-1 scroll-smooth px-2">
                {options.map((opt: string) => (
                  <motion.div key={opt} onClick={() => handleSelect(opt)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`w-full py-2.5 px-4 cursor-pointer text-center transition-colors relative flex justify-center items-center rounded-xl ${opt === value ? "text-[18px] font-black text-indigo-400 bg-indigo-500/10 border border-indigo-500/20" : "text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/80"}`}>
                    {opt}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// =========================================================================
// PÁGINA PRINCIPAL: CITAS 
// =========================================================================
export default function CitasPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [overlapError, setOverlapError] = useState("");

  // ── Cargar citas desde Supabase (tiempo real) ─────────────
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoadingAppointments(true);
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .order("fecha", { ascending: true })
        .order("hora", { ascending: true });
      if (!error && data) setAppointments(data.map(mapRowToAppointment));
      setLoadingAppointments(false);
    };
    fetchAppointments();

    const channel = supabase
      .channel("citas_live")
      .on("postgres_changes", { event: "*", schema: "public", table: "citas" }, fetchAppointments)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);
  
  const [currentWeekView, setCurrentWeekView] = useState<Date>(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  });
  
  const [selectedApp, setSelectedApp] = useState<Appointment | null>(null);
  const [appToDelete, setAppToDelete] = useState<Appointment | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({ shelter: LOGGED_IN_SHELTER || "", pet: "", adopter: "", phone: "", notes: "", time: "10:00", duration: "1h", type: "Entrevista" });
  const [initialFormData, setInitialFormData] = useState({ shelter: LOGGED_IN_SHELTER || "", pet: "", adopter: "", phone: "", notes: "", time: "10:00", duration: "1h", type: "Entrevista" });

  const formattedSelectedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
  
  const dailyAppointments = appointments.filter(app => {
    const isMyShelter = LOGGED_IN_SHELTER ? app.shelter === LOGGED_IN_SHELTER : true;
    return app.date === formattedSelectedDate && isMyShelter && app.status !== 'Completado';
  }).sort((a, b) => a.time.localeCompare(b.time));

  const stats = {
    entrevistas: dailyAppointments.filter(app => app.type === "Entrevista").length,
    entregas: dailyAppointments.filter(app => app.type === "Entrega").length,
    salud: dailyAppointments.filter(app => app.type === "Salud").length,
  };

  useEffect(() => {
    document.body.style.overflow = (appToDelete || selectedApp || showFormModal || showUnsavedModal) ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [appToDelete, selectedApp, showFormModal, showUnsavedModal]);

  const handlePrevWeek = () => {
    const newDate = new Date(currentWeekView);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentWeekView(newDate);
  };
  
  const handleNextWeek = () => {
    const newDate = new Date(currentWeekView);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentWeekView(newDate);
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(currentWeekView);
    d.setDate(d.getDate() + i);
    return d;
  });

  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const shortDaysOfWeek = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  
  // Rango de 8 AM a 6 PM 
  const hoursRange = Array.from({ length: 11 }).map((_, i) => i + 8);
  const START_HOUR = 8; // La cuadrícula empieza a las 8 AM

  // =========================================================================
  // NUEVO MOTOR DE CÁLCULO DE POSICIÓN
  // =========================================================================
  const parseTime = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return h * 60 + m;
  };

  const parseDuration = (dur: string) => {
    let mins = 0;
    const hMatch = dur.match(/(\d+)h/);
    const mMatch = dur.match(/(\d+)min/);
    if (hMatch) mins += parseInt(hMatch[1]) * 60;
    if (mMatch) mins += parseInt(mMatch[1]);
    return mins || 60;
  };

  const getEventPositionStyles = (timeStr: string, durationStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    const durationMins = parseDuration(durationStr);
    
    // Calculamos qué fracción de la cuadrícula ocupa.
    // Si la cita es a las 9:00 AM, (9 - 8) = 1. Entonces empieza al terminar el primer bloque.
    // Sumamos +1 porque CSS Grid empieza a contar desde la línea 1.
    const startRow = (h - START_HOUR) + (m / 60) + 1;
    const endRow = startRow + (durationMins / 60);
    
    return { 
      gridRowStart: startRow,
      gridRowEnd: endRow,
      zIndex: 20
    };
  };

  const getEventBlockStyles = (baseColor: string) => {
    if (baseColor.includes('indigo') || baseColor.includes('blue')) return 'bg-indigo-500/10 border-indigo-500/50 text-indigo-100 hover:bg-indigo-500/20 shadow-[0_4px_15px_rgba(79,70,229,0.1)]';
    if (baseColor.includes('emerald') || baseColor.includes('green')) return 'bg-emerald-500/10 border-emerald-500/50 text-emerald-100 hover:bg-emerald-500/20 shadow-[0_4px_15px_rgba(16,185,129,0.1)]';
    if (baseColor.includes('amber') || baseColor.includes('yellow')) return 'bg-amber-500/10 border-amber-500/50 text-amber-100 hover:bg-amber-500/20 shadow-[0_4px_15px_rgba(245,158,11,0.1)]';
    return 'bg-slate-500/10 border-slate-500/50 text-slate-100 hover:bg-slate-500/20';
  };

  // =========================================================================
  // LÓGICA DE MODALES
  // =========================================================================
  const handleDeleteCita = async () => {
    if (appToDelete) {
      const { error } = await supabase.from("citas").delete().eq("id", appToDelete.id);
      if (!error) {
        setAppointments(prev => prev.filter(app => app.id !== appToDelete.id));
      }
      setSelectedApp(null); setAppToDelete(null);
    }
  };

  const handleOpenNewModal = () => {
    const initial = { shelter: LOGGED_IN_SHELTER || "", pet: "", adopter: "", phone: "", notes: "", time: "10:00", duration: "1h", type: "Entrevista" };
    setFormData(initial); setInitialFormData(initial); setEditingId(null); setOverlapError(""); setShowFormModal(true);
  };

  const handleOpenEditModal = (app: Appointment) => {
    const initial = { shelter: app.shelter, pet: app.pet, adopter: app.adopter, phone: app.phone || "", notes: app.notes || "", time: app.time, duration: app.duration, type: app.type };
    setFormData(initial); setInitialFormData(initial); setEditingId(app.id); setOverlapError(""); setSelectedApp(null); setShowFormModal(true); 
  };

  const handleCloseFormAttempt = () => {
    JSON.stringify(formData) !== JSON.stringify(initialFormData) ? setShowUnsavedModal(true) : setShowFormModal(false);
  };

  const confirmDiscardChanges = () => { setShowUnsavedModal(false); setShowFormModal(false); setOverlapError(""); };

  const handleShelterChange = (newShelter: string) => {
    setFormData(prev => ({ ...prev, shelter: newShelter, pet: "" }));
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shelter || !formData.pet || formData.phone.length < 10) return;

    const newStartMins = parseTime(formData.time);
    const newEndMins = newStartMins + parseDuration(formData.duration);

    const hasOverlap = appointments.some(app => {
      if (app.date !== formattedSelectedDate) return false;
      if (app.shelter !== formData.shelter) return false;
      if (editingId && app.id === editingId) return false;
      if (app.status === 'Completado') return false; 

      const appStartMins = parseTime(app.time);
      const appEndMins = appStartMins + parseDuration(app.duration);

      return newStartMins < appEndMins && appStartMins < newEndMins;
    });

    if (hasOverlap) {
      setOverlapError(`La hora seleccionada choca con otra cita programada en este albergue.`);
      return;
    }

    const payload = {
      fecha: formattedSelectedDate,
      hora: formData.time,
      duracion: formData.duration,
      tipo: formData.type,
      centro: formData.shelter,
      mascota_nombre: formData.pet,
      adoptante: formData.adopter,
      telefono: formData.phone,
      notas: formData.notes,
      estado: "Pendiente",
    };

    if (editingId) {
      const { error } = await supabase.from("citas").update(payload).eq("id", editingId);
      if (error) { setOverlapError("No se pudo actualizar la cita: " + error.message); return; }
    } else {
      const { error } = await supabase.from("citas").insert(payload);
      if (error) { setOverlapError("No se pudo guardar la cita: " + error.message); return; }
    }

    // El listado se refresca solo por la suscripción en tiempo real (postgres_changes)
    setOverlapError("");
    setShowFormModal(false);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] w-full gap-6 p-2 relative animate-in fade-in duration-500">
      
      {/* ========================================================= */}
      {/* 🗓️ COLUMNA IZQUIERDA: CALENDARIO SEMANAL */}
      {/* ========================================================= */}
      <div className="flex-1 bg-slate-900/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden h-full relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-700/50 flex justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-black text-white tracking-tighter capitalize flex items-center gap-3">
              <button onClick={handlePrevWeek} className="text-slate-500 hover:text-white transition"><ChevronLeft size={24} /></button>
              {monthNames[currentWeekView.getMonth()]} {currentWeekView.getFullYear()}
              <button onClick={handleNextWeek} className="text-slate-500 hover:text-white transition"><ChevronRight size={24} /></button>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-2 text-sm font-bold text-slate-300 flex items-center gap-2">
                <Calendar size={16}/> Vista Semanal
            </div>
            <button onClick={handleOpenNewModal} className="bg-indigo-600 border border-indigo-500/30 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition shadow-[0_0_15px_rgba(79,70,229,0.4)] active:scale-95 text-sm">
              <Plus size={18} /> Nueva Cita
            </button>
          </div>
        </div>

        {/* Cuadrícula de Tiempo */}
        <div className="flex flex-col flex-1 overflow-hidden relative z-10">
          <div className="flex ml-14 pr-2 mb-2 mt-4">
            {weekDays.map((day, idx) => {
              const isToday = day.toDateString() === today.toDateString();
              const isSelected = day.toDateString() === selectedDate.toDateString();
              return (
                <div key={idx} onClick={() => setSelectedDate(day)} className="flex-1 flex flex-col items-center justify-center cursor-pointer group">
                  <span className="text-xs font-bold text-slate-500 mb-1 group-hover:text-slate-300 transition-colors">{shortDaysOfWeek[day.getDay()]}</span>
                  <div className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${isToday ? 'bg-amber-500/20 text-amber-200 border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]' : isSelected ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 group-hover:bg-slate-800'}`}>
                    <span className="text-lg font-black">{String(day.getDate()).padStart(2, '0')}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex-1 flex overflow-y-auto custom-scrollbar pb-10 relative">
            <div className="w-14 flex flex-col shrink-0 border-r border-slate-700/30">
              {hoursRange.map((hour) => (
                <div key={hour} className="h-[5rem] flex items-start justify-end pr-3">
                  <span className="text-[11px] font-bold text-slate-500 -mt-2">{String(hour).padStart(2, '0')}:00</span>
                </div>
              ))}
            </div>

            <div className="flex-1 flex relative">
              <div 
                className="absolute inset-0 pointer-events-none grid" 
                style={{ 
                  gridTemplateRows: `repeat(${hoursRange.length}, 5rem)`, 
                }}
              >
                {hoursRange.map(h => (
                  <div key={h} className="border-t border-slate-700/30 w-full"></div>
                ))}
              </div>

              {weekDays.map((day, dayIdx) => {
                const formattedDayStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
                
                const dayApps = appointments.filter(app => {
                  const isMyShelter = LOGGED_IN_SHELTER ? app.shelter === LOGGED_IN_SHELTER : true;
                  return app.date === formattedDayStr && isMyShelter && app.status !== 'Completado';
                });

                return (
                  <div 
                    key={dayIdx} 
                    className="flex-1 relative border-r border-slate-700/30 last:border-r-0 grid px-1 py-0.5"
                    style={{
                      // Configuramos la columna para que funcione como un Grid vertical
                      gridTemplateRows: `repeat(${hoursRange.length}, 5rem)`,
                    }}
                  >
                    {dayApps.map(app => {
                      // Obtenemos las coordenadas de Grid para posicionar la cita correctamente
                      const gridPos = getEventPositionStyles(app.time, app.duration);
                      const blockStyles = getEventBlockStyles(app.color);

                      return (
                        <motion.div 
                          key={app.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={(e) => { e.stopPropagation(); setSelectedDate(day); setSelectedApp(app); }}
                          // Aplicamos el gridRow para anclaje perfecto y agregamos margenes internos para evitar que toquen las lineas
                          className={`rounded-xl border-t-4 p-2 cursor-pointer overflow-hidden backdrop-blur-xl transition-all hover:z-30 my-0.5 ${blockStyles}`}
                          style={gridPos}
                        >
                          <h4 className="text-xs font-black leading-tight mb-1 truncate">{app.title}</h4>
                          <div className="flex items-center gap-1 opacity-80 text-[10px] font-medium mb-1">
                            <Clock size={10} /> {app.time} ({app.duration})
                          </div>
                          {app.type === "Entrevista" && <div className="flex items-center gap-1 opacity-80 text-[10px]"><Video size={10}/> Virtual</div>}
                          {app.type === "Entrega" && <div className="flex items-center gap-1 opacity-80 text-[10px]"><User size={10}/> Presencial</div>}
                        </motion.div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* COLUMNA DERECHA: AGENDA DEL DÍA */}
      {/* ========================================================= */}
      <div className="w-[340px] flex flex-col gap-6 shrink-0 h-full overflow-y-auto custom-scrollbar pr-2 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-6 shadow-2xl shrink-0 relative z-10">
          <h2 className="text-2xl font-black text-white tracking-tighter capitalize mb-1">
            {selectedDate.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
          </h2>
          <p className="text-sm font-medium text-slate-400 mb-6">Resumen de actividades</p>
          
          <div className="space-y-3">
             <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-inner">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-sm"><User size={20}/></div>
                 <span className="text-sm font-bold text-slate-300">Entrevistas</span>
               </div>
               <span className="text-2xl font-black text-white">{stats.entrevistas}</span>
             </div>

             <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-inner">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shadow-sm"><Heart size={20}/></div>
                 <span className="text-sm font-bold text-slate-300">Entregas</span>
               </div>
               <span className="text-2xl font-black text-white">{stats.entregas}</span>
             </div>

             <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/60 border border-slate-700 shadow-inner">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-sm"><AlertCircle size={20}/></div>
                 <span className="text-sm font-bold text-slate-300">Salud</span>
               </div>
               <span className="text-2xl font-black text-white">{stats.salud}</span>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 relative z-10">
          <h3 className="font-black text-white tracking-tight flex items-center gap-2 px-2">
            <Calendar size={18} className="text-slate-500"/> Citas Programadas
          </h3>

          {dailyAppointments.length === 0 ? (
            <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] flex items-center justify-center text-center p-8 shadow-2xl">
              <p className="text-slate-500 font-medium text-sm">No tienes citas pendientes para este día.</p>
            </div>
          ) : (
            <div className="space-y-4 pb-10">
              {dailyAppointments.map((app) => (
                <motion.div 
                  key={app.id} 
                  onClick={() => setSelectedApp(app)}
                  whileHover={{ scale: 1.02 }}
                  className="bg-slate-800/60 backdrop-blur-md border border-slate-700 shadow-lg rounded-3xl p-5 cursor-pointer hover:border-slate-500 transition-all relative overflow-hidden group"
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-2 ${app.color} shadow-[0_0_10px_currentColor] opacity-90`} />
                  <div className="pl-3">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-black text-white text-sm leading-tight pr-4">{app.title}</h4>
                      <div className="bg-slate-900 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 shadow-inner flex items-center gap-1 shrink-0">
                        <Clock size={12} className="text-slate-500"/> <span className="text-xs font-bold">{app.time}</span>
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span className="text-indigo-400">{app.pet}</span> | {app.adopter}
                    </p>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed bg-slate-900/40 p-2 rounded-lg border border-slate-700/50">{app.notes || "Sin notas adicionales."}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* PORTALS DE MODALES */}
      {/* ========================================================= */}
      {typeof document !== "undefined" && createPortal(
        <>
          <AnimatePresence>
            {selectedApp && (
              <AppointmentDetailPanel 
                appointment={selectedApp} 
                onClose={() => setSelectedApp(null)} 
                onDeleteClick={() => setAppToDelete(selectedApp)} 
                onEditClick={() => handleOpenEditModal(selectedApp)}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {appToDelete && (
              <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setAppToDelete(null)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_10px_50px_rgba(0,0,0,0.7)] z-[100000] relative border border-slate-700 text-center">
                  <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-sm"><X size={32} strokeWidth={3} /></div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">¿Eliminar cita?</h3>
                  <p className="text-slate-400 font-medium mb-8 leading-relaxed text-sm">La cita de <span className="font-bold text-slate-200">{appToDelete.pet}</span> será borrada permanentemente.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setAppToDelete(null)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition">Cancelar</button>
                    <button onClick={handleDeleteCita} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black shadow-lg shadow-rose-900/50 hover:bg-rose-500 transition active:scale-95">Eliminar</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showFormModal && (
              <div className="fixed inset-0 z-[80000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={handleCloseFormAttempt} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-slate-900/95 backdrop-blur-2xl border border-slate-700 rounded-[2.5rem] p-8 max-w-lg w-full shadow-[0_10px_50px_rgba(0,0,0,0.7)] z-[80001] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-black text-white tracking-tighter">{editingId ? "Reagendar Cita" : "Agendar Cita"}</h3>
                    <button onClick={handleCloseFormAttempt} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white shadow-sm bg-slate-800/50 border border-slate-700"><X size={20} /></button>
                  </div>
                  
                  <p className="text-[11px] font-bold text-indigo-400 bg-indigo-500/10 py-2 px-4 rounded-xl mb-4 inline-flex items-center gap-2 border border-indigo-500/20">
                    <Calendar size={14} />
                    Para el {selectedDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>

                  <AnimatePresence>
                    {overlapError && (
                       <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} exit={{opacity:0, height:0}} className="bg-rose-500/10 text-rose-400 p-3 rounded-xl text-xs font-bold mb-4 border border-rose-500/30 flex items-center gap-2">
                          <AlertCircle size={16} className="shrink-0" /> {overlapError}
                       </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmitForm} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 relative">
                      <div className="relative z-50">
                        {LOGGED_IN_SHELTER ? (
                          <div className="opacity-70 pointer-events-none">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Albergue</label>
                            <div className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-400 relative shadow-sm">
                               <Building2 className="absolute left-4 text-slate-500" size={18} />
                               {LOGGED_IN_SHELTER}
                            </div>
                          </div>
                        ) : (
                           <CustomPicker icon={Building2} value={formData.shelter} options={SHELTERS} onChange={handleShelterChange} placeholder="Albergue..."/>
                        )}
                      </div>

                      <div className="relative z-40">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Mascota</label>
                        <CustomPicker icon={Dog} value={formData.pet} options={formData.shelter ? PETS_BY_SHELTER[formData.shelter] : []} onChange={(val: string) => setFormData({...formData, pet: val})} placeholder={formData.shelter ? "Mascota..." : "Elija albergue"} disabled={!formData.shelter}/>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Adoptante</label>
                        <div className="relative">
                          <User className="absolute left-4 top-3.5 text-slate-500" size={18} />
                          <input required type="text" value={formData.adopter} onChange={(e) => setFormData({...formData, adopter: e.target.value})} placeholder="Ej. Juan Pérez" className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-sm rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition placeholder:font-medium placeholder:text-slate-600"/>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Teléfono</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-3.5 text-slate-500" size={18} />
                          <input required type="tel" maxLength={10} value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10)})} placeholder="Ej. 5551234567" className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-sm rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition placeholder:font-medium placeholder:text-slate-600"/>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 relative">
                      <div className="relative z-30"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Hora</label><CustomPicker icon={Clock} value={formData.time} options={Array.from({ length: 11 }).map((_, i) => `${String(i + 8).padStart(2, '0')}:00`)} onChange={(val: string) => {setFormData({...formData, time: val}); setOverlapError("");}} /></div>
                      <div className="relative z-20"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Duración</label><CustomPicker icon={Clock} value={formData.duration} options={["30min", "45min", "1h", "1h 30min", "2h"]} onChange={(val: string) => {setFormData({...formData, duration: val}); setOverlapError("");}} /></div>
                      <div className="relative z-10"><label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Tipo</label><CustomPicker icon={Tag} value={formData.type} options={["Entrevista", "Entrega", "Salud"]} onChange={(val: string) => setFormData({...formData, type: val})} /></div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Notas (Opcional)</label>
                      <div className="relative">
                        <AlignLeft className="absolute left-4 top-4 text-slate-500" size={18} />
                        <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Comentarios adicionales sobre la cita..." rows={3} className="w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 shadow-sm rounded-2xl pl-12 pr-4 py-3 text-sm font-bold text-white focus:outline-none focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition resize-none custom-scrollbar placeholder:font-medium placeholder:text-slate-600"/>
                      </div>
                    </div>

                    <button type="submit" disabled={!formData.shelter || !formData.pet || formData.phone.length < 10} className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-indigo-500 transition shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none border border-indigo-500/50">
                      {editingId ? "Actualizar Cita" : "Guardar Cita"}
                    </button>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showUnsavedModal && (
              <div className="fixed inset-0 z-[90000] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowUnsavedModal(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] p-8 max-w-sm w-full shadow-[0_10px_50px_rgba(0,0,0,0.7)] z-[90001] relative border border-slate-700 text-center">
                  <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-center text-amber-500 mx-auto mb-6 shadow-sm"><AlertCircle size={32} strokeWidth={3} /></div>
                  <h3 className="text-2xl font-black text-white mb-2 tracking-tighter">¿Descartar cambios?</h3>
                  <p className="text-slate-400 font-medium mb-8 leading-relaxed text-sm">Si cierras ahora, los datos que ingresaste se perderán.</p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowUnsavedModal(false)} className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 transition">Regresar</button>
                    <button onClick={confirmDiscardChanges} className="flex-1 py-4 rounded-2xl bg-amber-600 text-white font-black shadow-lg shadow-amber-900/50 hover:bg-amber-500 transition active:scale-95">Descartar</button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </>,
        document.body
      )}
    </div>
  );
}