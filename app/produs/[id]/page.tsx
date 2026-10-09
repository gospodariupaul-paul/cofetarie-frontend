"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

interface Produs {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string;
  tag?: string;
}

export default function DetaliiProdus() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [produs, setProdus] = useState<Produs | null>(null);
  const [incarcare, setIncarcare] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";

  useEffect(() => {
    async function preiaProdus() {
      try {
        const res = await fetch(`${API_URL}/api/produse`);
        const date: Produs[] = await res.json();
        const gasit = date.find((p) => p.id === params.id);
        if (gasit) setProdus(gasit);
      } catch (err) {
        console.error("Eroare incarcare produs:", err);
      } finally {
        setIncarcare(false);
      }
    }
    if (params.id) preiaProdus();
  }, [params.id, API_URL]);

  if (incarcare) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex justify-center items-center gap-3">
          <div className="w-6 h-6 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-bold text-gray-500">Se încarcă detaliile rețetei...</span>
        </div>
      </div>
    );
  }

  if (!produs) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col justify-center items-center gap-4">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-black text-gray-900">Produsul nu a fost găsit în vitrină!</h2>
          <Link href="/" className="bg-pink-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md">Înapoi la produse</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-50/20 to-white text-gray-800 flex flex-col justify-between">
      <div>
        <Navbar />
        <main className="max-w-5xl mx-auto px-6 py-12">
          
          <button onClick={() => router.back()} className="text-xs font-bold text-gray-500 hover:text-pink-600 transition flex items-center gap-1.5 mb-8">
            ← Înapoi la vitrină
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white border border-pink-100/50 p-8 rounded-3xl shadow-xl relative overflow-hidden">
            
            {/* Secțiune Imagine Stânga */}
            <div className="h-96 w-full rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center relative overflow-hidden border border-pink-100/30">
              {produs.icon && produs.icon.startsWith("data:image") ? (
                <img src={produs.icon} alt={produs.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-7xl">{produs.icon || "🧁"}</span>
              )}
              {produs.tag && (
                <span className="absolute top-4 right-4 text-xs font-bold px-3 py-1 rounded-lg bg-pink-600 text-white shadow-md animate-pulse">
                  {produs.tag}
                </span>
              )}
            </div>

            {/* Secțiune Detalii Dreapta */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <span className="text-[10px] font-black bg-pink-100 text-pink-700 px-3 py-1 rounded-md uppercase tracking-wider">{produs.category}</span>
                <h1 className="text-3xl font-black text-gray-900 mt-4 leading-tight">{produs.name}</h1>
                
                <div className="mt-6">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b pb-2 mb-3">Descrierea Produsului & Compoziție</h4>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium whitespace-pre-line">{produs.description}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Preț Special Laborator</p>
                  <p className="text-3xl font-black text-gray-950 mt-0.5">{produs.price} LEI</p>
                </div>
                
                <button 
                  onClick={() => { addToCart(produs); alert(`${produs.name} a fost adăugat în coș! 🧁`); }}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-black text-sm px-8 py-4 rounded-2xl shadow-lg shadow-pink-600/20 transition active:scale-95 flex items-center gap-2"
                >
                  🛒 Adaugă în Coșul Meu
                </button>
              </div>

            </div>
          </div>
        </main>
      </div>
      <footer className="bg-gray-950 py-8 text-center text-xs text-gray-600 mt-12">© 2026 DulceGust.</footer>
    </div>
  );
}
