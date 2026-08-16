import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShieldAlert, CheckCircle2 } from "lucide-react";

export default function Terminos() {
  return (
    <main className="relative min-h-screen py-20 px-4 md:px-8 flex flex-col items-center justify-center">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/dog-1.jpeg"
          alt="Fondo mascotas"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-slate-100/30 backdrop-blur-sm"></div>
      </div>
      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 p-8 md:p-12">
        
        <Link href="/website" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0072B9] font-bold text-sm mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 drop-shadow-sm">
          Términos y Condiciones
        </h1>
        <p className="text-slate-700 font-bold mb-10 border-b border-slate-400/30 pb-6">
          Por favor, lee detenidamente nuestras reglas de uso y adopción.
        </p>

        <div className="space-y-8 text-slate-800 leading-relaxed text-sm md:text-base font-medium">
          
          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#0072B9]/10 flex items-center justify-center text-[#0072B9]">
                <ShieldAlert size={16} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 drop-shadow-sm">1. Naturaleza de la Plataforma</h2>
            </div>
            <p className="pl-11">
              Adopta Salamanca funciona exclusivamente como un directorio digital e intermediario tecnológico. No somos propietarios de los animales mostrados ni administramos físicamente los refugios. La información de cada mascota es proporcionada directamente por los centros de adopción.
            </p>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#7DD64C]/20 flex items-center justify-center text-[#7DD64C]">
                <CheckCircle2 size={16} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 drop-shadow-sm">2. Proceso de Adopción</h2>
            </div>
            <p className="pl-11">
              Enviar una solicitud a través de nuestra plataforma no garantiza la adopción. Cada centro de adopción (Sede Norte, Sur, Este, etc.) tiene el derecho absoluto e inapelable de aprobar, pausar o rechazar cualquier solicitud basándose en sus propios protocolos de bienestar animal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 pl-11 drop-shadow-sm">3. Responsabilidad del Adoptante</h2>
            <p className="pl-11">
              Al utilizar nuestra plataforma y proceder con una adopción, aceptas legal y moralmente proveer un ambiente seguro, atención veterinaria, y alimentación adecuada para la mascota. Queda estrictamente prohibido el uso de los animales para fines de lucro, guardia en aislamiento o crianza.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}