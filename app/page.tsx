import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Sponsors from "@/components/Sponsors";
import Centros from "@/components/Centros";
import Mascotas from "@/components/Mascotas"; // 
import HistoriasExito from "@/components/HistoriasExito";
import Footer from "@/components/Footer";
// Borramos la importación de GaleriaCentros porque ya no será una sección aparte

export default function Home() {
  return (
    <main className="relative isolate min-h-screen bg-white overflow-hidden flex flex-col">

      {/* --- INICIO DEL FONDO --- */}
      <div className="absolute top-0 left-0 -z-10 transform-gpu overflow-hidden blur-[120px]" aria-hidden="true">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      <div className="absolute top-0 right-0 -z-10 transform-gpu overflow-hidden blur-[120px]" aria-hidden="true">
         <div className="relative right-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#80caff] to-[#4f46e5] opacity-30 sm:right-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>
      {/* --- FIN DEL FONDO --- */}

      <div className="relative z-10 flex flex-col items-center w-full">
        <Navbar />
        <Hero />
        
        <div className="w-full -mt-20 mb-20">
            <Sponsors />
        </div>

        {/* Solo dejamos Centros, que ahora manejará todo */}
        <Centros />
        <Mascotas />
        <HistoriasExito />
        <Footer />

      </div>
    </main>
  );
}