"use client";

import { useState, useEffect } from "react";
import TechDeals from "@/components/TechDeals";

interface Produs {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string;
  tag?: string;
}

export default function Home() {
  const [produse, setProduse] = useState<Produs[]>([]);
  const [incarcare, setIncarcare] = useState<boolean>(true);
  const [eroare, setE悪oare] = useState<string | null>(null);

  // Preluăm link-ul live de pe Render din variabila de mediu, sau folosim fallback local
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";

  useEffect(() => {
    async function incarcaDatele() {
      try {
        const response = await fetch(`${API_URL}/api/produse`);
        if (!response.ok) {
          throw new Error("Nu am putut prelua produsele de pe server.");
        }
        const date = await response.json();
        setProduse(date);
      } catch (err) {
        console.error("Eroare fetch:", err);
        setEroare((err as Error).message);
      } finally {
        setIncarcare(false);
      }
    }
    incarcaDatele();
  }, [API_URL]);

  // Filtram produsele pe categorii dinamice venite din baza de date Neon
  const torturi = produse.filter((p) => p.category === "torturi");
  const prajituri = produse.filter((p) => p.category === "prajituri");
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50/40 to-white text-gray-800">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-200/30 blur-3xl rounded-full pointer-events-none" />
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-950">
          Cofetăria <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">Dulce Gust</span>
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Laborator artizanal unde tehnologia hi-tech întâlnește rețetele tradiționale pentru momente de neuitat.
        </p>
      </section>

      {/* Secțiunea de Produse din Baza de Date Neon */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 border-b pb-4 border-pink-100">
          🍰 Prăjituri și Torturi Artizanale
        </h2>

        {incarcare && (
          <div className="flex justify-center items-center py-20 gap-3">
            <div className="w-6 h-6 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-bold text-gray-500">Se încarcă bunătățile din server...</span>
          </div>
        )}

        {eroare && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-xl mx-auto text-center font-medium shadow-sm">
            ⚠️ {eroare}. Se folosesc datele locale de siguranță.
          </div>
        )}

        {!incarcare && !eroare && produse.length === 0 && (
          <p className="text-center text-gray-500 font-medium py-10">Momentan nu sunt produse disponibile în vitrină.</p>
        )}
        {!incarcare && produse.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {produse
              .filter((p) => p.category !== "tech-deals") // Afișăm doar produsele alimentare aici
              .map((produs) => (
                <div
                  key={produs.id}
                  className="group relative rounded-3xl bg-white border border-pink-100/50 p-5 shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-300 relative">
                      <span>{produs.icon || "🧁"}</span>
                      {produs.tag && (
                        <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border text-pink-600 shadow-sm">
                          {produs.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mt-4">{produs.category}</p>
                    <h3 className="text-lg font-bold text-gray-900 mt-1">{produs.name}</h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{produs.description}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                    <p className="text-xl font-black text-gray-900">{produs.price} LEI</p>
                    <button className="rounded-xl bg-pink-600 text-white font-bold text-xs px-4 py-2.5 shadow-md hover:bg-pink-700 transition">
                      Adaugă în coș
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* Secțiunea Tech Deals (Caruselul în mișcare pe care l-am optimizat anterior) */}
      <TechDeals />
    </main>
  );
}
