"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, FileText, PawPrint, Calendar, 
  Users, Settings, LogOut, Bell, Search, 
  MessageSquare, Heart, FilePlus, Users as UsersIcon,
  User, Moon, X, Sun
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread'>('all');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // SIMULACION DE SESION DE BACKEND
  const currentUser = {
    name: "Carlos Ruiz",
    email: "carlos@refugio.com",
    role: "Administrador", 
    avatar: "https://i.pravatar.cc/150?img=11"
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'Super Admin': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Administrador': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Voluntario': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      default: return 'bg-slate-700/50 text-slate-300 border-slate-600/50';
    }
  };

  // SIMULACION DE BASE DE DATOS PARA BUSQUEDA
  const mockSearchDB = [
    { id: 1, type: "Mascota", title: "Max (Labrador)", desc: "Ingresado hace 2 días", icon: PawPrint, color: "text-amber-400", bg: "bg-amber-500/20" },
    { id: 2, type: "Mascota", title: "Luna (Gato)", desc: "En tratamiento médico", icon: PawPrint, color: "text-amber-400", bg: "bg-amber-500/20" },
    { id: 3, type: "Solicitud", title: "Carlos Pérez", desc: "Interesado en Max", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/20" },
    { id: 4, type: "Solicitud", title: "Ana García", desc: "Interesada en Kira", icon: FileText, color: "text-blue-400", bg: "bg-blue-500/20" },
    { id: 5, type: "Usuario", title: "Fernando López", desc: "Voluntario Activo", icon: User, color: "text-emerald-400", bg: "bg-emerald-500/20" },
    { id: 6, type: "Cita", title: "Entrevista de Adopción", desc: "Hoy a las 10:00 AM", icon: Calendar, color: "text-purple-400", bg: "bg-purple-500/20" },
  ];

  const searchResults = searchQuery.trim() === "" ? [] : mockSearchDB.filter(
    item => item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SIMULACION DE NOTIFICACIONES
  const notifications = [
    { id: 1, user: "Juan Pérez", avatar: "https://i.pravatar.cc/150?img=32", action: "Nueva solicitud", target: "Max", time: "1h ago", type: "comment", unread: true, text: "Revisar comprobante de domicilio." },
    { id: 2, user: "Dra. Martínez", avatar: "https://i.pravatar.cc/150?img=44", action: "Actualizó expediente", target: "Luna", time: "1h ago", type: "file", unread: true, text: "Vacunas completadas." },
    { id: 3, user: "Admin", avatar: "https://i.pravatar.cc/150?img=5", action: "Reunión", target: "Sede Norte", time: "2h ago", type: "invite", unread: true, hasActions: true },
    { id: 4, user: "Laura M.", avatar: "https://i.pravatar.cc/150?img=9", action: "Adopción de", target: "Rocky", time: "3h ago", type: "like", unread: false }
  ];

  const filteredNotifications = notifications.filter(n => {
      if (activeFilter === 'unread') return n.unread === true;
      return true;
  });

  const menuItems = [
    { icon: LayoutDashboard, route: "/admin", label: "Inicio" },
    { icon: FileText, route: "/admin/solicitudes", label: "Solicitud" },
    { icon: PawPrint, route: "/admin/mascotas", label: "Mascotas" },
    { icon: Calendar, route: "/admin/citas", label: "Citas" },
    { icon: Users, route: "/admin/usuarios", label: "Usuarios" },
    { icon: Settings, route: "/admin/ajustes", label: "Ajustes" },
  ];

  const openSearch = () => { setIsSearchOpen(true); setShowNotifications(false); setShowProfileMenu(false); };
  const openNotifs = () => { setShowNotifications(!showNotifications); setIsSearchOpen(false); setShowProfileMenu(false); };
  const openProfile = () => { setShowProfileMenu(!showProfileMenu); setIsSearchOpen(false); setShowNotifications(false); };

  return (
    // CONTENEDOR PRINCIPAL 
    <div className="min-h-screen font-sans flex overflow-hidden relative bg-[#0B1121] text-slate-200">
  
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[120px]" />
          
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/15 rounded-full blur-[140px]" />
      </div>

      <aside 
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
        className={`flex flex-col py-8 gap-8 shrink-0 z-30 shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out
          my-4 ml-4 rounded-[2.5rem] bg-slate-900/90 backdrop-blur-xl border border-slate-700/80
          ${isSidebarExpanded ? 'w-64 px-6 items-stretch' : 'w-24 px-0 items-center'}
        `}
      >
        <div className={`h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(79,70,229,0.4)] transition-all duration-300 ${isSidebarExpanded ? 'w-12 mx-auto' : 'w-12'}`}>
          A
        </div>
        
        <nav className="flex-1 flex flex-col gap-4 w-full">
          {menuItems.map((item, idx) => {
            const isActive = pathname === item.route;
            return (
              <Link 
                key={idx} 
                href={item.route}
                className={`h-12 flex items-center rounded-2xl transition-all duration-300 overflow-hidden relative
                  ${isActive 
                    ? "bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-105" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }
                  ${isSidebarExpanded ? 'px-4 justify-start w-full' : 'justify-center w-12 mx-auto'}
                `}
              >
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <AnimatePresence>
                  {isSidebarExpanded && (
                    <motion.span initial={{ opacity: 0, width: 0, marginLeft: 0 }} animate={{ opacity: 1, width: "auto", marginLeft: 16 }} exit={{ opacity: 0, width: 0, marginLeft: 0 }} className="font-bold whitespace-nowrap text-sm">
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
        
        <button className={`h-12 flex items-center rounded-2xl transition-all duration-300 overflow-hidden text-slate-400 hover:bg-red-500/10 hover:text-red-400 ${isSidebarExpanded ? 'px-4 justify-start w-full' : 'justify-center w-12 mx-auto'}`}>
          <LogOut size={20} className="shrink-0" />
          <AnimatePresence>
            {isSidebarExpanded && (
              <motion.span initial={{ opacity: 0, width: 0, marginLeft: 0 }} animate={{ opacity: 1, width: "auto", marginLeft: 16 }} exit={{ opacity: 0, width: 0, marginLeft: 0 }} className="font-bold whitespace-nowrap text-sm">
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </aside>

      {/*  CONTENIDO PRINCIPAL  */}
      <main className="flex-1 relative overflow-hidden flex flex-col z-10">
        
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-6">
            
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/80 px-6 py-3 rounded-full shadow-sm">
               <h2 className="text-slate-300 text-sm font-black uppercase tracking-widest">Panel Administrativo</h2>
            </div>
            
            <div className="flex items-center gap-3 relative">
                
                {/* BARRA DE BUSQUEDA  */}
                <motion.div 
                  initial={false}
                  animate={{ width: isSearchOpen ? 280 : 40 }}
                  className={`relative h-10 rounded-xl flex items-center shadow-sm overflow-visible transition-colors duration-300
                    ${isSearchOpen ? 'bg-slate-800 border border-slate-600' : 'bg-slate-900/50 border border-slate-700/80 hover:bg-slate-800/80'}
                  `}
                >
                  <button onClick={openSearch} className="w-10 h-10 shrink-0 flex items-center justify-center text-slate-400 hover:text-white z-10 relative">
                      <Search size={18} strokeWidth={2} />
                  </button>

                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.input
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.1 } }}
                        autoFocus
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar mascotas, solicitudes..."
                        className="absolute left-10 right-10 h-full bg-transparent border-none outline-none text-sm font-bold text-white placeholder:text-slate-500 placeholder:font-medium"
                      />
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {isSearchOpen && (
                      <motion.button 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} 
                        className="w-10 h-10 shrink-0 flex items-center justify-center text-slate-500 hover:text-red-400 transition absolute right-0 z-10"
                      >
                        <X size={16} strokeWidth={2.5} />
                      </motion.button>
                    )}
                  </AnimatePresence>

                  {/* Panel de Autocompletado */}
                  <AnimatePresence>
                    {isSearchOpen && searchQuery && (
                      <>
                        <div className="fixed inset-0 z-[9998]" onClick={() => setIsSearchOpen(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          transition={{ type: "spring", stiffness: 300, damping: 25 }} 
                          className="absolute top-14 right-0 w-[320px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700 z-[9999] p-2 overflow-hidden"
                        >
                          <div className="px-3 py-2 border-b border-slate-700/50 mb-2">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Resultados</span>
                          </div>
                          
                          <div className="max-h-[300px] overflow-y-auto custom-scrollbar flex flex-col gap-1">
                            {searchResults.length > 0 ? (
                              searchResults.map((res) => (
                                <Link key={res.id} href="#" onClick={() => setIsSearchOpen(false)} className="flex items-center gap-3 p-3 hover:bg-slate-800/80 rounded-2xl cursor-pointer transition-colors group">
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${res.bg} ${res.color} border border-white/5`}>
                                    <res.icon size={18} strokeWidth={2.5} />
                                  </div>
                                  <div className="min-w-0">
                                    <h4 className="text-sm font-bold text-slate-200 truncate group-hover:text-white transition-colors">{res.title}</h4>
                                    <p className="text-xs font-medium text-slate-500 truncate">{res.type} • {res.desc}</p>
                                  </div>
                                </Link>
                              ))
                            ) : (
                              <div className="py-8 text-center">
                                <Search size={24} className="mx-auto text-slate-600 mb-2" />
                                <p className="text-sm font-bold text-slate-500">No se encontraron resultados</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Botón Campana  */}
                <div className="relative">
                  <button 
                      onClick={openNotifs}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 relative shadow-sm
                          ${showNotifications 
                              ? 'bg-slate-800 text-white border-slate-600 border' 
                              : 'bg-slate-900/50 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-800/80'}
                      `}
                  >
                      <Bell size={18} strokeWidth={2} />
                      {!showNotifications && notifications.some(n => n.unread) && (
                          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>
                      )}
                  </button>

                  <AnimatePresence>
                    {showNotifications && (
                        <>
                            <div className="fixed inset-0 z-[9998]" onClick={() => setShowNotifications(false)} />
                            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ type: "spring", stiffness: 300, damping: 25 }} className="absolute top-14 right-0 w-[400px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden z-[9999] text-slate-200 border border-slate-700">
                                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
                                    <h3 className="font-bold text-lg text-white">Notificaciones</h3>
                                    <div className="flex bg-slate-800 border border-slate-700 rounded-full p-1 relative shadow-inner">
                                        <motion.div className="absolute top-1 bottom-1 bg-slate-700 rounded-full shadow-sm border border-slate-600" initial={false} animate={{ left: activeFilter === 'all' ? '4px' : '50%', width: activeFilter === 'all' ? '45%' : '48%' }} transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                                        <button onClick={() => setActiveFilter('all')} className={`px-4 py-1.5 rounded-full text-xs font-bold relative z-10 transition-colors ${activeFilter === 'all' ? 'text-white' : 'text-slate-400'}`}>Todos</button>
                                        <button onClick={() => setActiveFilter('unread')} className={`px-4 py-1.5 rounded-full text-xs font-bold relative z-10 transition-colors ${activeFilter === 'unread' ? 'text-white' : 'text-slate-400'}`}>No leídos</button>
                                    </div>
                                </div>
                                <div className="max-h-[400px] overflow-y-auto">
                                    {filteredNotifications.length > 0 ? (
                                        filteredNotifications.map((notif) => (
                                            <div key={notif.id} className="p-4 hover:bg-slate-800/50 transition-colors border-b border-slate-800/50 last:border-0 relative animate-in fade-in duration-300">
                                                {notif.unread && <div className="absolute top-6 right-4 w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>}
                                                <div className="flex gap-4">
                                                    <div className="relative shrink-0">
                                                        <img src={notif.avatar} alt="User" className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-800 shadow-sm" />
                                                        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 text-white text-[10px]
                                                            ${notif.type === 'comment' ? 'bg-indigo-500' : 
                                                              notif.type === 'like' ? 'bg-pink-500' : 
                                                              notif.type === 'invite' ? 'bg-teal-500' : 'bg-amber-500'
                                                            }`}>
                                                            {notif.type === 'comment' && <MessageSquare size={10} fill="white"/>}
                                                            {notif.type === 'like' && <Heart size={10} fill="white"/>}
                                                            {notif.type === 'invite' && <UsersIcon size={10} />}
                                                            {notif.type === 'file' && <FilePlus size={10} />}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm text-slate-300"><span className="font-bold text-white">{notif.user}</span> <span className="text-slate-500 text-xs ml-1">{notif.time}</span></p>
                                                        <p className="text-sm text-slate-400 mt-0.5 leading-snug">{notif.action} <span className="font-bold text-indigo-400">{notif.target}</span></p>
                                                        {notif.text && <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50">{notif.text}</p>}
                                                        {notif.hasActions && (
                                                            <div className="flex gap-2 mt-3">
                                                                <button className="flex-1 py-1.5 rounded-xl border border-slate-600 bg-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition shadow-sm">Rechazar</button>
                                                                <button className="flex-1 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-900/50">Aceptar</button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-8 text-center text-slate-500 text-sm font-medium">No hay notificaciones.</div>
                                    )}
                                </div>
                            </motion.div>
                        </>
                    )}
                  </AnimatePresence>
                </div>

                {/* Perfil */}
                <div className="relative">
                  <div 
                    onClick={openProfile}
                    className={`w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-all ml-1 ring-2 shadow-sm relative
                      ${showProfileMenu ? 'ring-indigo-500 scale-105 shadow-[0_0_10px_rgba(79,70,229,0.3)]' : 'ring-slate-700 hover:ring-slate-500'}
                    `}
                  >
                      <img src={currentUser.avatar} alt="Admin" className="w-full h-full object-cover" />
                  </div>

                  <AnimatePresence>
                    {showProfileMenu && (
                      <>
                        <div className="fixed inset-0 z-[9998]" onClick={() => setShowProfileMenu(false)} />
                        <motion.div 
                          initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                          animate={{ opacity: 1, y: 0, scale: 1 }} 
                          exit={{ opacity: 0, y: 10, scale: 0.95 }} 
                          transition={{ type: "spring", stiffness: 300, damping: 25 }} 
                          className="absolute top-14 right-0 w-[280px] bg-slate-900/95 backdrop-blur-2xl rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700 z-[9999] p-2"
                        >
                          <div className="flex items-center gap-3 p-3 bg-slate-800/80 rounded-[1.25rem] mb-2 border border-slate-700 shadow-inner">
                            <div className="relative shrink-0">
                              <img src={currentUser.avatar} className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-600" alt="Profile" />
                              <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-800 rounded-full"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className="text-sm font-bold text-white truncate pr-2">{currentUser.name}</h4>
                              </div>
                              <div className="flex items-center mt-1">
                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${getRoleBadgeStyle(currentUser.role)} shrink-0`}>
                                  {currentUser.role}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1">
                            <Link href="/admin/ajustes" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-2xl cursor-pointer transition-colors text-slate-300 hover:text-white font-medium text-sm group">
                              <User size={18} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                              Ajustes de cuenta
                            </Link>

                            <Link href="/admin/ajustes" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 p-3 hover:bg-slate-800 rounded-2xl cursor-pointer transition-colors text-slate-300 hover:text-white font-medium text-sm group">
                              <Settings size={18} className="text-slate-500 group-hover:text-slate-300 transition-colors" />
                              Preferencias
                            </Link>

                            {/* Toggle Visual del Modo Oscuro */}
                            <div className="flex items-center justify-between p-3 hover:bg-slate-800 rounded-2xl cursor-pointer transition-colors group" onClick={() => setIsDarkMode(!isDarkMode)}>
                              <div className="flex items-center gap-3 text-slate-300 group-hover:text-white font-medium text-sm">
                                {isDarkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-400" />}
                                {isDarkMode ? "Modo Oscuro" : "Modo Claro"}
                              </div>
                              <button className={`relative w-11 h-6 rounded-full transition-colors focus:outline-none shadow-inner border border-slate-700 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                                <motion.div animate={{ x: isDarkMode ? 20 : 2 }} className="absolute top-[1px] w-5 h-5 bg-white rounded-full shadow-sm" />
                              </button>
                            </div>

                            <div className="h-[1px] bg-slate-800/80 my-1 mx-2" />

                            <Link href="/website" className="flex items-center gap-3 p-3 hover:bg-red-500/10 rounded-2xl cursor-pointer transition-colors text-slate-400 hover:text-red-400 font-medium text-sm group">
                              <LogOut size={18} className="text-slate-500 group-hover:text-red-400 transition-colors" />
                              Cerrar sesión
                            </Link>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>

            </div>
        </header>

        {/* Contenido Scrollable */}
        <div className="px-8 pb-8 pt-2 overflow-y-auto h-full custom-scrollbar">
            {children}
        </div>
      </main>
    </div>
  );
}