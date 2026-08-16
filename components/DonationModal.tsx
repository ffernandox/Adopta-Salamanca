"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { X, Heart, CreditCard, Banknote, Landmark, Check, Home, Instagram, Facebook, Twitter, Youtube } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================
// TIPOS DE ETAPA DEL FLUJO
// "form" → "loading" → "confetti" → "thankyou"
// ============================================================
type Stage = "form" | "loading" | "confetti" | "thankyou";

// ============================================================
// COMPONENTE LOADER (estilo KokonutUI)
// ============================================================
function KokonutLoader() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Spinner con anillos */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-rose-100" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-rose-500 animate-spin" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-t-pink-400 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <Heart size={20} className="text-rose-500 fill-rose-500 animate-pulse" />
        </div>
      </div>

      {/* Texto animado */}
      <div className="text-center">
        <p className="text-white font-black text-xl tracking-tight">Procesando donación...</p>
        <p className="text-white/60 text-sm font-medium mt-1">Por favor espera un momento</p>
      </div>

      {/* Barra de progreso */}
      <div className="w-64 h-1.5 bg-white/20 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}

// ============================================================
// DATOS DEL CONFETI — explosión desde el centro
// ============================================================
const COLORS = ["#f43f5e", "#ec4899", "#a855f7", "#3b82f6", "#22c55e", "#f59e0b", "#FFD335", "#7DD64C", "#fff", "#fb923c"];

const CONFETTI_PIECES = Array.from({ length: 120 }, (_, i) => {
  const angle = (i / 120) * 360; // distribuir en círculo completo
  const angleRad = (angle * Math.PI) / 180;
  const speed = 300 + (i * 7.3) % 500;       // distancia de expansión
  const dx = Math.cos(angleRad) * speed;      // dirección X
  const dy = Math.sin(angleRad) * speed;      // dirección Y
  return {
    id: i,
    color: COLORS[i % COLORS.length],
    dx,
    dy,
    delay: (i * 0.004) % 0.3,               // casi todas salen a la vez
    duration: 1.2 + (i * 0.011) % 1.0,
    size: 5 + (i * 0.19) % 12,
    rotate: (i * 11.3) % 720,
    isRect: i % 3 !== 0,
    opacity: 0.85 + (i % 3) * 0.05,
  };
});

