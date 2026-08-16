"use client";

import React from "react";
import { ArrowUpRight, Calendar, MoreHorizontal, PlayCircle } from "lucide-react";
import Link from "next/link";
import { ScatterChart } from '@mui/x-charts/ScatterChart';

// Eje X = Edad de la mascota (meses)
// Eje Y = Tiempo en el refugio antes de adopcion (dias)
const dbDataPerros = [
  { id: 'p1', x: 2, y: 15 }, { id: 'p2', x: 6, y: 25 }, { id: 'p3', x: 12, y: 40 },
  { id: 'p4', x: 24, y: 60 }, { id: 'p5', x: 36, y: 90 }, { id: 'p6', x: 48, y: 120 },
  { id: 'p7', x: 3, y: 10 }, { id: 'p8', x: 8, y: 30 }, { id: 'p9', x: 18, y: 50 },
  { id: 'p10', x: 15, y: 45 }, { id: 'p11', x: 28, y: 75 }, { id: 'p12', x: 40, y: 100 },
];

const dbDataGatos = [
  { id: 'g1', x: 1, y: 10 }, { id: 'g2', x: 4, y: 20 }, { id: 'g3', x: 8, y: 35 },
  { id: 'g4', x: 14, y: 45 }, { id: 'g5', x: 20, y: 55 }, { id: 'g6', x: 30, y: 80 },
  { id: 'g7', x: 2, y: 12 }, { id: 'g8', x: 5, y: 22 }, { id: 'g9', x: 10, y: 30 },
  { id: 'g10', x: 12, y: 38 }, { id: 'g11', x: 25, y: 65 }, { id: 'g12', x: 35, y: 85 },
];

const dbDataOtros = [
  { id: 'o1', x: 5, y: 15 }, { id: 'o2', x: 10, y: 25 }, { id: 'o3', x: 20, y: 40 },
  { id: 'o4', x: 15, y: 30 }, { id: 'o5', x: 8, y: 20 }, { id: 'o6', x: 30, y: 60 },
];

