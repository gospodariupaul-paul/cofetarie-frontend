"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { cartCount } = useCart();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<"favorites" | "notifications" | "profile" | null>(null);

  // Formular date
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [mesaj, setMesaj] = useState({ text: "", tip: "" });

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";

  // Verificăm la pornire dacă există un utilizator real autentificat în browser
  useEffect(() => {
    const storedUser = localStorage.getItem("user_real");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "register" && !agreeTerms) return;
    
    setMesaj({ text: "Se procesează...", tip: "info" });
    const endpoint = modalType === "login" ? "/api/auth/login" : "/api/auth/register";

    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: modalType === "register" ? name : undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "A apărut o eroare la autentificare.");
      }

      if (modalType === "login") {
        const loggedUser = { email: data.user?.email || email };
        localStorage.setItem("user_real", JSON.stringify(loggedUser));
        localStorage.setItem("token_real", data.token);
        setUser(loggedUser);
        setMesaj({ text: "Te-ai conectat cu succes! 🎉", tip: "succes" });
        setTimeout(() => { setModalType(null); setMesaj({ text: "", tip: "" }); }, 1500);
      } else {
        setMesaj({ text: "Cont creat! Acum te poți conecta. ✨", tip: "succes" });
        setModalType("login");
      }
    } catch (err: any) {
      setMesaj({ text: err.message, tip: "eroare" });
    }
  };

  const handleDeconectare = () => {
    localStorage.removeItem("user_real");
    localStorage.removeItem("token_real");
    setUser(null);
    setActiveDropdown(null);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-pink-600/90 backdrop-blur-md text-white shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Zona Stânga: Hamburger Menu + Siglă Complexă */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="rounded-xl p-2.5 hover:bg-white/10 transition active:scale-95 border border-transparent hover:border-pink-400/20"
              >
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div onClick={() => window.location.reload()} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-white to-pink-100 text-pink-600 shadow-md transition group-hover:scale-105 group-hover:rotate-3">
                  <svg xmlns="http://w3.org" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h-2V5.73c-.6-.34-1-1-1-1.73a2 2 0 0 1 2-2z" fill="currentColor" className="text-pink-500" />
                    <path d="M19 17h-1.42a2.42 2.42 0 0 1-4.3-.12 2.42 2.42 0 0 1-4.56 0 2.42 2.42 0 0 1-4.3.12H5c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2v6c0 1.1-.9 2-2 2z" />
                    <path d="M6 17l1.5 5h9l1.5-5" />
                  </svg>
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-white group-hover:text-pink-100 transition">
                  Dulce<span className="font-light text-pink-200">Gust</span>
                </span>
              </div>
            </div>
          </div>

          {/* Zona Mijloc: Caseta Căutare */}
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              placeholder="Caută torturi, prăjituri..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-white/20 pl-10 pr-4 py-2 text-sm text-white placeholder-pink-200 outline-none border border-pink-400/30 focus:bg-white focus:text-gray-900 transition"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-pink-200 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          {/* Zona Dreapta: Navigare, Autentificare și Interfețe Dropdown */}
          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <ul className="hidden lg:flex gap-6 items-center font-medium">
              <li 
                onClick={() => window.location.reload()} 
                className="cursor-pointer p-2 rounded-xl text-pink-100 hover:bg-white/10 hover:text-white transition active:scale-95"
                title="Acasă"
              >
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
              </li>
              <li className="cursor-pointer hover:text-pink-200 transition">Produse</li>
            </ul>

            <div className="flex items-center gap-4 relative">
              {/* NOU: Iconiță Coș de cumpărături conectată live */}
              <div className="relative cursor-pointer p-2 rounded-xl text-pink-100 hover:bg-white/10 transition">
                <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600 shadow-sm animate-bounce">
                  {cartCount}
                </span>
              </div>

              {!user ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => { setMesaj({ text: "", tip: "" }); setModalType("login"); }} className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">Log In</button>
                  <button onClick={() => { setMesaj({ text: "", tip: "" }); setModalType("register"); }} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-pink-600 shadow-md hover:bg-pink-50 transition active:scale-95">Register</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <button onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")} className="bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-xs font-bold hover:bg-white/30 transition">
                      👤 {user.email}
                    </button>
                    {activeDropdown === "profile" && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl p-3 shadow-2xl border border-pink-100 text-gray-800 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <p className="text-[10px] text-gray-400 font-bold px-3 uppercase tracking-wider">Conectat ca</p>
                        <p className="text-xs font-bold text-gray-900 px-3 truncate pb-2 border-b border-gray-50">{user.email}</p>
                        <button className="w-full text-left text-xs font-medium text-gray-600 hover:text-pink-600 px-3 py-2.5 rounded-xl hover:bg-pink-50/50 mt-2 transition">📦 Istoric Comenzi</button>
                        <button onClick={handleDeconectare} className="w-full text-left text-xs font-bold text-red-600 px-3 py-2.5 rounded-xl hover:bg-red-50 transition mt-1">🚪 Deconectare</button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* POP-UP MODAL COMPLEX DE AUTENTIFICARE DULCE GUST */}
      {modalType && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-pink-100 shadow-2xl relative animate-in zoom-in-95 duration-200 text-gray-800">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-sm">✕</button>
            <h3 className="text-xl font-black text-center mb-6">{modalType === "login" ? "Conectare Cont" : "Creare Cont Nou"}</h3>

            {mesaj.text && (
              <div className={`text-center text-xs font-bold p-3 rounded-xl mb-4 ${
                mesaj.tip === "succes" ? "bg-green-50 text-green-700 border border-green-100" :
                mesaj.tip === "eroare" ? "bg-red-50 text-red-700 border border-red-100" : "bg-blue-50 text-blue-700"
              }`}>{mesaj.text}</div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {modalType === "register" && (
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Nume Complet</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-pink-500" placeholder="Ionescu Alin" />
                </div>
              )}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Adresă Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-pink-500" placeholder="nume@gmail.com" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Parolă</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs outline-none focus:border-pink-500" placeholder="••••••••" />
              </div>
              {modalType === "register" && (
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="rounded text-pink-600 focus:ring-pink-500" />
                  <label htmlFor="terms" className="text-xs text-gray-500">Sunt de acord cu Termenii și Condițiile</label>
                </div>
              )}
              <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-3.5 rounded-xl transition shadow-md mt-2">
                {modalType === "login" ? "Intră în cont" : "Înregistrează-te"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Răspuns structural pentru Sidebar */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm z-50 flex animate-in fade-in duration-200">
          <div className="w-64 bg-white min-h-screen p-6 shadow-2xl flex flex-col justify-between text-gray-800 animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-black text-pink-600 text-lg">Meniu Navigare</span>
                <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
              </div>
              <ul className="mt-6 space-y-4 font-bold text-sm">
                <li onClick={() => { setIsSidebarOpen(false); window.location.reload(); }} className="hover:text-pink-600 cursor-pointer transition">🏠 Acasă</li>
                <li className="hover:text-pink-600 cursor-pointer transition">🍰 Produse din Vitrină</li>
                <li className="hover:text-pink-600 cursor-pointer transition">📞 Contact Laborator</li>
              </ul>
            </div>
            <p className="text-[10px] text-gray-400 font-bold text-center">DulceGust v1.1 Producție</p>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}
    </>
  );
}
