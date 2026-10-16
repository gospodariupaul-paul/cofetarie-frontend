"use client";

import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProdusTech {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string;
  tag?: string;
  discount?: number;
}

export default function TechDeals() {
  const { addToCart } = useCart();
  const [produseTech, setProduseTech] = useState<ProdusTech[]>([]);
  const [incarcare, setIncarcare] = useState(true);
  const caruselRef = useRef<HTMLDivElement>(null);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";

  useEffect(() => {
    async function incarcaTech() {
      try {
        const res = await fetch(`${API_URL}/api/produse`);
        if (res.ok) {
          const date = await res.json();
          // Filtrare strictă pentru ofertele tehnologice specifice laboratorului
          const filtrate = date.filter((p: ProdusTech) => p.category === "tech-deals");
          setProduseTech(filtrate);
        }
      } catch (err) {
        console.error("Eroare incarcare tech deals:", err);
      } finally {
        setIncarcare(false);
      }
    }
    incarcaTech();
  }, [API_URL]);

  const gliseazaStanga = () => {
    if (caruselRef.current) {
      caruselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const gliseazaDreapta = () => {
    if (caruselRef.current) {
      caruselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (incarcare) return <div className="text-center py-10 font-bold text-gray-400 text-xs">Se încarcă caruselul tehnologic...</div>;
  if (produseTech.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 py-12 bg-gradient-to-br from-purple-50/30 to-pink-50/10 rounded-3xl my-12 border border-purple-100/20 relative">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
        <div>
          <span className="text-[10px] font-black bg-purple-100 text-purple-700 px-2.5 py-1 rounded-md uppercase tracking-wider">• HI-TECH LAB</span>
          <h2 className="text-3xl font-black text-gray-900 mt-2">Top Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Hot Deals</span></h2>
        </div>
        
        {/* Controale glisare butoane */}
        <div className="flex items-center gap-4 self-end sm:self-auto">
          <div className="bg-white border shadow-sm px-3 py-1.5 rounded-xl text-[11px] font-bold text-gray-500">
            OFERTE LIMITATE <span className="text-red-500 font-black animate-pulse">⚡ LIVE</span>
          </div>
          <div className="flex gap-2">
            <button onClick={gliseazaStanga} className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 font-black hover:bg-gray-50 transition shadow-sm active:scale-95 flex items-center justify-center">←</button>
            <button onClick={gliseazaDreapta} className="w-9 h-9 rounded-xl bg-white border border-gray-200 text-gray-700 font-black hover:bg-gray-50 transition shadow-sm active:scale-95 flex items-center justify-center">→</button>
          </div>
        </div>
      </div>

      {/* Caruselul Orizontal */}
      <div 
        ref={caruselRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth snap-x snap-mandatory overflow-y-hidden"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {produseTech.map((produs) => {
          const procentReducere = produs.discount || 25;
          const pretVechi = Math.round(produs.price / (1 - procentReducere / 100));

          return (
            <div 
              key={produs.id} 
              className="w-[290px] shrink-0 snap-start relative rounded-3xl bg-white border border-purple-100/40 p-5 shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden"
            >
              <div className="absolute top-4 left-4 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-full shadow z-10">
                -{procentReducere}%
              </div>

              <div>
                <Link href={`/produs/${produs.id}`} className="block cursor-pointer">
                  <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-purple-50/50 to-pink-50/30 flex items-center justify-center relative overflow-hidden shadow-inner border border-purple-50/20">
                    {produs.icon && produs.icon.startsWith("data:image") ? (
                      <img src={produs.icon} alt={produs.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl">{produs.icon || "⚡"}</span>
                    )}
                    {produs.tag && (
                      <span className="absolute bottom-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-md bg-white border text-purple-600 shadow-sm">
                        {produs.tag}
                      </span>
                    )}
                  </div>
                </Link>

                <p className="text-[9px] font-black text-purple-500 uppercase tracking-wider mt-4">Echipamente Cofetărie</p>
                <Link href={`/produs/${produs.id}`} className="hover:text-purple-600 transition block mt-0.5">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{produs.name}</h3>
                </Link>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">{produs.description}</p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-50">
                <div className="flex justify-between items-baseline mb-3">
                  <span className="text-xs text-gray-400 line-through font-medium">{pretVechi} LEI</span>
                  <span className="text-base font-black text-gray-950">{produs.price} LEI</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link href={`/produs/${produs.id}`} className="rounded-xl border border-gray-200 text-gray-600 font-bold text-[10px] py-2.5 hover:bg-gray-50 transition text-center block">
                    Detalii
                  </Link>
                  <button 
                    onClick={() => addToCart({ ...produs, category: "tech-deals" })}
                    className="rounded-xl bg-purple-600 text-white font-black text-[10px] py-2.5 shadow-md hover:bg-purple-700 transition active:scale-95"
                  >
                    Adaugă
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
}
