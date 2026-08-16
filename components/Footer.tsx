"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import ContactoModalWindows from "./ContactoModalWindows";

export default function Footer() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <>
      <footer className="w-full bg-white pt-20 pb-10 overflow-hidden relative">
        
        <div className="max-w-7xl mx-auto px-4 relative flex flex-col items-center justify-end min-h-[500px]">
          
          <h1 
            className="text-[15rem] md:text-[22rem] font-black text-gray-200 leading-none select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] tracking-tighter text-center w-full z-0 pointer-events-none"
            aria-hidden="true"
          >
            ADOPTA
          </h1>

          <div className="relative z-10 flex items-end justify-center -space-x-8 md:-space-x-16 w-full pointer-events-none mb-12">
              <div className="relative w-32 h-40 md:w-48 md:h-64 transform -rotate-3 translate-y-2">
                  <Image src="https://pngimg.com/uploads/cat/cat_PNG50525.png" alt="Gato sentado" fill className="object-contain" />
              </div>
              <div className="relative w-40 h-48 md:w-56 md:h-72 transform rotate-2 z-20">
                  <Image src="https://pngimg.com/uploads/dog/dog_PNG50348.png" alt="Perro pequeño" fill className="object-contain" />
              </div>
              <div className="relative w-60 h-72 md:w-80 md:h-96 -translate-y-4 z-30">
                  <Image src="https://pngimg.com/uploads/golden_retriever/golden_retriever_PNG39.png" alt="Golden Retriever" fill className="object-contain" />
              </div>
              <div className="relative w-36 h-44 md:w-52 md:h-68 transform -rotate-2 translate-y-1 z-20">
                  <Image src="https://pngimg.com/uploads/cat/cat_PNG50499.png" alt="Gato curioso" fill className="object-contain" />
              </div>
              <div className="relative w-32 h-40 md:w-48 md:h-60 transform rotate-3 translate-y-3">
                  <Image src="https://pngimg.com/uploads/dog/dog_PNG181.png" alt="Cachorro" fill className="object-contain" />
              </div>
          </div>

          <div className="relative z-40 mb-12">
              <Link href="#centros">
                  <button className="bg-[#7DD64C] text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-[#6bb83f] transition-all shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                      Encuentra a tu amigo hoy
                  </button>
              </Link>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-40">
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500 gap-4">
              <p>© Adopta Salamanca 2026. Con amor para los peludos.</p>
              <div className="flex gap-6 font-medium">
                  <Link href="/privacidad" className="hover:text-[#0072B9] transition-colors">Privacidad</Link>
                  <Link href="/terminos" className="hover:text-[#0072B9] transition-colors">Términos</Link>
                  <button 
                    onClick={() => setIsContactModalOpen(true)} 
                    className="hover:text-[#0072B9] transition-colors font-medium"
                  >
                    Contacto
                  </button>
              </div>
          </div>
        </div>
      </footer>

      <ContactoModalWindows 
        isOpen={isContactModalOpen} 
        onClose={() => setIsContactModalOpen(false)} 
      />
    </>
  );
}