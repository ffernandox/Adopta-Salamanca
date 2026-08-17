"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Shield, MapPin, Bell,
  LogOut, Search, Settings, FileText, Heart, ArrowLeft, Menu, Home
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

  //  Datos reales del usuario 
  const [currentUser, setCurrentUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace("/"); return; }

      const { data: perfil } = await supabase
        .from("perfiles")
        .select("nombre, apellido, avatar_url")
        .eq("id", session.user.id)
        .single();

      setCurrentUser({
        name: perfil?.nombre
          ? `${perfil.nombre}${perfil.apellido ? " " + perfil.apellido : ""}`
          : session.user.email?.split("@")[0] ?? "Usuario",
        email: session.user.email ?? "",
        avatar: perfil?.avatar_url ?? "",
      });
    };
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const menuItems = [
    { icon: User,     label: "Información",    route: "/website/profile" },
    { icon: MapPin,   label: "Direcciones",    route: "/website/profile/directions" },
    { icon: Shield,   label: "Seguridad",      route: "/website/profile/security" },
    { icon: FileText, label: "Mis Solicitudes",route: "/website/profile/solicitudes" },
    { icon: Heart,    label: "Favoritos",      route: "/website/profile/favoritos" },
  ];

  const getPageTitle = () => {
    switch (pathname) {
      case "/website/profile":              return "Ajustes de Cuenta";
      case "/website/profile/directions":  return "Mis Direcciones";
      case "/website/profile/security":    return "Seguridad";
      case "/website/profile/solicitudes": return "Mis Solicitudes";
      case "/website/profile/favoritos":   return "Favoritos";
      default:                             return "Perfil";
    }
  };

  return (
    <div className="min-h-screen h-screen bg-gradient-to-br from-[#FF9D8E] via-[#FDD3EC] to-[#F3F4F6] flex font-sans text-slate-800 overflow-hidden">

      <aside className="w-[280px] md:w-[320px] flex flex-col px-6 py-8 shrink-0">

        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm border-2 border-white shrink-0 bg-slate-200">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt="Perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-slate-400">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7v1H4v-1z" />
                </svg>
              </div>
            )}
          </div>
          <div className="overflow-hidden flex-1">
            <p className="text-xs text-slate-500 font-medium">Bienvenido,</p>
            <h3 className="text-base font-black text-slate-900 truncate">
              {currentUser.name || "Cargando..."}
            </h3>
          </div>
          <button className="p-2 bg-white/40 hover:bg-white rounded-xl transition shadow-sm text-slate-600 border border-white/50">
            <Settings size={16} />
          </button>
        </div>

        <div className="relative mb-6 px-2">
          <Search size={16} className="absolute left-6 top-3 text-[#E83C7E]" />
          <input
            type="text"
            placeholder="Buscar"
            className="w-full bg-transparent border-none rounded-2xl pl-11 pr-4 py-2.5 text-sm font-bold text-slate-800 focus:outline-none focus:bg-white/30 transition placeholder:text-slate-500"
          />
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.route;
            return (
              <Link
                key={item.route}
                href={item.route}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all font-bold text-sm group
                  ${isActive
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-600 hover:bg-white/40 hover:text-slate-900"}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={isActive ? "text-slate-900" : "text-slate-400 group-hover:text-slate-600 transition-colors"} />
                  {item.label}
                </div>
                {isActive && <Menu size={16} className="text-slate-300" />}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/website"
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-slate-600 hover:bg-white/40 hover:text-slate-900 group"
        >
          <Home size={18} className="text-slate-400 group-hover:text-slate-600 transition-colors" />
          Regresar al Inicio
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-slate-500 hover:bg-white/40 hover:text-red-500 mt-1 group"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors" />
          Cerrar Sesión
        </button>
      </aside>

      {/*  CONTENIDO  */}
      <main className="flex-1 bg-white/95 rounded-l-[2.5rem] md:rounded-l-[3rem] shadow-[-20px_0_40px_rgba(0,0,0,0.05)] flex flex-col relative overflow-hidden my-2 md:my-0">

        <header className="px-10 py-8 flex justify-between items-center z-20 border-b border-slate-50">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 transition text-slate-600">
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">{getPageTitle()}</h1>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all border
                ${showNotifications ? "bg-slate-50 border-slate-200 text-slate-900 shadow-inner" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"}`}
            >
              <Bell size={20} />
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 bg-white border border-slate-100 shadow-2xl rounded-3xl z-50 p-6"
                  >
                    <p className="font-black text-slate-800 mb-2">Notificaciones</p>
                    <p className="text-sm text-slate-400 font-medium">No tienes notificaciones nuevas.</p>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pb-12 pt-6 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
}