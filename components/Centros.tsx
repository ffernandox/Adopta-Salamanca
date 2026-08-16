"use client";

import { useState } from "react";
import Image from "next/image";
import MapModal from "./MapModal";
import ModalCentros, { CentroData } from "./ModalCentros";
import TypewriterTitle from "@/components/ui/TypewriterTitle";

export default function Centros() {
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<CentroData | null>(null);

  const centros: CentroData[] = [
    {
      titulo: "Centro de Adopción Norte",
      desc: "Especialistas en rehabilitación canina y grandes espacios.",
      dir: "Av. Principal 123, Zona Norte",
      img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop",
      telefono: "+52 464 111 2233",
      email: "norte@adoptasalamanca.com",
      stats: { adopciones: "+120 Adopciones", capacidad: "Capacidad: 50", voluntarios: "15 Voluntarios" },
      galeria: [
         "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400",
         "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400",
         "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400"
      ]
    },
    {
      titulo: "Centro de Adopción Sur",
      desc: "Refugio tranquilo dedicado principalmente a felinos.",
      dir: "Calle Secundaria 456, Zona Sur",
      img: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=800&auto=format&fit=crop",
      telefono: "+52 464 444 5566",
      email: "sur@adoptasalamanca.com",
      stats: { adopciones: "+85 Gatos felices", capacidad: "Capacidad: 30", voluntarios: "8 Voluntarios" },
      galeria: [
         "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400",
         "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400",
         "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400"
      ]
    },
    {
      titulo: "Centro de Adopción Este",
      desc: "Refugio mixto con áreas de juego para todo tipo de mascotas.",
      dir: "Boulevard Central 789, Zona Este",
      img: "https://images.unsplash.com/photo-1535930749574-1399327ce78f?q=80&w=800&auto=format&fit=crop",
      telefono: "+52 464 777 8899",
      email: "este@adoptasalamanca.com",
      stats: { adopciones: "+200 Rescates", capacidad: "Capacidad: 80", voluntarios: "30 Voluntarios" },
      galeria: [
         "https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=400",
         "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400",
         "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=400"
      ]
    }
  ];

  return (
    <>
      <section id="centros" className="w-full py-24 px-4 flex flex-col items-center bg-white perspective-1000">
        
        <span className="bg-[#0072B9]/10 text-[#0072B9] border border-[#0072B9]/20 px-6 py-1.5 rounded-full text-xs font-black tracking-widest uppercase mb-6">
          Nuestras Sedes
        </span>
        
        <div className="text-[#0072B9] font-black text-center text-3xl md:text-5xl mb-4">
            <TypewriterTitle 
                sequences={[
                    { 
                    text: "Encuentra el Centro de Adopción Más Cercano", 
                    deleteAfter: true, 
                    pauseAfter: 2000  
                    },
                    { 
                    text: "¡Contacta a tu centro de adopción y adopta!", 
                    deleteAfter: true, 
                    pauseAfter: 2000 
                    }
                ]}
                typingSpeed={40} 
                autoLoop={true} 
            />
        </div>

        <p className="text-slate-500 text-center max-w-2xl text-lg mb-8 leading-relaxed font-medium">
          Visita nuestros centros de adopción y encuentra a tu compañero perfecto. 
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6 mb-16 bg-slate-50 px-8 py-4 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 text-slate-700 font-bold">
             <div className="w-10 h-10 rounded-full bg-[#FFD335]/20 flex items-center justify-center text-[#FFD335]">
                <svg className="w-5 h-5 drop-shadow-sm" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             </div>
             <span>3 Centros Disponibles</span>
          </div>
          <button 
            onClick={() => setIsMapOpen(true)}
            className="bg-[#0072B9] text-white px-8 py-3 rounded-full font-bold hover:bg-[#005a93] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:scale-95 w-full sm:w-auto text-sm"
          >
              Ver Mapa Interactivo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl">
          {centros.map((centro, index) => (
            <div 
              key={index} 
              className="group relative h-[500px] w-full [perspective:1000px]"
            >
              <div className="absolute inset-0 bg-white rounded-[2rem] border border-slate-100 p-6 flex flex-col
                              transition-all duration-500 ease-out
                              group-hover:[transform:rotateY(10deg)_rotateX(5deg)_scale(1.05)]
                              group-hover:shadow-2xl z-10"
              >
                <div className="relative w-full h-64 rounded-xl overflow-hidden mb-5 shadow-sm group-hover:shadow-lg transition-all duration-500 group-hover:translate-z-10">
                  <Image 
                    src={centro.img} 
                    alt={centro.titulo}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <h3 className="text-2xl font-black mb-2 text-[#0072B9] transition-transform duration-500 group-hover:translate-x-2 tracking-tight">
                  {centro.titulo}
                </h3>
                
                <div className="w-8 h-[4px] bg-[#FFD335] rounded-full mb-4 transition-all duration-500 group-hover:w-16 group-hover:translate-x-2"></div>

                <p className="text-slate-500 mb-6 transition-transform duration-500 group-hover:translate-x-2 font-medium text-sm leading-relaxed">
                  {centro.desc}
                </p>
                
                <div className="mt-auto transition-transform duration-500 group-hover:translate-z-10">
                  <button 
                    onClick={() => setSelectedCentro(centro)}
                    className="w-full bg-[#7DD64C] text-white py-4 rounded-xl font-bold hover:bg-[#6bb83f] transition-all shadow-md group-hover:shadow-xl group-hover:-translate-y-1 text-sm uppercase tracking-wider"
                  >
                      Ver Detalles
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      </section>

      <MapModal isOpen={isMapOpen} onClose={() => setIsMapOpen(false)} />
      
      <ModalCentros 
        isOpen={!!selectedCentro} 
        onClose={() => setSelectedCentro(null)} 
        centro={selectedCentro} 
      />
    </>
  );
}