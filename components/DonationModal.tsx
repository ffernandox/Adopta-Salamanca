"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DonationModal({ isOpen, onClose }: DonationModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isMonthly, setIsMonthly] = useState(false);

  // Montos
  const amounts = [50, 100, 200, 500, 1000, 2000];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[6000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* --- HEADER --- */}
            <div className="p-6 pb-2 flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-red-500 font-bold text-lg">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <span>Hacer una Donación</span>
                </div>
                <p className="text-gray-500 text-sm">Tu donación ayuda a salvar vidas</p>
              </div>
              <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* --- SCROLLABLE --- */}
            <div className="p-6 pt-2 overflow-y-auto space-y-6">
              
              {/* 1. CANTIDAD DE DONACIÓN */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Cantidad de Donación</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {amounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                      className={`py-2 px-3 rounded-xl border font-medium text-sm transition-all
                        ${selectedAmount === amount 
                          ? "border-black bg-black text-white shadow-md" 
                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-400"}`}
                    >
                      ${amount}
                    </button>
                  ))}
                </div>
                {/* Input a Otra Cantidad */}
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Otra Cantidad"
                    value={customAmount}
                    onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition"
                  />
                  <span className="absolute right-4 top-3 text-gray-400 text-sm font-medium">MXN</span>
                </div>
              </div>

              {/* 2. MÉTODO DE PAGO */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Método de Pago</label>
                <div className="space-y-3">
                  
                  {/* Opción Tarjeta */}
                  <div 
                    onClick={() => setPaymentMethod("card")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "card" ? "border-black bg-gray-50" : "border-gray-200"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "card" ? "border-black" : "border-gray-300"}`}>
                      {paymentMethod === "card" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                    <span className="text-sm font-medium">Tarjeta</span>
                  </div>

                  {/* Opción Transferencia */}
                  <div 
                    onClick={() => setPaymentMethod("transfer")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "transfer" ? "border-black bg-gray-50" : "border-gray-200"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "transfer" ? "border-black" : "border-gray-300"}`}>
                      {paymentMethod === "transfer" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                    <span className="text-sm font-medium">Transferencia</span>
                  </div>

                  {/* Opción PayPal */}
                  <div 
                    onClick={() => setPaymentMethod("paypal")}
                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${paymentMethod === "paypal" ? "border-black bg-gray-50" : "border-gray-200"}`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${paymentMethod === "paypal" ? "border-black" : "border-gray-300"}`}>
                      {paymentMethod === "paypal" && <div className="w-2.5 h-2.5 bg-black rounded-full" />}
                    </div>
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.2-2.848.578-4.13m2.585 13.065c.616-1.558.995-3.23 1.066-4.965" /></svg>
                    <span className="text-sm font-medium">PayPal / MercadoPago</span>
                  </div>
                </div>
              </div>

              {/* 3. INFO DONANTE */}
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-3">Info Donante (Opcional)</label>
                <div className="space-y-3">
                  <input type="text" placeholder="Nombre completo" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition" />
                  <input type="email" placeholder="Correo electrónico" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition" />
                </div>
              </div>

              {/* 4. DONACIÓN MENSUAL */}
              <div 
                className={`flex items-center gap-3 p-4 rounded-xl border transition-colors cursor-pointer ${isMonthly ? "bg-purple-50 border-purple-200" : "bg-gray-50 border-gray-200"}`}
                onClick={() => setIsMonthly(!isMonthly)}
              >
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isMonthly ? "bg-purple-600 border-purple-600" : "bg-white border-gray-300"}`}>
                  {isMonthly && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Donación mensual</p>
                  <p className="text-xs text-gray-500">Ayuda continua para nuestros amigos peludos</p>
                </div>
              </div>

            </div>

            {/* --- FOOTER --- */}
            <div className="p-6 pt-2 flex gap-3 mt-auto bg-white border-t border-gray-100">
              <button 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button className="flex-1 py-3 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-200 transition transform active:scale-95">
                Donar Ahora
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}