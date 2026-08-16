"use client";

import { motion } from "framer-motion";
import { X, Calendar, Clock, User, Edit3, Phone, AlignLeft, Building2 } from "lucide-react";
import { Appointment } from "@/app/admin/citas/page";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

interface DetailPanelProps {
  appointment: Appointment; 
  onClose: () => void;
  onDeleteClick: () => void;
  onEditClick: () => void;
}

export default function AppointmentDetailPanel({ appointment, onClose, onDeleteClick, onEditClick }: DetailPanelProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[5499] bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.7)] z-[5500] flex flex-col border-l border-slate-700/50"
      >
        <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
          <h3 className="text-xl font-black text-white uppercase tracking-widest">Detalles de Cita</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="space-y-8">
            
            {/* CARD MASCOTA */}
            <div className="bg-slate-800/40 rounded-[2rem] p-6 flex flex-col items-center text-center border border-slate-700 relative overflow-hidden shadow-inner">
              <div className={`absolute top-0 left-0 w-full h-1.5 ${appointment.color} shadow-[0_0_10px_currentColor]`} />
              <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center shadow-md mb-3 border border-slate-600 text-xl mt-2">
                 🐾
              </div>
              <h4 className="text-2xl font-black text-white tracking-tighter">{appointment.pet}</h4>
              <div className="flex items-center gap-1.5 text-slate-400 mt-1 mb-4">
                <Building2 size={14} />
                <span className="text-xs font-medium">{appointment.shelter}</span>
              </div>
              <span className="px-4 py-1.5 bg-slate-900/50 border border-slate-700 text-slate-300 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                {appointment.type}
              </span>
            </div>

            {/* ADOPTANTE Y CONTACTO */}
            <div className="space-y-3">
              <h5 className="font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700/50 pb-2">Información del Adoptante</h5>
              <div className="grid grid-cols-1 gap-3 mt-3">
                <div className="flex items-center gap-4 bg-slate-800/40 p-3 rounded-2xl border border-slate-700 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400"><User size={18}/></div>
                  <p className="font-bold text-slate-200 text-sm">{appointment.adopter}</p>
                </div>
                
                {appointment.phone && (
                  <div className="flex items-center gap-4 bg-slate-800/40 p-3 rounded-2xl border border-slate-700 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400"><Phone size={18}/></div>
                    <p className="font-bold text-slate-200 text-sm">{appointment.phone}</p>
                  </div>
                )}
              </div>
            </div>

            {/* HORARIO */}
            <div className="space-y-3">
               <h5 className="font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700/50 pb-2">Horario</h5>
               <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 shadow-sm flex flex-col gap-2">
                    <Calendar className="text-indigo-400" size={18}/>
                    <p className="text-xs font-black text-white capitalize tracking-wide">
                      {new Date(appointment.date + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                    </p>
                  </div>
                  <div className="bg-slate-800/40 p-4 rounded-2xl border border-slate-700 shadow-sm flex flex-col gap-2">
                    <Clock className="text-indigo-400" size={18}/>
                    <p className="text-xs font-black text-white tracking-wide">{appointment.time}</p>
                  </div>
               </div>
            </div>

            {/* NOTAS */}
            {appointment.notes && (
              <div className="space-y-3">
                <h5 className="font-black text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-700/50 pb-2">Notas / Comentarios</h5>
                <div className="flex items-start gap-3 bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 text-slate-300 text-sm leading-relaxed shadow-sm">
                  <AlignLeft size={16} className="text-amber-400 shrink-0 mt-0.5" />
                  <p>{appointment.notes}</p>
                </div>
              </div>
            )}

            {/* BOTONES (Solo Modificar y Eliminar) */}
            <div className="flex flex-col gap-3 pb-10 pt-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onEditClick();
                }} 
                className="w-full bg-indigo-500/10 text-indigo-400 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest border border-indigo-500/30 hover:bg-indigo-500/20 transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <Edit3 size={16} /> Modificar y Reagendar
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation(); 
                  onDeleteClick();
                }} 
                className="w-full bg-rose-500/10 text-rose-400 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest border border-rose-500/30 hover:bg-rose-500/20 transition flex items-center justify-center gap-2 active:scale-95 shadow-sm"
              >
                <X size={16} strokeWidth={3} /> Cancelar y Eliminar Cita
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>,
    document.body
  );
}