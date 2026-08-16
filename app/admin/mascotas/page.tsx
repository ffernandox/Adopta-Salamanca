"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, ArrowLeft, Plus, 
  Dog, Cat, AlertCircle, Building2 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CreatePetModal from "@/components/CreatePetModal"; 
import PetCard, { PetData } from "@/components/PetCard";
import { supabase } from "@/lib/supabase";

type TabCategory = 'Todos' | 'Perros' | 'Gatos' | 'Urgentes';

// =========================================================================
// COMPONENTE: SELECTOR DE CENTRO  
// =========================================================================
interface CenterPickerProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

const CenterPicker = ({ value, options, onChange }: CenterPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(40);
  };

  return (
    <div className="relative z-50">
      <div 
        onClick={() => setIsOpen(true)} 
        className={`bg-slate-800/50 backdrop-blur-md border ${isOpen ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-slate-700'} rounded-xl pl-10 pr-4 py-2 text-sm font-bold text-slate-300 cursor-pointer flex items-center justify-between transition-all hover:bg-slate-800 shadow-sm min-w-[200px] h-[38px]`}
      >
        <div className="flex items-center gap-2">
          <Building2 className="absolute left-3 text-slate-500" size={16} />
          <motion.span 
            key={value} 
            initial={{ y: -5, opacity: 0, x: -2 }} 
            animate={{ y: 0, opacity: 1, x: [2, -2, 2, 0] }} 
            transition={{ duration: 0.3 }} 
            className="truncate max-w-[140px]"
          >
            {value === 'Todos' ? 'Todos los Centros' : value}
          </motion.span>
        </div>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-xs text-slate-500 ml-2">▼</motion.span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[85000]" onClick={() => setIsOpen(false)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: -10 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: -10 }} 
              transition={{ type: "spring", damping: 25, stiffness: 300 }} 
              className="absolute left-0 top-full mt-2 w-full min-w-[220px] bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] border border-slate-700 z-[85001] py-3 overflow-hidden"
            >
              <div className="max-h-56 overflow-y-auto custom-scrollbar flex flex-col items-center gap-1 scroll-smooth px-2">
                {options.map((opt) => {
                  const isSelected = opt === value;
                  const displayName = opt === 'Todos' ? 'Todos los Centros' : opt;
                  
                  return (
                    <motion.div 
                      key={opt} 
                      onClick={() => handleSelect(opt)} 
                      whileHover={{ scale: 1.02 }} 
                      whileTap={{ scale: 0.95 }} 
                      className={`w-full py-2 px-3 cursor-pointer text-center transition-colors relative flex justify-center items-center rounded-xl ${isSelected ? "text-base font-black text-indigo-400" : "text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80"}`}
                    >
                      {isSelected && <motion.div layoutId="activeCenterIndicator" className="absolute inset-0 bg-indigo-500/20 rounded-xl -z-10 border border-indigo-500/30" />}
                      {displayName}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function MascotasAdminPage() {
  const [activeTab, setActiveTab] = useState<TabCategory>('Todos');
  const [selectedCenter, setSelectedCenter] = useState<string>('Todos'); 
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pets, setPets] = useState<PetData[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  //  Cargar mascotas desde Supabase y mapear al formato de PetData 
  useEffect(() => {
    const loadPets = async () => {
      setLoadingPets(true);
      const { data } = await supabase
        .from("mascotas")
        .select("*")
        .order("creado_en", { ascending: false });

      if (data) {
        const mapped: PetData[] = data.map((m, i) => ({
          id:                  i + 1,
          name:                m.nombre,
          type:                m.especie === "perro" ? "Perro" : "Gato",
          breed:               m.especie,
          center:              `Centro ${m.centro}`,
          age:                 `${m.edad} ${m.edad === 1 ? "año" : "años"}`,
          gender:              m.genero as "Macho" | "Hembra",
          avatarUrl:           m.foto_url ?? (m.especie === "gato"
            ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150&q=80"
            : "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&q=80"),
          mainImageUrl:        m.foto_url ?? (m.especie === "gato"
            ? "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&q=80"
            : "https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&q=80"),
          readinessLabel:      m.esterilizado ? "Esterilizado" : "Sin esterilizar",
          readinessPercentage: m.esterilizado ? 100 : 40,
          isNew:               (new Date().getTime() - new Date(m.creado_en).getTime()) < 7 * 24 * 60 * 60 * 1000,
        }));
        setPets(mapped);
      }
      setLoadingPets(false);
    };
    loadPets();
  }, [refreshKey]);

  const centers = ['Todos', 'Centro Norte', 'Centro Sur', 'Centro Este'];

  // === LOGICA DE FILTRADO ===
  const filteredPets = pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesTab = true;
      if (activeTab === 'Perros') matchesTab = pet.type === 'Perro';
      if (activeTab === 'Gatos') matchesTab = pet.type === 'Gato';
      if (activeTab === 'Urgentes') matchesTab = pet.readinessPercentage < 50;

      let matchesCenter = true;
      if (selectedCenter !== 'Todos') matchesCenter = pet.center === selectedCenter;

      return matchesSearch && matchesTab && matchesCenter;
  });

  const tabs = ['Todos', 'Perros', 'Gatos', 'Urgentes'];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300 relative">
      
      <AnimatePresence>
        {isCreateModalOpen && (
            <CreatePetModal 
                isOpen={isCreateModalOpen} 
                onClose={() => { setIsCreateModalOpen(false); setRefreshKey(k => k + 1); }} 
            />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 bg-slate-800/50 backdrop-blur-md border border-slate-700/50 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white transition shadow-sm">
                  <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-black text-white tracking-tight">Gestión de Mascotas</h1>
                <p className="text-slate-400 text-sm font-medium">Administra el inventario y estado de los huéspedes.</p>
              </div>
          </div>
          
          {/* Boton unificado con el color indigo del panel de solicitudes */}
          <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/30 px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-indigo-900/50 transition-all flex items-center gap-2"
          >
              <Plus size={18} />
              Registrar Mascota
          </button>
      </div>

      {/* Contenedor Principal  */}
      <div className="flex-1 bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] p-8 flex flex-col shadow-2xl border border-slate-700/50 min-h-[600px] relative overflow-hidden">
          
          {/* Brillo interno de la tarjeta */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          {/* === TOOLBAR === */}
          <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6 relative z-10">
              
              {/* Tabs  */}
              <div className="flex bg-slate-800/50 border border-slate-700/50 p-1.5 rounded-xl relative overflow-x-auto">
                  {tabs.map((tab) => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab as TabCategory)}
                        className={`relative px-6 py-2 rounded-lg text-sm font-bold transition-colors z-10 whitespace-nowrap ${activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                          {activeTab === tab && (
                              <motion.div 
                                layoutId="activePetTab"
                                className="absolute inset-0 bg-slate-700/80 border border-slate-600 shadow-md rounded-lg"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                              />
                          )}
                          <span className="relative z-10 flex items-center gap-2">
                              {tab === 'Perros' && <Dog size={14}/>}
                              {tab === 'Gatos' && <Cat size={14}/>}
                              {tab === 'Urgentes' && <AlertCircle size={14}/>}
                              {tab}
                          </span>
                      </button>
                  ))}
              </div>

              {/* Filtro Centro + Buscador */}
              <div className="flex flex-wrap gap-3 w-full xl:w-auto justify-end items-center">
                  
                  <CenterPicker 
                    value={selectedCenter} 
                    options={centers} 
                    onChange={setSelectedCenter} 
                  />

                  <div className="relative group">
                      <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar nombre o raza..." 
                        className="pl-10 pr-4 py-2 h-[38px] bg-slate-800/50 border border-slate-700 rounded-xl text-sm font-medium text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all w-56 shadow-sm"
                      />
                  </div>
              </div>
          </div>

          {/* === GRID DE MASCOTAS === */}
          <div className="flex-1 overflow-y-auto pr-2 pb-4 relative z-10 custom-scrollbar">
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center items-start"
              >
                  <AnimatePresence mode="popLayout">
                    {loadingPets ? (
                        <div className="col-span-full py-20 flex items-center justify-center gap-3 text-slate-400">
                            <div className="w-6 h-6 border-2 border-slate-600 border-t-indigo-400 rounded-full animate-spin" />
                            <span className="font-medium text-sm">Cargando mascotas...</span>
                        </div>
                    ) : filteredPets.length > 0 ? (
                        filteredPets.map((pet) => (
                            <PetCard key={pet.id} data={pet} />
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-slate-400 flex flex-col items-center">
                            <div className="bg-slate-800/50 border border-slate-700 p-4 rounded-full mb-4">
                                <Search size={32} className="text-slate-500"/>
                            </div>
                            <p className="font-medium text-slate-300">No se encontraron mascotas.</p>
                            <p className="text-sm opacity-60 mt-1">Intenta cambiar los filtros o el centro seleccionado.</p>
                            <button 
                                onClick={() => {setActiveTab('Todos'); setSelectedCenter('Todos'); setSearchQuery('')}}
                                className="mt-4 text-indigo-400 text-sm font-bold hover:text-indigo-300 hover:underline transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        </div>
                    )}
                  </AnimatePresence>
              </motion.div>
          </div>
      </div>
    </div>
  );
}