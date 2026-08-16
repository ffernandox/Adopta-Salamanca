"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Para saber en qué página estamos
import { User, Shield, Globe, Bell, Trash2, MapPin } from "lucide-react"; // Asegúrate de tener lucide-react

export default function ProfileSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Perfil", href: "/profile", icon: User },
    { name: "Seguridad", href: "/profile/security", icon: Shield },
    { name: "Direcciones", href: "/profile/directions", icon: MapPin },
    { name: "Notificaciones", href: "#", icon: Bell },
    { name: "Eliminar Cuenta", href: "#", icon: Trash2 },
  ];

  return (
    <nav className="flex flex-col gap-2 w-full">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-bold transition-all duration-200
              ${
                isActive
                  ? "bg-white border-2 border-blue-600 text-blue-600 shadow-sm" // Estilo Activo
                  : "text-gray-500 hover:bg-gray-50 border-2 border-transparent" // Estilo Inactivo
              }`}
          >
            <item.icon size={18} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}