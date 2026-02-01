export default function Sponsors() {
  return (
    <div className="w-full px-8 py-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
      
      {/* IZQUIERDA: Lista de Patrocinadores */}
      <div className="flex flex-wrap items-center gap-8">
        
        {/* Etiqueta "Apoyamos" */}
        <div className="flex items-center gap-2 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
          <span>Apoyamos</span>
        </div>

        {/* Separador vertical pequeño */}
        <div className="hidden md:block w-px h-4 bg-gray-300"></div>

        {/* Logo 1: PawsFoundation (Naranja) */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="font-semibold text-gray-800">PawsFoundation</span>
        </div>

        {/* Logo 2: AnimalRescue (Verde) */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="font-semibold text-gray-800">AnimalRescue</span>
        </div>

        {/* Logo 3: PetCareGlobal (Azul) */}
        <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <span className="font-semibold text-gray-800">PetCareGlobal</span>
        </div>
      </div>

      {/* DERECHA: Scroll Down */}
      <div className="flex items-center gap-2 animate-bounce cursor-pointer">
        <span className="text-xs font-bold tracking-widest text-gray-500">SCROLL DOWN</span>
        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </div>

       {/* Botón Flotante de Ayuda (?) */}
       <div className="fixed bottom-8 right-8 z-50">
            <button className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition">
                <span className="font-bold text-xl">?</span>
            </button>
       </div>

    </div>
  );
}