export default function AdminDashboard() {
  return (
    <div className="w-full max-w-[1600px] mx-auto animate-in fade-in duration-500">
      
      {/* TARJETA DE BIENVENIDA  */}
      <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2rem] mb-8 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden">
         <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>

         <div className="relative z-10">
            <h1 className="text-4xl font-light text-slate-300 mb-2">
                Hola, <span className="font-black text-white drop-shadow-sm">Albergue Salamanca!</span>
            </h1>
            <p className="text-slate-400 font-medium">Aquí tienes el resumen de hoy, 2 de Febrero.</p>
         </div>
         
         <div className="flex items-center gap-3 bg-slate-800/60 backdrop-blur-md px-5 py-3 rounded-full border border-slate-600/50 shadow-inner mt-4 md:mt-0 relative z-10">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </div>
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">Sistema Operativo</span>
         </div>
      </div>

      {/* === GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[600px]">
        
        {/* COLUMNA 1: Graficas y Acciones Rapidas */}
        <div className="flex flex-col gap-6 h-full">
            
            {/* TARJETA (Grafica de Adopciones de Barras) */}
            <div className="bg-[#111827]/80 backdrop-blur-2xl border border-indigo-500/20 rounded-[2.5rem] p-6 flex-1 relative overflow-hidden group shadow-2xl flex flex-col justify-between">
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-indigo-600/10 blur-[60px] pointer-events-none"></div>

                <div className="flex justify-between items-start mb-4 relative z-10">
                    <div>
                        <h3 className="text-slate-400 text-sm font-semibold">Adopciones Completadas</h3>
                        <p className="text-4xl font-black text-white mt-1">124</p>
                    </div>
                    <select className="bg-slate-800/50 text-xs text-slate-300 border border-slate-700 rounded-lg px-2 py-1 outline-none backdrop-blur-md focus:border-indigo-500 transition-colors cursor-pointer">
                        <option>Este mes</option>
                    </select>
                </div>

                <div className="flex items-end justify-between h-32 gap-2 px-2 relative z-10 mt-auto">
                    {[40, 65, 30, 80, 55, 90, 45].map((h, i) => (
                        <div key={i} className="w-full bg-slate-800/50 rounded-t-lg relative group-hover:bg-slate-700/50 transition-colors" style={{ height: '100%' }}>
                             <div 
                                className="absolute bottom-0 w-full bg-indigo-500/80 rounded-t-lg transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.2)]" 
                                style={{ height: `${h}%`, opacity: i===5 ? 1 : 0.8 }}
                             ></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500 mt-3 px-1 relative z-10">
                    <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
                </div>
            </div>

            {/* TARJETA GRADIENTE (Accion Rapida - Registrar Mascota) */}
            <div className="bg-emerald-900/40 backdrop-blur-2xl border border-emerald-500/30 shadow-2xl rounded-[2.5rem] p-6 h-48 relative overflow-hidden text-emerald-50 shrink-0 group hover:bg-emerald-900/50 transition-all">
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-500/30 transition-colors"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                         <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400"><ArrowUpRight size={18} strokeWidth={2.5} /></div>
                         <span className="font-bold text-xs uppercase tracking-widest text-emerald-400">Acción Rápida</span>
                    </div>
                    <h3 className="text-2xl font-black leading-tight mb-4 text-white group-hover:scale-105 transition-transform origin-left">Registrar nueva<br/>mascota</h3>
                    <button className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-900/50 hover:scale-105">
                        Comenzar registro
                    </button>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 text-emerald-300 rotate-12 pointer-events-none">
                     <svg width="150" height="150" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-4-8-8s4-8 8-8 8 4 8 8-4.41 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
                </div>
            </div>

        </div>

        {/* COLUMNA 2 y 3: Lista de Solicitudes  */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-[2.5rem] p-8 text-slate-200 flex flex-col h-full relative overflow-hidden">
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">Solicitudes Recientes</h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Gestión de adoptantes pendientes</p>
                </div>
                <Link href="/admin/solicitudes" className="flex items-center gap-1 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition group">
                Ver todas 
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                </Link>
            </div>

            <div className="overflow-auto flex-1 custom-scrollbar relative z-10">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-500 text-xs border-b border-slate-700/50">
                            <th className="pb-4 font-black uppercase tracking-wider pl-2">Solicitante</th>
                            <th className="pb-4 font-black uppercase tracking-wider">Mascota</th>
                            <th className="pb-4 font-black uppercase tracking-wider">Estatus</th>
                            <th className="pb-4 font-black uppercase tracking-wider">Fecha Cita</th>
                            <th className="pb-4 font-black uppercase tracking-wider text-right pr-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {[1, 2, 3, 4, 5].map((item, idx) => (
                            <tr key={idx} className="group hover:bg-slate-800/40 transition-colors border-b border-slate-800/50 last:border-0">
                                <td className="py-4 pl-2">
                                    <div className="flex items-center gap-3">
                                        <img src={`https://i.pravatar.cc/150?img=${10 + idx}`} alt="User" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-700 shadow-sm" />
                                        <div>
                                            <p className="font-bold text-slate-200 group-hover:text-white transition-colors">Carlos Pérez</p>
                                            <p className="text-xs font-semibold text-emerald-400">INE Validada</p>
                                        </div>
                                    </div>
                                </td>
                                
                                <td className="py-4 font-bold text-slate-300">Max (Labrador)</td>
                                
                                <td className="py-4">
                                    <span className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shadow-sm border
                                        ${idx === 1 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 
                                          idx === 3 ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' : 
                                          'bg-amber-500/20 text-amber-400 border-amber-500/30'}`}>
                                        {idx === 1 ? 'Aprobado' : idx === 3 ? 'Rechazado' : 'Revisión'}
                                    </span>
                                </td>

                                <td className="py-4 font-medium text-slate-400">12 Feb, 10:00 AM</td>

                                <td className="py-4 text-right pr-2">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center hover:scale-110 hover:bg-indigo-400 transition shadow-[0_0_10px_rgba(99,102,241,0.4)]">
                                            <PlayCircle size={14} fill="white" />
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center hover:bg-slate-700 hover:text-white transition shadow-sm">
                                            <MoreHorizontal size={14} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* SECCION INFERIOR*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          
          {/* TARJETA DE PROXIMAS VISITAS */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-[2.5rem] p-6 flex flex-col justify-center relative overflow-hidden group min-h-[360px]">
              <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white tracking-tight">Próximas Visitas</h3>
                  <p className="text-slate-400 font-medium text-sm mt-1 mb-6">Tienes 4 visitas programadas para hoy.</p>
                  <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                          <img key={i} src={`https://i.pravatar.cc/150?img=${20+i}`} className="w-10 h-10 rounded-full border-2 border-slate-800 shadow-sm" />
                      ))}
                      <div className="w-10 h-10 rounded-full bg-slate-800/80 backdrop-blur flex items-center justify-center text-xs font-bold text-white border-2 border-slate-700 shadow-sm">+2</div>
                  </div>
              </div>
              <Calendar className="absolute right-[-10px] bottom-[-20px] text-slate-700/30 w-56 h-56 rotate-[-15deg] group-hover:rotate-0 group-hover:text-indigo-500/10 transition-all duration-700 pointer-events-none" />
          </div>

          {/* TARJETA DE TASA DE ADOPCION */}
          <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-700/50 shadow-2xl rounded-[2.5rem] p-6 flex flex-col relative overflow-hidden min-h-[360px]">
               <div className="flex justify-between items-start mb-2 relative z-10">
                  <div>
                      <h3 className="text-2xl font-black text-white tracking-tight leading-none">Análisis</h3>
                      <p className="text-slate-400 font-medium text-sm mt-1">Edad vs Días de espera en refugio</p>
                  </div>
                  <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 px-2 py-1 rounded-md text-[10px] font-bold shadow-sm uppercase tracking-widest">
                      Tendencia
                  </span>
               </div>
               
               {/* Contenedor del grafico*/}
               <div className="flex-1 w-full mt-2 -ml-2 relative z-10">
                  <ScatterChart
                    series={[
                      {
                        type: 'scatter',
                        label: 'Perros',
                        data: dbDataPerros,
                        color: '#6366f1', 
                      },
                      {
                        type: 'scatter',
                        label: 'Gatos',
                        data: dbDataGatos,
                        color: '#f59e0b', 
                      },
                      {
                        type: 'scatter',
                        label: 'Otros',
                        data: dbDataOtros,
                        color: '#10b981', 
                      },
                    ]}
                    xAxis={[{ min: 0, max: 55 }]} 
                    yAxis={[{ min: 0, max: 130 }]} 
                    grid={{ horizontal: true, vertical: true }} 
                    margin={{ top: 40, bottom: 20, left: 30, right: 10 }}
                    slotProps={{
                      legend: {
                        position: { vertical: 'top', horizontal: 'center' },
                      }
                    }}
                    sx={{
                      '.MuiChartsGrid-line': { stroke: '#334155', strokeWidth: 0.5, strokeDasharray: '4 4' }, 
                      '.MuiChartsAxis-line': { stroke: '#475569' }, 
                      '.MuiChartsAxis-tick': { stroke: '#475569' },
                      '.MuiChartsAxis-tickLabel': { fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }, 
                      '.MuiScatter-root': { cursor: 'crosshair', filter: 'drop-shadow(0px 0px 4px rgba(255,255,255,0.2))' },
                      '.MuiChartsLegend-series text': { 
                        fontSize: '12px !important', 
                        fontWeight: 'bold !important', 
                        fill: '#cbd5e1 !important' 
                      }
                    }}
                  />
               </div>
          </div>

      </div>

    </div>
  );
}