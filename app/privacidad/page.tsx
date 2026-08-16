import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";

export default function Privacidad() {
  return (
    <main className="relative min-h-screen py-20 px-4 md:px-8 flex flex-col items-center justify-center">
      
      {/*IMAGEN DE FONDO + BLUR */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/dog-1.jpeg"
          alt="Fondo mascotas"
          fill
          className="object-cover opacity-90"
          priority
        />
        <div className="absolute inset-0 bg-slate-100/30 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto bg-white/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white/40 p-8 md:p-12">
        
        <Link href="/website" className="inline-flex items-center gap-2 text-slate-600 hover:text-[#0072B9] font-bold text-sm mb-8 transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver al inicio
        </Link>

        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 drop-shadow-sm">
          Aviso de Privacidad
        </h1>
        <p className="text-slate-700 font-bold mb-10 border-b border-slate-400/30 pb-6">
          Última actualización: Marzo 2026
        </p>

        {/* Contenido Legal */}
        <div className="space-y-8 text-slate-800 leading-relaxed text-sm md:text-base font-medium">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 drop-shadow-sm">1. Información que recopilamos</h2>
            <p>
              En Adopta Salamanca, recopilamos información personal básica (como nombre, correo electrónico y número de teléfono) únicamente cuando decides registrarte, iniciar sesión o llenar una solicitud de adopción. Esta información es esencial para conectarte con los centros de adopción correspondientes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 drop-shadow-sm">2. Uso de tu información</h2>
            <p>
              Los datos que nos proporcionas se utilizan exclusivamente para:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Facilitar el proceso de adopción entre tú y el refugio.</li>
              <li>Enviarte actualizaciones sobre el estado de tu solicitud.</li>
              <li>Mejorar la experiencia de usuario dentro de nuestra plataforma.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 drop-shadow-sm">3. Protección de datos</h2>
            <p>
              Nos tomamos muy en serio la seguridad de tu información. No vendemos, alquilamos ni compartimos tus datos personales con terceros con fines publicitarios. Tu información solo es compartida con el refugio específico al que envías una solicitud de adopción.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3 drop-shadow-sm">4. Tus derechos</h2>
            <p>
              En cualquier momento puedes solicitar la eliminación de tu cuenta y de todos los datos asociados a ella. La decisión final de adopción recae en cada refugio, nosotros actuamos únicamente como plataforma de conexión digital.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}