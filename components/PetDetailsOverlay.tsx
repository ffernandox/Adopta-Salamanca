"use client";

import React, { useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X } from "lucide-react";
import Link from "next/link";

// =========================================================================
// INTERFAZ
// =========================================================================
interface PetData {
  id: number;
  nombre: string;
  raza: string;
  edad: string;
  vacunas: string;
  esterilizado: boolean;
  img: string;
  centro: string;
  descripcion?: string;
  fotos_urls?: string[] | null;  // ← fotos adicionales reales
}

interface PetDetailsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetData | null;
}

// Placeholders para completar hasta 5 si faltan fotos
const PLACEHOLDER_IMGS = [
  "https://images.unsplash.com/photo-1552053831-71594a27632d?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1591160690555-5debfba289f0?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=900&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=900&auto=format&fit=crop",
];

export default function PetDetailsOverlay({ isOpen, onClose, pet }: PetDetailsOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const textStickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const wordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  useGSAP(
    () => {
      if (!isOpen || !containerRef.current) return;
      gsap.registerPlugin(ScrollTrigger);
      const scroller = containerRef.current;
      const wordElements = wordRefs.current.filter(Boolean);

      if (wordElements.length > 0 && galleryRef.current) {
        gsap.set(wordElements, { opacity: 0.15 });
        gsap.to(wordElements, {
          opacity: 1,
          ease: "none",
          stagger: { amount: 1 },
          scrollTrigger: {
            scroller,
            trigger: galleryRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.8,
          },
        });
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const isLast = i === 4; // siempre 5 fotos (0-4)
        if (!isLast) {
          gsap.to(card, {
            scale: 0.85,
            filter: "brightness(0.5)",
            ease: "none",
            scrollTrigger: {
              scroller,
              trigger: card,
              start: "top top",
              end: `+=${card.offsetHeight}`,
              scrub: true,
            },
          });
        }
      });

      return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
    },
    { dependencies: [isOpen], scope: containerRef }
  );

  if (!isOpen || !pet) return null;

  // ── Construir galería de 5 fotos ──────────────────────────────
  // 1) foto principal, 2-5) fotos_urls reales o placeholders
  const mainImg = pet.img || PLACEHOLDER_IMGS[0];
  const extras  = pet.fotos_urls?.filter(Boolean) ?? [];

  // Rellenar hasta tener 5 fotos totales (incluyendo la principal)
  const gallery: string[] = [mainImg];
  for (let i = 0; gallery.length < 5; i++) {
    gallery.push(extras[i] ?? PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length]);
  }

  // ── Texto animado ─────────────────────────────────────────────
  const textContent = pet.descripcion
    ? pet.descripcion
    : `¡Hola! Soy ${pet.nombre}, un ${pet.raza} de ${pet.edad}. Estoy buscando una familia amorosa. ${pet.esterilizado ? "Ya estoy esterilizado y" : ""} cuento con mis vacunas: ${pet.vacunas}. Me encuentro en ${pet.centro}. ¡Anímate a conocerme!`;
  const wordsArray = textContent.split(" ");

  return createPortal(
    <>
      {/* ── Fondo ── */}
      <div className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.pexels.com/photos/125457/pexels-photo-125457.jpeg"
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover scale-105 opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/0" />
      </div>

      {/* ── Logo ── */}
      <div className="fixed top-6 left-6 lg:left-16 z-[100000]">
        <Link href="/" onClick={onClose} className="flex flex-col items-start group drop-shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="text-2xl font-black text-white tracking-tight group-hover:text-[#0097E6] transition-colors">
              Adopta<span className="text-[#4CD137]">Salamanca</span>
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 opacity-90">
            <div className="w-12 h-[4px] bg-[#FFD335]"></div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#0097E6] drop-shadow-sm">Guanajuato</span>
            <div className="w-12 h-[4px] bg-[#FFD335]"></div>
          </div>
        </Link>
      </div>

      {/* ── Botón cerrar ── */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[100000] p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all backdrop-blur-md border border-white/10 shadow-xl"
      >
        <X size={24} />
      </button>

      {/* ── Scroll container ── */}
      <div
        ref={containerRef}
        className="fixed inset-0 z-[9999] overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
      >
        <div className="flex flex-col lg:flex-row w-full min-h-screen relative z-10 pt-20 lg:pt-0">

          {/* ── Panel izquierdo: texto sticky ── */}
          <div className="hidden lg:flex w-1/2 sticky top-0 h-screen items-center justify-start pl-16 pr-8 z-10">
            <div ref={textStickyRef} className="flex flex-col gap-8">
              <h2 className="text-5xl xl:text-7xl font-black text-white tracking-tighter drop-shadow-md">
                {pet.nombre}
              </h2>
              <div className="flex flex-wrap gap-x-2 gap-y-2 text-2xl xl:text-3xl font-bold text-white leading-tight">
                {wordsArray.map((word, index) => (
                  <span
                    key={index}
                    ref={(el) => { if (el) wordRefs.current[index] = el; }}
                    className="opacity-15 inline-block drop-shadow-sm"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Panel derecho: galería de fotos ── */}
          <div
            ref={galleryRef}
            className="w-full lg:w-1/2 flex flex-col items-center gap-[10vh] py-[10vh] px-6 lg:px-10"
          >
            {/* Título mobile */}
            <div className="lg:hidden w-full pt-16 z-10">
              <h2 className="text-4xl font-black text-indigo-400 tracking-tighter mb-4 drop-shadow-md">
                {pet.nombre}
              </h2>
              <div className="flex flex-wrap gap-x-2 gap-y-1 text-lg font-semibold text-white leading-snug">
                {wordsArray.map((word, index) => (
                  <span key={`m-${index}`} className="inline-block opacity-60 drop-shadow-sm">{word}</span>
                ))}
              </div>
            </div>

            {/* Las 5 fotos con stack scroll */}
            {gallery.map((imgUrl, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="sticky top-[5vh] w-full max-w-sm sm:max-w-md md:max-w-lg"
                style={{ zIndex: i + 1 }}
              >
                {/* Contenedor con fondo blur para fotos que no llenan */}
                <div
                  className="relative w-full rounded-[2.5rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                  style={{ height: "70vh" }}
                >
                  {/* Fondo borroso del mismo color de la foto */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl opacity-60"
                    aria-hidden="true"
                  />
                  {/* Foto real centrada sin recortar */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imgUrl}
                    alt={`${pet.nombre} vista ${i + 1}`}
                    className="relative z-10 w-full h-full object-contain"
                    style={{ transformOrigin: "top center" }}
                  />
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>,
    document.body
  );
}