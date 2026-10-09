"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import TechDeals from "@/components/TechDeals";
import { useCart } from "@/context/CartContext"; // NOU: Importăm coșul global

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
  const { addToCart } = useCart(); // NOU: Extragem funcția de adăugare în coș
  const [produse, setProduse] = useState<Produs[]>([]);
  const [incarcare, setIncarcare] = useState<boolean>(true);
  const [eroare, setEroare] = useState<string | null>(null);
  const [categorieActiva, setCategorieActiva] = useState<string>("toate");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";

  useEffect(() => {
    async function incarcaDatele() {
      try {
        const response = await fetch(`${API_URL}/api/produse`);
        if (!response.ok) {
          throw new Error("Nu s-au putut prelua produsele din baza de date.");
        }
        const date = await response.json();
        setProduse(date);
      } catch (err) {
        console.error("Eroare incarcare date:", err);
        setEroare((err as Error).message);
      } finally {
        setIncarcare(false);
      }
    }
    incarcaDatele();
  }, [API_URL]);

  const produseFiltrate = produse.filter((p) => {
    if (p.category === "tech-deals") return false;
    if (categorieActiva === "toate") return true;
    return p.category.toLowerCase() === categorieActiva.toLowerCase();
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-rose-50/40 to-white text-gray-800 flex flex-col justify-between">
      <div>
        <Navbar />

        <main>
          {/* Hero Section */}
          <section className="max-w-7xl mx-auto px-6 py-32 text-center relative overflow-hidden rounded-3xl my-6 bg-gray-950 text-white shadow-xl">
            <div className="absolute inset-0 w-full h-full opacity-40 pointer-events-none">
              <Image
                src="/hero-cake.jpg"
                alt="Cofetaria Dulce Gust Background"
                fill
                priority
                className="object-cover object-center"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-0" />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-500/20 blur-3xl rounded-full pointer-events-none" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white">
                Cofetăria <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">Dulce Gust</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl text-gray-200 font-medium">
                Laborator artizanal unde tehnologia hi-tech întâlnește rețetele tradiționale pentru momente de neuitat.
              </p>
            </div>
          </section>

          {/* Statistici */}
          <section className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center my-6">
            {[
              { icon: "💝", cifra: "15,000+", desc: "Clienți Fericiți" },
              { icon: "📜", cifra: "45+", desc: "Rețete Unice" },
              { icon: "🌿", cifra: "100%", desc: "Ingrediente Naturale" },
              { icon: "🚀", cifra: "3D Tech", desc: "Design Culinar" }
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm p-5 rounded-2xl border border-pink-100/40 shadow-sm hover:scale-105 transition-all duration-300">
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="text-3xl font-black text-pink-600">{stat.cifra}</p>
                <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wider">{stat.desc}</p>
              </div>
            ))}
          </section>
          {/* Vitrina digitala cu prăjituri */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 border-b pb-4 border-pink-100 gap-4">
              <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
                <span>🍰</span> Vitrina Noastră Digitală
              </h2>
              
              <div className="flex bg-pink-50/60 p-1.5 rounded-xl border border-pink-100 self-start md:self-auto shadow-inner">
                {[
                  { id: "toate", label: "Toate produsele" },
                  { id: "torturi", label: "Torturi" },
                  { id: "prajituri", label: "Prăjituri" }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    onClick={() => setCategorieActiva(btn.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                      categorieActiva === btn.id ? "bg-pink-600 text-white shadow" : "text-gray-600 hover:text-pink-600"
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>

            {incarcare && (
              <div className="flex justify-center items-center py-20 gap-3">
                <div className="w-6 h-6 border-4 border-pink-600 border-t-transparent rounded-full animate-spin" />
                <span className="font-bold text-gray-500">Se încarcă bunătățile din server...</span>
              </div>
            )}

            {eroare && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-2xl max-w-xl mx-auto text-center font-medium shadow-sm">
                ⚠️ {eroare}.
              </div>
            )}

            {!incarcare && !eroare && produseFiltrate.length === 0 && (
              <p className="text-center text-gray-500 font-medium py-10">Momentan nu sunt produse active.</p>
            )}

            {!incarcare && produseFiltrate.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {produseFiltrate.map((produs) => (
                  <div
                    key={produs.id}
                    className="group relative rounded-3xl bg-white border border-pink-100/50 p-5 shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
                  >
                    <div>
                      {/* NOU: Învăluim containerul de imagine într-un Link dinamic pentru vizualizare detalii */}
                      <Link href={`/produs/${produs.id}`} className="block cursor-pointer">
                        <div className="h-44 w-full rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 relative overflow-hidden shadow-inner">
                          {produs.icon && produs.icon.startsWith("data:image") ? (
                            <img src={produs.icon} alt={produs.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-5xl">{produs.icon || "🧁"}</span>
                          )}
                          {produs.tag && (
                            <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border text-pink-600 shadow-sm">
                              {produs.tag}
                            </span>
                          )}
                        </div>
                      </Link>

                      <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mt-4">{produs.category}</p>
                      
                      {/* NOU: Și click-ul pe nume duce la pagina produsului */}
                      <Link href={`/produs/${produs.id}`} className="hover:text-pink-600 transition">
                        <h3 className="text-lg font-bold text-gray-900 mt-1">{produs.name}</h3>
                      </Link>
                      
                      <p className="text-xs text-gray-500 mt-2 line-clamp-2">{produs.description}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between">
                      <p className="text-xl font-black text-gray-900">{produs.price} LEI</p>
                      
                      {/* NOU: Legăm butonul de funcția addToCart din CartContext */}
                      <button 
                        onClick={() => addToCart(produs)}
                        className="rounded-xl bg-pink-600 text-white font-bold text-xs px-4 py-2.5 shadow-md hover:bg-pink-700 transition active:scale-95"
                      >
                        Adaugă în coș
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="max-w-7xl mx-auto px-6 py-16 bg-gradient-to-r from-rose-50/50 to-pink-50/30 rounded-3xl my-12 border border-pink-100/20">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-extrabold text-gray-950">Doar Ingrediente Secrete Ultra-Premium 🍓</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: "🍫", titlu: "Ciocolată Belgiană", desc: "Calitate superioară Callebaut, cu 70% cacao fină." },
                { icon: "🥛", titlu: "Frișcă Naturală 36%", desc: "Fără surogate vegetale, extrasă pur din lapte de fermă." },
                { icon: "🍓", titlu: "Fructe Proaspete", desc: "Selecție locală zilnică și piureuri fine fragede." },
                { icon: "🌱", titlu: "Păstăi de Vanilie", desc: "Vanilie autentică de Madagascar pentru aromă intensă." }
              ].map((ing, i) => (
                <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100/40 text-center">
                  <div className="text-4xl mb-4">{ing.icon}</div>
                  <h3 className="font-extrabold text-gray-900 text-base">{ing.titlu}</h3>
                  <p className="text-xs text-gray-500 mt-2">{ing.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <TechDeals />
        </main>
      </div>

      <footer className="bg-gray-950 text-gray-400 pt-16 pb-8 px-6 border-t border-gray-900 mt-12">
        <div className="max-w-7xl mx-auto text-center text-xs text-gray-600">
          © 2026 DulceGust. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}
