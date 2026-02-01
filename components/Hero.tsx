"use client"; 

import { useState } from "react"; 
import Image from "next/image";
import DonationModal from "./DonationModal"; 

export default function Hero() {
  const [isDonationOpen, setIsDonationOpen] = useState(false);
  
  return (
    <section id="inicio" className="flex flex-col items-center justify-center py-48 px-4 text-center">
      
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
        
          <span className="text-6xl md:text-9xl font-bold tracking-tighter text-black">Salva</span>
          
          <div className="relative overflow-hidden rounded-full shadow-2xl">
            <Image 
              src="https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=600&auto=format&fit=crop"
              alt="Perro feliz"
              width={300}
              height={150}
              className="object-cover h-32 w-64 md:h-40 md:w-80"
            />
          </div>
          
          <span className="text-6xl md:text-9xl font-bold tracking-tighter text-black">un</span>
      </div>

      <h1 className="text-8xl md:text-9xl font-bold mt-2 tracking-tighter text-black">
        Corazón
      </h1>

      <div className="mt-12 flex gap-4">
        
        <button 
          onClick={() => setIsDonationOpen(true)}
          className="bg-black text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-800 transition"
        >
            Donar
        </button>

        <button className="bg-white border border-gray-200 text-black px-8 py-3 rounded-full text-lg font-medium hover:bg-gray-50 transition">
            Adoptar ♡
        </button>
      </div>

      <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />

    </section>
  );
}