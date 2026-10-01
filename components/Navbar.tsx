"use client";

import { useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<"favorites" | "notifications" | "profile" | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "register" && !agreeTerms) return;
    setIsLoggedIn(true);
    setModalType(null);
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
              {!isLoggedIn ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setModalType("login")} className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-white/10 transition">Log In</button>
                  <button onClick={() => setModalType("register")} className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-pink-600 shadow-md hover:bg-pink-50 transition active:scale-95">Register</button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  
                  {/* Dropdown Meniu Favorite */}
                  <div className="relative">
                    <button onClick={() => setActiveDropdown(activeDropdown === "favorites" ? null : "favorites")} className="p-2 rounded-xl text-pink-100 hover:bg-white/10 transition">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600 shadow-sm">2</span>
                    </button>
                    {activeDropdown === "favorites" && (
                      <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white p-4 text-gray-800 shadow-2xl border border-pink-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-2">❤️ Produse Favorite</h4>
                        <div className="space-y-2 text-xs">
                          <p className="font-semibold text-gray-800 p-1 hover:bg-pink-50 rounded-lg cursor-pointer">🎂 Tort Kinder Premium</p>
                          <p className="font-semibold text-gray-800 p-1 hover:bg-pink-50 rounded-lg cursor-pointer">🧁 Ecler cu Fistic</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Meniu Notificări */}
                  <div className="relative">
                    <button onClick={() => setActiveDropdown(activeDropdown === "notifications" ? null : "notifications")} className="p-2 rounded-xl text-pink-100 hover:bg-white/10 transition">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-bold text-white shadow-sm">1</span>
                    </button>
                    {activeDropdown === "notifications" && (
                      <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-white p-4 text-gray-800 shadow-2xl border border-pink-100 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                        <h4 className="font-bold text-sm text-gray-900 border-b pb-2 mb-2">🔔 Stadiu Comandă</h4>
                        <div className="p-2 bg-pink-50 rounded-xl text-xs">
                          <p className="font-semibold text-pink-700">🚚 Comandă expediată!</p>
                          <p className="text-gray-500 mt-1">Tortul tău ajunge în cca. 30 de minute.</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dropdown Meniu Profil */}
                  <div className="relative">
                    <button onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")} className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-700/50 border border-pink-400/40 text-pink-100 transition hover:bg-pink-700">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {activeDropdown === "profile" && (
                      <div className="absolute right-0 mt-3 w-52 rounded-2xl bg-white p-2 text-gray-800 shadow-2xl border border-pink-100 z-50 text-xs font-medium animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="px-3 py-1.5 border-b border-gray-100 mb-1">
                          <p className="text-[10px] text-gray-400">Conectat ca</p>
                          <p className="text-xs font-bold text-gray-800 truncate">client@dulcegust.ro</p>
                        </div>
                        <ul className="space-y-0.5">
                          <li className="px-3 py-2 rounded-lg hover:bg-pink-50 cursor-pointer text-gray-700 hover:text-pink-600 transition">📦 Istoric Comenzi</li>
                          <li onClick={() => setIsLoggedIn(false)} className="px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 font-semibold cursor-pointer transition border-t border-gray-100 mt-1">🚪 Deconectare</li>
                        </ul>
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>

        </div>
      </nav>
      {/* CASETE MODALE AUTH + MENIU HAMBURGER EXTINS INTEGRAL */}
      {modalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalType(null)} />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-gray-800 shadow-2xl border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
            <button onClick={() => setModalType(null)} className="absolute right-5 top-5 text-gray-400 hover:text-pink-600 font-bold p-1 text-sm">✕</button>

            <div className="text-center mb-6">
              <span className="text-3xl">🧁</span>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-2">
                {modalType === "login" ? "Conectează-te în Cont" : "Creează un Cont"}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {modalType === "login" ? "Introdu datele contului tău pentru a plasa o comandă" : "Alătură-te comunității DulceGust pentru beneficii premium"}
              </p>
            </div>

            <div className="space-y-2">
              <button onClick={() => { setIsLoggedIn(true); setModalType(null); }} className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12.24 10.285V13.4h6.887C18.2 15.614 15.645 18 12.24 18c-3.86 0-7-3.14-7-7s3.14-7 7-7c1.71 0 3.28.62 4.5 1.643l2.424-2.424C17.396 1.607 14.94 1 12.24 1 6.58 1 2 5.58 2 11.24s4.58 10.24 10.24 10.24c5.795 0 10.254-4.074 10.254-10.24 0-.695-.08-1.355-.22-1.955H12.24z"/></svg>
                {modalType === "login" ? "Conectare cu Google" : "Continuă cu Google"}
              </button>
              <button onClick={() => { setIsLoggedIn(true); setModalType(null); }} className="w-full flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition">
                <svg className="h-4 w-4 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.51-.64.74-1.2 1.88-1.05 3 .12.01 2.34-.64 3-1.45z"/></svg>
                {modalType === "login" ? "Conectare cu Apple" : "Continuă cu Apple"}
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <span className="relative bg-white px-3 text-[11px] text-gray-400 font-medium">sau cu email</span>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Adresă Email</label>
                <input type="email" required placeholder="nume@exemplu.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs outline-none focus:border-pink-500 focus:bg-white transition" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Parolă</label>
                <input type="password" required placeholder={modalType === "login" ? "Introduceți parola" : "Minim 6 caractere"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs outline-none focus:border-pink-500 focus:bg-white transition" />
              </div>
              
              {modalType === "register" && (
                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="terms" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-0.5 rounded border-gray-300 text-pink-600 h-3.5 w-3.5" />
                  <label htmlFor="terms" className="text-[11px] text-gray-500 font-medium cursor-pointer leading-tight">Sunt de acord cu Termenii și Condițiile cofetăriei.</label>
                </div>
              )}

              <button type="submit" disabled={modalType === "register" && !agreeTerms} className="w-full rounded-xl bg-pink-600 py-2.5 text-xs font-bold text-white shadow-lg transition hover:bg-pink-700 disabled:opacity-50">
                {modalType === "login" ? "Autentificare Cont" : "Creează Cont Client"}
              </button>
            </form>

            <div className="text-center mt-5 pt-3 border-t border-gray-100 text-xs text-gray-500">
              {modalType === "login" ? (
                <p>Nu ai un cont? <span onClick={() => { setModalType("register"); setAgreeTerms(false); }} className="text-pink-600 font-bold cursor-pointer hover:underline">Înregistrează-te</span></p>
              ) : (
                <p>Ai deja un cont? <span onClick={() => setModalType("login")} className="text-pink-600 font-bold cursor-pointer hover:underline">Conectează-te</span></p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MENIU LATERAL HAMBURGER SIDEBAR COMPLET CU TOATE INFORMAȚIILE */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ${isSidebarOpen ? "visible opacity-100" : "invisible opacity-0"}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
        <div className={`absolute left-0 top-0 h-full w-full max-w-xs bg-white text-gray-800 p-6 shadow-2xl transition-transform duration-300 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          
          <div className="flex items-center justify-between border-b pb-4 border-pink-100">
            <span className="font-extrabold text-pink-600 tracking-tight flex items-center gap-2"><span className="text-xl">🧁</span> Meniu Machete</span>
            <button onClick={() => setIsSidebarOpen(false)} className="text-gray-400 hover:text-pink-600 font-bold p-1">✕</button>
          </div>
          
          <div className="mt-4 flex-1 overflow-y-auto space-y-5 text-sm font-medium">
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">Categorii</p>
              <ul className="space-y-1">
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">🎂 Torturi Personalizate</li>
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">👶 Torturi Botez & Copii</li>
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">🍡 Candy Bar Evenimente</li>
                <li className="px-3 py-2 rounded-xl bg-gradient-to-r from-pink-50 to-amber-50 text-pink-700 font-bold cursor-pointer border border-pink-100/50 flex items-center gap-2">✨ Configurator Tort 3D</li>
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">🏷️ Oferte și Promoții Active</li>
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">📍 Locații Laboratoare</li>
              </ul>
            </div>
            
            <div>
              <p className="text-gray-400 text-[11px] font-bold uppercase tracking-wider mb-2">Opțiuni Speciale</p>
              <ul className="space-y-1">
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">🌾 Produse Fără Gluten</li>
                <li className="px-3 py-2 rounded-xl hover:bg-pink-50 text-gray-700 cursor-pointer transition flex items-center gap-2">🌱 Deserturi Vegane / De Post</li>
              </ul>
            </div>
          </div>

          {/* Subsol Fix cu Numar de Telefon si Detalii Brand */}
          <div className="border-t pt-4 border-gray-100 mt-auto text-center text-xs text-gray-400 font-medium">
            <p className="text-gray-600 font-bold">📞 Suport comenzi: 07xx xxx xxx</p>
            <p className="mt-1 text-[10px] text-pink-400 font-semibold tracking-wide uppercase">DulceGust Producție Artizanală</p>
          </div>
        </div>
      </div>
    </>
  );
}
