"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { 
  Search, Filter, ChevronDown, 
  MapPin, Home, Users, Dog, FileText, CheckCircle2, XCircle, Eye, X, Download, Bell, Check, ArrowDownAZ, ArrowUpAZ
} from "lucide-react";

// =========================================================================
// INTERFACES Y DATOS SIMULADOS
// =========================================================================
type UserStatus = "Aprobado" | "Pendiente" | "Rechazado" | "Incompleto";

interface UserDocument {
  id: string;
  name: string;
  type: "PDF" | "JPG" | "PNG";
  url: string;
  status: "Validado" | "Pendiente" | "Rechazado";
}

interface AdoptiveUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: UserStatus;
  avatar: string;
  address: string;
  livingSituation: string; 
  propertyType: string; 
  familyMembers: string;
  currentPets: string;
  documents: UserDocument[];
}

// Tipos para datos crudos de Supabase
interface SolicitudRaw {
  estado: string;
  datos_hogar?: Record<string, string> | null;
}
interface PerfilRaw {
  id: string;
  nombre: string | null;
  apellido: string | null;
  telefono: string | null;
  avatar_url: string | null;
  genero: string | null;
  direccion: string | null;
  solicitudes: SolicitudRaw[];
}

// =========================================================================
// COMPONENTES AUXILIARES
// =========================================================================

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const styles = {
    "Aprobado": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    "Pendiente": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "Rechazado": "bg-rose-500/20 text-rose-400 border-rose-500/30",
    "Incompleto": "bg-slate-700/50 text-slate-300 border-slate-600/50",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border shadow-sm ${styles[status]}`}>
      {status}
    </span>
  );
};

// =========================================================================
// PÁGINA PRINCIPAL DE USUARIOS
// =========================================================================
export default function UsuariosAdminPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<AdoptiveUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [viewingDoc, setViewingDoc] = useState<{doc: UserDocument, userId: string} | null>(null);
  const [toast, setToast] = useState<{show: boolean, message: string}>({show: false, message: ""});

  // Estados para los Filtros y Ordenamiento
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"none" | "name_asc" | "name_desc">("none");
  const [filterStatus, setFilterStatus] = useState<UserStatus | "Todos">("Todos");

  // Cargar usuarios desde Supabase
  useEffect(() => {
    const loadUsers = async () => {
      setLoadingUsers(true);
      const { data } = await supabase
        .from("perfiles")
        .select(`
          id, nombre, apellido, telefono, avatar_url, direccion,
          solicitudes (estado, datos_hogar)
        `)
        .eq("rol", "user");

      if (data) {
        const mapped: AdoptiveUser[] = (data as PerfilRaw[]).map((p) => {
          const sol = p.solicitudes ?? [];
          let status: UserStatus = "Incompleto";
          if (sol.some((s) => s.estado === "Aprobado"))       status = "Aprobado";
          else if (sol.some((s) => s.estado === "Pendiente")) status = "Pendiente";
          else if (sol.some((s) => s.estado === "Rechazado")) status = "Rechazado";
          else if (sol.length > 0)                            status = "Pendiente";

          return {
            id: p.id,
            name: [p.nombre, p.apellido].filter(Boolean).join(" ") || "Sin nombre",
            email: "—",
            phone: p.telefono ?? "—",
            status,
            avatar: p.avatar_url ?? `https://i.pravatar.cc/150?u=${p.id}`,
            address: p.direccion ?? "Sin dirección registrada",
            livingSituation: sol[0]?.datos_hogar?.housingType ?? "—",
            propertyType:    sol[0]?.datos_hogar?.housingOwnership ?? "—",
            familyMembers:   "—",
            currentPets:     sol[0]?.datos_hogar?.hasOtherPets === "Sí"
              ? (sol[0]?.datos_hogar?.otherPetsDetails ?? "Sí")
              : "Ninguna",
            documents: [],
          };
        });
        setUsers(mapped);
      }
      setLoadingUsers(false);
    };
    loadUsers();
  }, []);

  // Calculamos cuantos filtros activos hay para mostrar en la burbuja
  const activeFiltersCount = (sortBy !== "none" ? 1 : 0) + (filterStatus !== "Todos" ? 1 : 0);

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: "" }), 4000);
  };

  // Bloqueo de scroll global
  useEffect(() => {
    if (viewingDoc) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [viewingDoc]);

  const toggleRow = (userId: string) => {
    setExpandedUserId(prev => prev === userId ? null : userId);
  };

  // =========================================================================
  // LÓGICA DE NEGOCIO Y PROCESAMIENTO DE LISTA
  // =========================================================================

  const handleUpdateDocumentStatus = (userId: string, docId: string, newStatus: "Validado" | "Rechazado") => {
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id !== userId) return user;
      
      const updatedDocs = user.documents.map(d => d.id === docId ? { ...d, status: newStatus } : d);
      
      const allValidated = updatedDocs.every(d => d.status === "Validado");
      const anyRejected = updatedDocs.some(d => d.status === "Rechazado");
      
      let newUserStatus = user.status;
      if (allValidated && updatedDocs.length > 0) {
        newUserStatus = "Aprobado";
        showToast(`Todos los documentos validados. ${user.name} ha sido Aprobado.`);
      } else if (anyRejected) {
        newUserStatus = "Rechazado";
      } else {
        newUserStatus = "Pendiente";
      }

      return { ...user, documents: updatedDocs, status: newUserStatus };
    }));

    setViewingDoc(null);
  };

  const handleUpdateUserStatus = (userId: string, newStatus: UserStatus) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
    showToast(`El perfil ha sido marcado como ${newStatus}.`);
  };

  const handleNotifyUser = (user: AdoptiveUser) => {
    showToast(`Se envió un correo a ${user.email} solicitando la revisión de sus documentos.`);
    handleUpdateUserStatus(user.id, "Incompleto");
  };

  // Procesamiento Final de Usuarios: Busqueda -> Filtrado -> Ordenamiento
  const processedUsers = users
    .filter(user => {
      // 1. Busqueda de texto
      const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
      // 2. Filtro de Estado
      const matchesStatus = filterStatus === "Todos" ? true : user.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      // 3. Ordenamiento
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return 0; // "none" conserva el orden original
    });

  const viewingUser = viewingDoc ? users.find(u => u.id === viewingDoc.userId) : null;
  const isViewingUserApproved = viewingUser?.status === "Aprobado";

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300 relative">
      
      {/* HEADER DE LA PÁGINA */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-50">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">Adoptantes</h1>
          <p className="text-slate-400 font-medium text-sm">Gestiona usuarios y valida su documentación.</p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto relative">
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Buscar usuario o correo..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm font-medium text-white outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all shadow-sm placeholder-slate-500"
            />
          </div>

          {/* ========================================================= */}
          {/* MENU DESPLEGABLE DE FILTROS Y ORDENAMIENTO */}
          {/* ========================================================= */}
          <div className="relative">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-2 rounded-xl transition shadow-sm shrink-0 border relative ${activeFiltersCount > 0 ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              <Filter size={18} />
              
              {/* Burbuja indicadora de filtros activos */}
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.8)]">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="absolute right-0 top-full mt-2 w-64 bg-slate-900/95 backdrop-blur-2xl border border-slate-700 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col p-2"
                  >
                    {/* Seccion: Ordenamiento */}
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ordenar por</p>
                    </div>
                    <div className="flex flex-col gap-1 mb-2">
                      <button onClick={() => setSortBy("name_asc")} className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${sortBy === "name_asc" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-300 hover:bg-slate-800"}`}>
                        <span className="flex items-center gap-2"><ArrowDownAZ size={16}/> Nombre (A - Z)</span>
                        {sortBy === "name_asc" && <Check size={14} className="text-indigo-400"/>}
                      </button>
                      <button onClick={() => setSortBy("name_desc")} className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${sortBy === "name_desc" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-300 hover:bg-slate-800"}`}>
                        <span className="flex items-center gap-2"><ArrowUpAZ size={16}/> Nombre (Z - A)</span>
                        {sortBy === "name_desc" && <Check size={14} className="text-indigo-400"/>}
                      </button>
                    </div>

                    {/* Seccion: Filtrado por Estado */}
                    <div className="px-3 py-2 border-t border-b border-slate-800 mb-1">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => setFilterStatus("Todos")} className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === "Todos" ? "bg-indigo-500/20 text-indigo-400" : "text-slate-300 hover:bg-slate-800"}`}>
                        Todos los estados
                        {filterStatus === "Todos" && <Check size={14} className="text-indigo-400"/>}
                      </button>
                      
                      {(["Aprobado", "Pendiente", "Rechazado", "Incompleto"] as UserStatus[]).map((status) => (
                        <button key={status} onClick={() => setFilterStatus(status)} className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-sm font-medium transition-colors ${filterStatus === status ? "bg-indigo-500/20 text-indigo-400" : "text-slate-300 hover:bg-slate-800"}`}>
                          <div className="flex items-center gap-2">
                             {/* Mini indicador de color */}
                             <span className={`w-2 h-2 rounded-full ${status === 'Aprobado' ? 'bg-emerald-400' : status === 'Pendiente' ? 'bg-amber-400' : status === 'Rechazado' ? 'bg-rose-400' : 'bg-slate-400'}`} />
                             {status}
                          </div>
                          {filterStatus === status && <Check size={14} className="text-indigo-400"/>}
                        </button>
                      ))}
                    </div>

                    {/* Boton limpiar filtros */}
                    {activeFiltersCount > 0 && (
                      <div className="pt-2 mt-2 border-t border-slate-800">
                        <button 
                          onClick={() => { setSortBy("none"); setFilterStatus("Todos"); setIsFilterOpen(false); }}
                          className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                        >
                          Limpiar todos los filtros
                        </button>
                      </div>
                    )}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* CONTENEDOR DE LA TABLA */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-slate-700/50 flex flex-col overflow-hidden relative">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="grid grid-cols-[auto_2fr_1.5fr_1.5fr_1fr] gap-4 px-8 py-4 border-b border-slate-700/50 bg-slate-800/30 text-[10px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-10">
          <div className="w-8 flex justify-center"></div>
          <div>Nombre del Adoptante</div>
          <div>Correo Electrónico</div>
          <div>Teléfono</div>
          <div className="text-center">Estado</div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2 relative z-10">
          {loadingUsers ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
              <span className="font-medium text-sm">Cargando usuarios...</span>
            </div>
          ) : processedUsers.map((user) => {
            const isExpanded = expandedUserId === user.id;

            return (
              <div 
                key={user.id} 
                className={`flex flex-col border rounded-2xl transition-all duration-300 overflow-hidden ${isExpanded ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(79,70,229,0.15)] bg-slate-800/60' : 'border-slate-700/50 bg-slate-800/30 hover:border-slate-600 hover:bg-slate-800/50'}`}
              >
                <div 
                  onClick={() => toggleRow(user.id)}
                  className="grid grid-cols-[auto_2fr_1.5fr_1.5fr_1fr] gap-4 px-4 py-4 items-center cursor-pointer group"
                >
                  <div className="w-8 flex justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={20} />
                    </motion.div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-800 object-cover border border-slate-600" />
                    <span className="font-bold text-slate-200 text-sm group-hover:text-white transition-colors">{user.name}</span>
                  </div>

                  <div className="text-sm text-slate-400 font-medium truncate">{user.email}</div>
                  <div className="text-sm text-slate-400 font-medium">{user.phone}</div>
                  
                  <div className="flex justify-center">
                    <StatusBadge status={user.status} />
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="border-t border-slate-700/50 bg-slate-900/40 p-6 md:p-8 flex flex-col xl:flex-row gap-8">
                        
                        <div className="flex-1 space-y-6">
                          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700/50 pb-2">Perfil de Adopción</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                            <div className="flex items-start gap-3">
                              <MapPin className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="text-xs font-bold text-slate-500">Dirección</p>
                                <p className="text-sm font-semibold text-slate-300 leading-tight mt-0.5">{user.address}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Home className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="text-xs font-bold text-slate-500">Vivienda</p>
                                <p className="text-sm font-semibold text-slate-300 leading-tight mt-0.5">{user.livingSituation} <span className="opacity-70">({user.propertyType})</span></p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Users className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="text-xs font-bold text-slate-500">Familia en Casa</p>
                                <p className="text-sm font-semibold text-slate-300 leading-tight mt-0.5">{user.familyMembers}</p>
                              </div>
                            </div>

                            <div className="flex items-start gap-3">
                              <Dog className="text-indigo-400 shrink-0 mt-0.5" size={18} />
                              <div>
                                <p className="text-xs font-bold text-slate-500">Mascotas Actuales</p>
                                <p className="text-sm font-semibold text-slate-300 leading-tight mt-0.5">{user.currentPets}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="xl:w-[400px] shrink-0 space-y-6">
                          <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Documentos Oficiales</h4>
                            {user.documents.length === 0 && <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded">Sin subir</span>}
                          </div>

                          <div className="space-y-3">
                            {user.documents.length > 0 ? (
                              user.documents.map((doc) => (
                                <div key={doc.id} className={`bg-slate-800/50 border p-3 rounded-xl flex items-center justify-between shadow-sm transition-colors ${doc.status === 'Rechazado' ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-700'}`}>
                                  <div className="flex items-center gap-3 overflow-hidden">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${doc.status === 'Rechazado' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                                      <FileText size={20} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-bold text-slate-200 truncate">{doc.name}</p>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-[10px] font-black bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">{doc.type}</span>
                                        {doc.status === "Validado" && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5"><CheckCircle2 size={10}/> Validado</span>}
                                        {doc.status === "Pendiente" && <span className="text-[10px] font-bold text-amber-400 flex items-center gap-0.5"><Eye size={10}/> Revisión</span>}
                                        {doc.status === "Rechazado" && <span className="text-[10px] font-bold text-rose-400 flex items-center gap-0.5"><XCircle size={10}/> Rechazado</span>}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <button 
                                    onClick={(e) => {
                                      e.stopPropagation(); 
                                      setViewingDoc({ doc, userId: user.id });
                                    }}
                                    className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition shrink-0" 
                                    title="Abrir y Validar"
                                  >
                                    <Eye size={18} />
                                  </button>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                                <p className="text-sm font-medium text-slate-500">El usuario no ha subido documentos aún.</p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 pt-2">
                            {user.status !== "Aprobado" && (
                              <div className="flex gap-2">
                                <button onClick={() => handleUpdateUserStatus(user.id, "Rechazado")} className="flex-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition active:scale-95">
                                  Rechazar
                                </button>
                                <button 
                                  onClick={() => handleUpdateUserStatus(user.id, "Aprobado")}
                                  disabled={user.documents.length === 0}
                                  className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:bg-indigo-500 transition active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none"
                                >
                                  Aprobar Perfil
                                </button>
                              </div>
                            )}
                            
                            {user.status !== "Aprobado" && (
                              <button 
                                onClick={() => handleNotifyUser(user)}
                                className="flex items-center justify-center gap-2 w-full mt-1 bg-slate-800 text-slate-300 border border-slate-700 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-700 hover:text-white transition active:scale-95"
                              >
                                <Bell size={14} />
                                Solicitar Corrección al Usuario
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

          {!loadingUsers && processedUsers.length === 0 && (
            <div className="text-center py-20 text-slate-500 flex flex-col items-center">
              <Search size={40} className="text-slate-600 mb-4" />
              <p className="font-medium text-slate-400">No se encontraron usuarios con esos filtros.</p>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={() => { setSortBy("none"); setFilterStatus("Todos"); setSearchQuery(""); }}
                  className="mt-4 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Limpiar todos los filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* VISOR DE DOCUMENTOS */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {viewingDoc && (
            <div className="fixed inset-0 z-[90000] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setViewingDoc(null)} 
                className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
              />
              
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 20 }} 
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-4xl h-[85vh] bg-slate-900/95 backdrop-blur-2xl rounded-[2rem] shadow-[0_10px_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden border border-slate-700"
              >
                <div className="px-6 py-4 bg-slate-800/80 border-b border-slate-700 flex justify-between items-center z-10 shadow-sm shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h3 className="font-black text-white leading-tight">{viewingDoc.doc.name}</h3>
                      <p className="text-xs font-medium text-slate-400">Documento {viewingDoc.doc.type}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a href={viewingDoc.doc.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-full transition" title="Descargar">
                      <Download size={20} />
                    </a>
                    <button onClick={() => setViewingDoc(null)} className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-full transition">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full relative bg-black/40 flex items-center justify-center overflow-hidden p-4 shadow-inner">
                  {viewingDoc.doc.type === "PDF" ? (
                    <iframe 
                      src={`${viewingDoc.doc.url}#toolbar=0&navpanes=0`} 
                      className="w-full h-full rounded-xl bg-slate-800"
                      title={viewingDoc.doc.name}
                    />
                  ) : (
                    <img 
                      src={viewingDoc.doc.url} 
                      alt={viewingDoc.doc.name} 
                      className="max-w-full max-h-full object-contain rounded-xl shadow-lg"
                    />
                  )}
                </div>

                {!isViewingUserApproved && (
                  <div className="px-6 py-4 bg-slate-800/80 border-t border-slate-700 flex flex-col sm:flex-row justify-end gap-3 z-10 shrink-0">
                    
                    {viewingDoc.doc.status !== "Rechazado" && (
                      <button 
                        onClick={() => handleUpdateDocumentStatus(viewingDoc.userId, viewingDoc.doc.id, "Rechazado")}
                        className="px-6 py-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-bold rounded-xl hover:bg-rose-500/20 transition flex items-center justify-center gap-2"
                      >
                        <XCircle size={18} /> 
                        Ilegible / Rechazar
                      </button>
                    )}

                    {viewingDoc.doc.status !== "Validado" && (
                      <button 
                        onClick={() => handleUpdateDocumentStatus(viewingDoc.userId, viewingDoc.doc.id, "Validado")}
                        className="px-8 py-3 bg-emerald-600 text-white font-black rounded-xl hover:bg-emerald-500 transition shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 border border-emerald-500/50"
                      >
                        <CheckCircle2 size={18} /> 
                        Es Válido
                      </button>
                    )}
                  </div>
                )}

              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* NOTIFICACIONES TOAST */}
      {typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {toast.show && (
            <motion.div 
              initial={{ opacity: 0, y: 50, scale: 0.9 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 50, scale: 0.9 }} 
              className="fixed bottom-8 right-8 z-[100000] bg-slate-800 text-white px-6 py-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex items-center gap-3 border border-slate-700"
            >
              <Bell className="text-indigo-400" size={20} />
              <span className="text-sm font-medium">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

    </div>
  );
}