// ============================================================
// COMPONENTE CONFETI — explosión desde el centro
// ============================================================
function Confetti() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[7100] overflow-hidden">
      {CONFETTI_PIECES.map((p) => (
        <motion.div
          key={p.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: p.isRect ? p.size * 1.6 : p.size,
            height: p.isRect ? p.size * 0.6 : p.size,
            backgroundColor: p.color,
            borderRadius: p.isRect ? 2 : "50%",
            originX: "center",
            originY: "center",
          }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
          animate={{
            x: p.dx,
            y: p.dy,
            opacity: [1, 1, 0.8, 0],
            scale: [0, 1.2, 1, 0.8],
            rotate: p.rotate,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.2, 0.8, 0.4, 1],
          }}
        />
      ))}
    </div>
  );
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isMonthly, setIsMonthly] = useState(false);
  const [stage, setStage] = useState<Stage>("form");
  const [shake, setShake] = useState(false);

  const amounts = [50, 100, 200, 500, 1000, 2000];

  // Resetear estado al cerrar
  const handleClose = () => {
    onClose();
    setTimeout(() => setStage("form"), 500);
  };

  // Bloqueo de scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  const handleDonate = () => {
    setStage("loading");

    setTimeout(() => setShake(true), 100);
    setTimeout(() => setShake(false), 800);

    setTimeout(() => {
      setStage("confetti");

      setTimeout(() => {
        setStage("thankyou");
      }, 2500);
    }, 2800);
  };

  if (!isOpen) return null;

  return createPortal(
    <>

      <AnimatePresence>
        {stage === "form" && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[6000] bg-slate-900/60 backdrop-blur-sm"
              onClick={handleClose}
            />
            <div className="fixed inset-0 z-[6001] flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto border border-white/20"
              >
                {/* HEADER */}
                <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-rose-500 font-black text-xl">
                      <Heart className="fill-current" size={24} />
                      <span>Hacer una Donación</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Tu aporte ayuda a salvar vidas 🐾</p>
                  </div>
                  <button onClick={handleClose} className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition">
                    <X size={20} />
                  </button>
                </div>

                {/* CONTENT */}
                <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                  {/* Monto */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Selecciona el monto</label>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      {amounts.map((amount) => (
                        <button key={amount} onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                          className={`py-2.5 px-3 rounded-xl font-bold text-sm transition-all border-2 ${selectedAmount === amount ? "border-rose-500 bg-rose-50 text-rose-600 shadow-sm" : "border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100"}`}>
                          ${amount}
                        </button>
                      ))}
                    </div>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                      <input type="number" placeholder="Otra cantidad" value={customAmount}
                        onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                        className="w-full bg-white border-2 border-gray-100 rounded-xl pl-8 pr-12 py-3 text-sm font-bold text-gray-800 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-50 transition placeholder:font-normal" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">MXN</span>
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Método de Pago</label>
                    <div className="space-y-3">
                      {[
                        { id: "card", label: "Tarjeta de Débito / Crédito", icon: CreditCard },
                        { id: "transfer", label: "Transferencia SPEI", icon: Landmark },
                        { id: "paypal", label: "PayPal / MercadoPago", icon: Banknote },
                      ].map((method) => (
                        <div key={method.id} onClick={() => setPaymentMethod(method.id)}
                          className={`flex items-center gap-4 p-3.5 rounded-xl border-2 cursor-pointer transition-all group ${paymentMethod === method.id ? "border-rose-500 bg-white shadow-md shadow-rose-100/50" : "border-gray-100 bg-white hover:border-rose-200 hover:bg-rose-50/30"}`}>
                          <div className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center shrink-0 transition-colors ${paymentMethod === method.id ? "border-rose-500" : "border-gray-300 group-hover:border-rose-300"}`}>
                            {paymentMethod === method.id && <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />}
                          </div>
                          <method.icon size={20} className={paymentMethod === method.id ? "text-rose-500" : "text-gray-400"} />
                          <span className={`text-sm font-bold ${paymentMethod === method.id ? "text-gray-900" : "text-gray-600"}`}>{method.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Datos */}
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-3">Tus Datos (Opcional)</label>
                    <div className="space-y-3">
                      <input type="text" placeholder="Nombre completo" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rose-100 outline-none transition" />
                      <input type="email" placeholder="Correo electrónico" className="w-full bg-gray-50 border-none rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-rose-100 outline-none transition" />
                    </div>
                  </div>

                  {/* Mensual */}
                  <div onClick={() => setIsMonthly(!isMonthly)}
                    className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer select-none ${isMonthly ? "bg-purple-50 border-purple-200" : "bg-white border-gray-100 hover:border-gray-200"}`}>
                    <div className={`mt-0.5 w-5 h-5 rounded border-[2px] flex items-center justify-center transition-colors shrink-0 ${isMonthly ? "bg-purple-600 border-purple-600" : "bg-white border-gray-300"}`}>
                      {isMonthly && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${isMonthly ? "text-purple-900" : "text-gray-700"}`}>Hacer esta donación mensual</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">Conviértete en un héroe recurrente. Puedes cancelar cuando quieras.</p>
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="p-6 pt-4 mt-auto bg-white border-t border-gray-100 flex gap-3 z-10">
                  <button onClick={handleClose} className="flex-1 py-3.5 rounded-xl border-2 border-gray-100 text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition">
                    Cancelar
                  </button>
                  <button onClick={handleDonate}
                    className="flex-[2] py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:from-rose-600 hover:to-pink-700 shadow-lg shadow-rose-200 transition-all transform active:scale-95 flex items-center justify-center gap-2">
                    <Heart size={18} className="fill-white/20" />
                    Donar ${customAmount || selectedAmount} MXN
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

     
      <AnimatePresence>
        {stage === "loading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[6500] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md"
          >
            <motion.div
              className="flex flex-col items-center gap-8"
              animate={shake ? {
                x: [0, -8, 8, -8, 8, -4, 4, -2, 2, 0],
                y: [0, -4, 4, -4, 4, -2, 2, 0],
              } : {}}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -20, opacity: 0.8 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-black text-lg flex items-center gap-2 shadow-2xl shadow-rose-500/40"
              >
                <Heart size={20} className="fill-white/30" />
                Donando ${customAmount || selectedAmount} MXN
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <KokonutLoader />
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

     
      <AnimatePresence>
        {stage === "confetti" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[7000] bg-slate-900/70 backdrop-blur-md"
            />

            <Confetti />

            <div className="fixed inset-0 z-[7200] flex items-center justify-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.5, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, y: -80, scale: 1.2 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="text-center"
              >
                <p className="text-white font-black text-8xl tracking-tighter drop-shadow-2xl">
                  Gracias
                </p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/70 text-xl font-medium mt-3"
                >
                  🐾 Tu generosidad cambia vidas
                </motion.p>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

    
      <AnimatePresence>
        {stage === "thankyou" && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-[7500] bg-slate-900/80 backdrop-blur-xl"
            />

            <div className="fixed inset-0 z-[7501] flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
              >
                <div className="relative w-full h-52 bg-gradient-to-br from-rose-50 to-pink-50 overflow-hidden flex items-center justify-center">
                  <img
                    src="/dog_donation.gif"
                    alt="Adopta animales"
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay degradado */}
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent" />
                </div>

                {/* Contenido */}
                <div className="p-8 text-center">
                  {/* Ícono de corazón */}
                  <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4 -mt-12 relative z-10 border-4 border-white shadow-lg">
                    <Heart size={28} className="text-rose-500 fill-rose-500" />
                  </div>

                  <h2 className="text-3xl font-black text-gray-900 tracking-tight">¡Gracias por tu donación!</h2>
                  <p className="text-gray-500 text-sm font-medium mt-3 leading-relaxed">
                    Tu generosidad hace posible que más animales encuentren un hogar lleno de amor.
                    Cada peso donado es un paso hacia un mundo más compasivo. 🐾
                  </p>

                  {/* Botones */}
                  <div className="mt-6 flex flex-col gap-3">
                    <button
                      onClick={handleClose}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-200 flex items-center justify-center gap-2"
                    >
                      <Home size={18} />
                      Regresar a la página
                    </button>
                  </div>

                  {/* Redes sociales */}
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                      Síguenos en nuestras páginas oficiales
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      {[
                        { icon: Facebook, color: "hover:bg-blue-600", label: "Facebook", href: "#" },
                        { icon: Instagram, color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500", label: "Instagram", href: "#" },
                        { icon: Twitter, color: "hover:bg-sky-500", label: "Twitter / X", href: "#" },
                        { icon: Youtube, color: "hover:bg-red-600", label: "YouTube", href: "#" },
                      ].map((social) => (
                        <a
                          key={social.label}
                          href={social.href}
                          title={social.label}
                          className={`w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:text-white transition-all ${social.color}`}
                        >
                          <social.icon size={18} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body
  );
}