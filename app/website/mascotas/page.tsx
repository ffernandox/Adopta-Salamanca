"use client";

import React, { useState } from "react";
import { 
  Search, Filter, ArrowLeft, Plus, 
  Dog, Cat, AlertCircle 
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import PetCard, { PetData } from "@/components/PetCard";

type Category = 'Todos' | 'Perros' | 'Gatos' | 'Urgentes';

export default function MascotasAdminPage() {
  const [activeTab, setActiveTab] = useState<Category>('Todos');
  const [searchQuery, setSearchQuery] = useState("");

  const pets: PetData[] = [
    {
      id: 1, name: "Bucky", type: "Perro", center: "Albergue Municipal", breed: "Golden Retriever", age: "2 años", gender: "Macho",
      avatarUrl: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?auto=format&fit=crop&w=150&q=80",
      mainImageUrl: "https://images.unsplash.com/photo-1558788353-f76d92427f16?auto=format&fit=crop&w=800&q=80",
      readinessLabel: "Energía", readinessPercentage: 90, isNew: true,
    },
    {
      id: 2, name: "Mochi", type: "Gato", center: "Albergue Municipal", breed: "Gato Siamés", age: "8 meses", gender: "Hembra",
      avatarUrl: "https://images.unsplash.com/photo-1513245543132-31f507417b26?auto=format&fit=crop&w=150&q=80",
      mainImageUrl: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80",
      readinessLabel: "Sociabilidad", readinessPercentage: 65, isNew: true,
    },
    {
      id: 3, name: "Rocky", type: "Perro", center: "Refugio Patitas", breed: "Bulldog Francés", age: "4 años", gender: "Macho",
      avatarUrl: "https://images.unsplash.com/photo-1583511655337-f011765b0592?auto=format&fit=crop&w=150&q=80",
      mainImageUrl: "https://images.unsplash.com/photo-1600077106724-3f65796366f7?auto=format&fit=crop&w=800&q=80",
      readinessLabel: "Salud", readinessPercentage: 100,
    },
    {
      id: 4, name: "Simba", type: "Gato", center: "Casa Hogar", breed: "Maine Coon", age: "3 años", gender: "Macho",
      avatarUrl: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=150&q=80",
      mainImageUrl: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=800&q=80",
      readinessLabel: "Cariñoso", readinessPercentage: 95,
    },
    {
      id: 5, name: "Bruno", type: "Perro", center: "Albergue Municipal", breed: "Pastor Alemán", age: "5 años", gender: "Macho",
      avatarUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=150&q=80",
      mainImageUrl: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80",
      readinessLabel: "Protector", readinessPercentage: 100,
    }
  ];

  // Filtramos los datos 
  const filteredPets = pets.filter(pet => {
      const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase());
      if (activeTab === 'Todos') return matchesSearch;
      if (activeTab === 'Perros') return matchesSearch && !pet.breed.includes('Gato') && !pet.breed.includes('Coon') && !pet.breed.includes('Siamés');
      if (activeTab === 'Gatos') return matchesSearch && (pet.breed.includes('Gato') || pet.breed.includes('Coon') || pet.breed.includes('Siamés'));
      if (activeTab === 'Urgentes') return matchesSearch && pet.readinessPercentage < 80; 
      return matchesSearch;
  });

  const tabs = ['Todos', 'Perros', 'Gatos', 'Urgentes'];

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in zoom-in duration-300 relative">
      
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 bg-white/40 backdrop-blur-md border border-white/20 rounded-full text-gray-600 hover:bg-white hover:text-black transition shadow-sm">
                  <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Mascotas</h1>
                <p className="text-gray-500 text-sm">Administra el inventario y estado de los huéspedes.</p>
              </div>
          </div>
          <button className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-black/20 transition-all flex items-center gap-2">
              <Plus size={18} />
              Registrar Mascota
          </button>
      </div>

      <div className="flex-1 bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 flex flex-col shadow-xl border border-white/50 min-h-[600px]">
          
          <div className="flex flex-col xl:flex-row justify-between items-center mb-8 gap-6">
              
              <div className="flex bg-gray-100 p-1.5 rounded-xl relative">
                  {tabs.map((tab) => (
                      <button 
                        key={tab} 
                        onClick={() => setActiveTab(tab as Category)}
                        className={`relative px-6 py-2 rounded-lg text-sm font-bold transition-colors z-10 ${activeTab === tab ? 'text-black' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                          {activeTab === tab && (
                              <motion.div 
                                layoutId="activePetTab"
                                className="absolute inset-0 bg-white rounded-lg shadow-sm"
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

              {/* Buscador */}
              <div className="flex gap-3 w-full xl:w-auto justify-end">
                  <div className="relative group">
                      <Search className="absolute left-3 top-2.5 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar mascota..." 
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-100 focus:border-gray-400 transition-all w-64 shadow-sm"
                      />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm">
                      <Filter size={16} /> Filtros
                  </button>
              </div>
          </div>

          {/*GRID DE MASCOTAS */}
          <div className="flex-1 overflow-y-auto pr-2 pb-4">
              <motion.div 
                layout 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 place-items-center items-start"
              >
                  <AnimatePresence mode="popLayout">
                    {filteredPets.length > 0 ? (
                        filteredPets.map((pet) => (
                            <motion.div
                                key={pet.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                                className="w-full"
                            >
                                {/* Renderizamos el componente PetCard */}
                                <PetCard data={pet} />
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 text-center text-gray-400 flex flex-col items-center">
                            <Dog size={48} className="mb-4 opacity-20"/>
                            <p>No se encontraron mascotas en esta categoría.</p>
                        </div>
                    )}
                  </AnimatePresence>
              </motion.div>
          </div>
      </div>
    </div>
  );
}