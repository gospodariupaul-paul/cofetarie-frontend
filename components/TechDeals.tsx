"use client";

import { useState, useEffect } from "react";

interface Deal {
  id: number;
  title: string;
  category: string;
  oldPrice: number;
  newPrice: number;
  discount: number;
  rating: number;
  icon: string;
  tag: string;
}

export default function TechDeals() {
  const [timeLeft, setTimeLeft] = useState({ ore: 5, minute: 41, secunde: 7 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.secunde > 0) return { ...prev, secunde: prev.secunde - 1 };
        if (prev.minute > 0) return { ...prev, minute: prev.minute - 1, secunde: 59 };
        if (prev.ore > 0) return { ore: prev.ore - 1, minute: 59, secunde: 59 };
        clearInterval(timer);
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const deals: Deal[] = [
    { id: 1, title: "Imprimantă 3D Alimentară Pro", category: "Echipamente Smart", oldPrice: 4200, newPrice: 2999, discount: 28, rating: 4.9, icon: "🤖", tag: "Cel mai vândut" },
    { id: 2, title: "Aerograf Digital cu Bluetooth", category: "Ustensile Hi-Tech", oldPrice: 850, newPrice: 590, discount: 30, rating: 4.7, icon: "🎨", tag: "Hot Deal" },
    { id: 3, title: "Termometru Laser Ultra-Precis", category: "Senzori Gătit", oldPrice: 320, newPrice: 199, discount: 37, rating: 4.8, icon: "🎯", tag: "Temperare Ciocolată" },
    { id: 4, title: "Mixer Planetar Smart Inteligent", category: "Roboți Bucătărie", oldPrice: 2400, newPrice: 1850, discount: 22, rating: 5.0, icon: "⚡", tag: "Stoc Limitat" },
  ];

  // Dublăm lista de produse pentru a crea efectul vizual de buclă infinită (fără spații goale)
  const infiniteDeals = [...deals, ...deals];
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 relative overflow-hidden">
      {/* Stiluri injectate direct pentru realizarea animatiei infinite */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/10 blur-3xl pointer-events-none rounded-full" />

      {/* Header Secțiune */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center border-b border-pink-100 pb-6 mb-12 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-pink-600">Oferte Tehnologice</span>
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mt-1">
            Top Tech <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Hot Deals</span>
          </h2>
        </div>

        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-2xl shadow-sm border border-pink-100/50">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Expiră în:</span>
          <div className="flex gap-1.5 text-sm font-black text-pink-600">
            <span className="bg-pink-50 px-2 py-1 rounded-lg border border-pink-100">{String(timeLeft.ore).padStart(2, "0")}h</span>
            <span>:</span>
            <span className="bg-pink-50 px-2 py-1 rounded-lg border border-pink-100">{String(timeLeft.minute).padStart(2, "0")}m</span>
            <span>:</span>
            <span className="bg-pink-50 px-2 py-1 rounded-lg border border-pink-100 text-red-500">{String(timeLeft.secunde).padStart(2, "0")}s</span>
          </div>
        </div>
      </div>
      {/* Containerul caruselului cu miscare fluida */}
      <div className="relative z-10 w-full overflow-hidden mask-gradient">
        <div className="animate-marquee gap-6 py-4">
          {infiniteDeals.map((deal, index) => (
            <div 
              key={`${deal.id}-${index}`}
              className="w-[280px] shrink-0 relative rounded-3xl bg-white/90 backdrop-blur-sm p-6 border border-pink-100/40 shadow-sm transition-all duration-300 hover:shadow-xl flex flex-col justify-between"
            >
              {/* Procent reducere */}
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-[11px] font-black px-2.5 py-1 rounded-xl shadow-md">
                -{deal.discount}%
              </div>

              <div>
                <div className="h-40 w-full rounded-2xl bg-gradient-to-br from-pink-50/50 to-purple-50/50 flex items-center justify-center text-5xl relative overflow-hidden">
                  <span>{deal.icon}</span>
                  <span className="absolute bottom-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/80 border text-gray-500">
                    {deal.tag}
                  </span>
                </div>

                <p className="text-[10px] font-bold text-pink-500 uppercase tracking-wider mt-4">{deal.category}</p>
                <h3 className="text-base font-bold text-gray-800 mt-1 truncate">{deal.title}</h3>
                
                <div className="flex items-center gap-1 mt-1.5 text-xs text-amber-500 font-bold">
                  <span>⭐</span> <span>{deal.rating.toFixed(1)}</span>
                  <span className="text-[10px] text-gray-400 font-medium">(24)</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs text-gray-400 line-through">{deal.oldPrice} LEI</p>
                  <p className="text-xl font-black text-gray-900 tracking-tight">{deal.newPrice} LEI</p>
                </div>
                <button className="rounded-xl bg-gray-900 text-white font-bold text-xs px-3.5 py-2.5 shadow-md hover:bg-pink-600 transition">
                  Detalii
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
