"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, LogOut, User, Heart, FileText, ChevronDown } from "lucide-react";
import LoginModal from "@/components/LoginModal";
import DonationModal from "@/components/DonationModal";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// Foto genérica de perro (se usa si el usuario no ha subido foto)
// Ícono genérico mostrado cuando el usuario no tiene foto de perfil
const GenericAvatarIcon = ({ className = "" }: { className?: string }) => (
  <div className={`w-full h-full flex items-center justify-center bg-slate-200 ${className}`}>
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-1/2 h-1/2 text-slate-400">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7v1H4v-1z" />
    </svg>
  </div>
);

interface Perfil {
  nombre: string | null;
  apellido: string | null;
  avatar_url: string | null;
  rol: string | null;
}

export default function Navbar() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ============================================================
  // Obtener datos del perfil desde Supabase
  // ============================================================
  const fetchPerfil = async (userId: string) => {
    const { data } = await supabase
      .from("perfiles")
      .select("nombre, apellido, avatar_url, rol")
      .eq("id", userId)
      .single();
    if (data) setPerfil(data);
  };

  // ============================================================
  // Escuchar cambios de sesión en tiempo real
  // ============================================================
  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      if (data.user) fetchPerfil(data.user.id);
    });

    // Suscribirse a cambios (login / logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchPerfil(session.user.id);
      } else {
        setPerfil(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    setUser(null);
    setPerfil(null);
    router.push("/website");
  };

  const displayName = perfil?.nombre
    ? `${perfil.nombre}${perfil.apellido ? " " + perfil.apellido : ""}`
    : user?.email?.split("@")[0] ?? "Usuario";

  const avatarUrl = perfil?.avatar_url || "";

  return (
    <>
      <nav className="absolute top-0 left-0 w-full z-50 px-6 py-8 md:px-12 lg:px-24 flex items-center justify-between pointer-events-auto">

        {/* 1. LOGO */}
        <Link href="/website" className="flex flex-col items-start group">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-[#2D2A26] tracking-tight group-hover:text-[#0097E6] transition-colors">
              Adopta<span className="text-[#4CD137]">Salamanca</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-12 h-[4px] bg-[#FFD335]" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0097E6]">Guanajuato</span>
            <div className="w-12 h-[4px] bg-[#FFD335]" />
          </div>
        </Link>

        {/* 2. ENLACES */}
        <div className="hidden lg:flex items-center gap-20">
          <Link href="#inicio" className="text-sm font-semibold text-[#2D2A26] hover:text-[#7DD64C] transition-colors">Inicio</Link>
          <Link href="#centros" className="text-sm font-semibold text-[#2D2A26] hover:text-[#7DD64C] transition-colors">Centros</Link>
          <Link href="#mascotas" className="text-sm font-semibold text-[#2D2A26] hover:text-[#7DD64C] transition-colors">Mascotas</Link>
          <Link href="#historias" className="text-sm font-semibold text-[#2D2A26] hover:text-[#7DD64C] transition-colors">Historias</Link>
        </div>

        {/* 3. ACCIONES */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDonationModalOpen(true)}
            className="hidden lg:flex bg-[#7DD64C] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#0072B9] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
            Donación
          </button>

          {/* ========================================
              ESTADO: SIN SESIÓN → botón login
              ESTADO: CON SESIÓN → profile dropdown
          ======================================== */}
          {!user ? (
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hidden lg:flex bg-[#2D2A26] text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-[#0097E6] transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            >
              Iniciar Sesión
            </button>
          ) : (
            /* ---- PROFILE DROPDOWN ---- */
            <div className="hidden lg:block relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-[#7DD64C] shrink-0">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                  ) : (
                    <GenericAvatarIcon />
                  )}
                </div>
                {/* Nombre */}
                <span className="text-sm font-bold text-[#2D2A26] max-w-[120px] truncate">
                  {displayName.split(" ")[0]}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Panel del dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">

                  {/* Header del perfil */}
                  <div className="px-5 py-4 flex items-center gap-3 border-b border-gray-100">
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
                        ) : (
                          <GenericAvatarIcon />
                        )}
                      </div>
                      {/* Punto verde online */}
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#1a1a1a] text-base truncate">{displayName}</p>
                      <p className="text-sm text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>

                  {/* Grupo 1: Perfil y solicitudes */}
                  <div className="px-3 py-2">
                    <Link
                      href="/website/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <User size={20} strokeWidth={1.5} className="text-gray-500 group-hover:text-[#2D2A26] transition-colors shrink-0" />
                      <span className="text-[15px] font-medium text-gray-700 group-hover:text-[#1a1a1a] transition-colors">Ver Perfil</span>
                    </Link>

                    <Link
                      href="/website/profile/solicitudes"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <FileText size={20} strokeWidth={1.5} className="text-gray-500 group-hover:text-[#2D2A26] transition-colors shrink-0" />
                      <span className="text-[15px] font-medium text-gray-700 group-hover:text-[#1a1a1a] transition-colors">Mis Solicitudes</span>
                    </Link>

                    <Link
                      href="/website/profile/favoritos"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <Heart size={20} strokeWidth={1.5} className="text-gray-500 group-hover:text-[#2D2A26] transition-colors shrink-0" />
                      <span className="text-[15px] font-medium text-gray-700 group-hover:text-[#1a1a1a] transition-colors">Favoritos</span>
                    </Link>
                  </div>

                  {/* Grupo 2: Panel admin (solo admins) */}
                  {perfil?.rol === "admin" && (
                    <>
                      <div className="h-px bg-gray-100 mx-3" />
                      <div className="px-3 py-2">
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500 group-hover:text-[#2D2A26] transition-colors shrink-0">
                            <rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>
                          </svg>
                          <span className="text-[15px] font-medium text-gray-700 group-hover:text-[#1a1a1a] transition-colors">Panel Administrativo</span>
                        </Link>
                      </div>
                    </>
                  )}

                  {/* Separador + Logout */}
                  <div className="h-px bg-gray-100 mx-3" />
                  <div className="px-3 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl hover:bg-red-50 transition-colors group"
                    >
                      <LogOut size={20} strokeWidth={1.5} className="text-red-500 shrink-0" />
                      <span className="text-[15px] font-medium text-red-500">Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Menú móvil */}
          <button className="lg:hidden p-2 text-[#2D2A26] hover:bg-slate-200/50 rounded-full transition-colors">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <DonationModal isOpen={isDonationModalOpen} onClose={() => setIsDonationModalOpen(false)} />
    </>
  );
}