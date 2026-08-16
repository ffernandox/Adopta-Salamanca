import Image from "next/image";
export default function Sponsors() {
  return (
    <div className="w-full px-8 py-6 mt-0 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-600">
      {/* IZQUIERDA: Lista de Patrocinadores */}
      <div className="flex flex-wrap items-center gap-8">
      
        {/* Separador vertical pequeño */}
        <div className="hidden md:block w-px h-4 bg-gray-300"></div>

        {/* Logo 1: */}
        <a
          href="https://salamanca.gob.mx/"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#7DD64C] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
            Ir al sitio
          </span>

          <div className="relative w-14 h-11 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="/sponsors/salamanca.png"
              alt="Logo Gobierno de Salamanca"
              fill
              className="object-contain"
            />
          </div>

          <span className="font-semibold text-gray-800 group-hover:text-[#7DD64C] transition-colors duration-200">
            Gobierno de Salamanca
          </span>
        </a>

        {/* Logo 2: gto */}
        <a
          href="https://guanajuato.gob.mx"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex items-center gap-2 cursor-pointer transition-all"
        >
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0072B9] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-lg">
            Ir al sitio
          </span>

          <div className="relative w-14 h-11 rounded-xl overflow-hidden flex-shrink-0">
            <Image
              src="/sponsors/guanajuato.png"
              alt="Logo Gobierno de Guanajuato"
              fill
              className="object-contain"
            />
          </div>

          <span className="font-semibold text-gray-800 group-hover:text-[#0072B9] transition-colors duration-200">
            Gobierno de Guanajuato
          </span>
        </a>

      </div>

      {/* DERECHA: Scroll Down */}
      <div className="flex items-center gap-2 animate-bounce cursor-pointer">
        <span className="text-xs font-bold tracking-widest text-gray-500">
          Explorar más
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          ></path>
        </svg>
      </div>

     
    </div>
  );
}
