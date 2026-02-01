"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useRef } from "react";

export default function HistoriasExito() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const historias = [
    {
      category: "Adoptado hace 2 días",
      title: "La nueva vida de Rocky",
      src: "https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=800&auto=format&fit=crop",
      quote: "Ahora corre libre en la playa cada mañana."
    },
    {
      category: "Adoptado hace 1 semana",
      title: "Luna y su familia",
      src: "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=800&auto=format&fit=crop",
      quote: "No sabíamos que nos hacía falta hasta que llegó."
    },
    {
      category: "Adoptado hace 1 mes",
      title: "Benito el aventurero",
      src: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800&auto=format&fit=crop",
      quote: "Es el mejor copiloto de viajes."
    },
    {
      category: "Adoptado hace 2 meses",
      title: "Molly en casa",
      src: "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=800&auto=format&fit=crop",
      quote: "Duerme más que nosotros, es un amor."
    },
    {
      category: "Historias Felices",
      title: "Coco encontró paz",
      src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=800&auto=format&fit=crop",
      quote: "Su mirada triste desapareció el primer día."
    },
    {
      category: "Historias Felices",
      title: "Coco encontró paz",
      src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=800&auto=format&fit=crop",
      quote: "Su mirada triste desapareció el primer día."
    },
    {
      category: "Historias Felices",
      title: "Coco encontró paz",
      src: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=800&auto=format&fit=crop",
      quote: "Su mirada triste desapareció el primer día."
    },
  ];

  return (
    <section id="historias" className="w-full py-20 bg-neutral-50 overflow-hidden">
      
      {/* Encabezado de sección */}
      <div className="px-4 md:px-8 mb-10 max-w-7xl mx-auto">
        <span className="text-purple-600 font-bold tracking-wider text-sm uppercase">
          Finales Felices
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-black mt-2">
          Historias de Éxito
        </h2>
        <p className="text-gray-500 mt-4 text-lg max-w-2xl">
           Así se ven las sonrisas de quienes encontraron su hogar definitivo.
        </p>
      </div>

      {/* --- CARRUSEL ESTILO APPLE --- */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-scroll pb-10 px-4 md:px-8 gap-6 w-full snap-x snap-mandatory scroll-smooth no-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {historias.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0, transition: { duration: 0.5, delay: index * 0.1 } }}
            viewport={{ once: true }}
            className="relative flex-shrink-0 w-[280px] md:w-[380px] h-[450px] md:h-[550px] rounded-[2.5rem] overflow-hidden group snap-center cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            {/* Imagen de Fondo */}
            <div className="absolute inset-0 w-full h-full">
                <Image
                    src={card.src}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
            </div>

            {/* Contenido Arriba */}
            <div className="absolute top-0 left-0 p-8 z-20 flex flex-col items-start">
                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold mb-3 border border-white/10">
                    {card.category}
                </span>
                <h3 className="text-white text-3xl font-bold leading-tight max-w-[80%]">
                    {card.title}
                </h3>
            </div>

            {/* Cita corregida abajo */}
            <div className="absolute bottom-0 left-0 p-8 z-20 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <p className="text-gray-200 text-sm italic border-l-2 border-purple-500 pl-4">
                    &quot;{card.quote}&quot;
                </p>
            </div>

          </motion.div>
        ))}
      </div>
    </section>
  );
}