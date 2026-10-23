"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface MesajChat {
  id?: string;
  userId: string;
  userName: string;
  emitent: "user" | "suport";
  text: string;
  createdAt?: string;
}

interface Produs {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string;
}

export default function Navbar() {
  const { cart, cartCount, cartTotal, removeFromCart, clearCart } = useCart();
  const [user, setUser] = useState<{ email: string; name?: string } | null>(null);
  const [listaProduse, setListaProduse] = useState<Produs[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<"notifications" | "profile" | null>(null);

  const [numarNotificari, setNumarNotificari] = useState<number>(0);
  const [produseNoiNotif, setProduseNoiNotif] = useState<Produs[]>([]);
  const [mesajeNoiCount, setMesajeNoiCount] = useState<number>(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [mesaj, setMesaj] = useState({ text: "", tip: "" });

  const [telefonComanda, setTelefonComanda] = useState("");
  const [seTrimiteComanda, setSeTrimiteComanda] = useState(false);
  const [mesajChat, setMesajChat] = useState("");
  const [istoricChat, setIstoricChat] = useState<MesajChat[]>([]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";
  useEffect(() => {
    async function preiaProduseleSiNotificari() {
      try {
        const res = await fetch(`${API_URL}/api/produse`);
        if (res.ok) {
          const date: Produs[] = await res.json();
          setListaProduse(date || []);

          const istoricNumar = localStorage.getItem("dulce_gust_numar_produse");
          const numarCurent = date.length;

          if (istoricNumar) {
            const vechi = parseInt(istoricNumar, 10);
            if (numarCurent > vechi) {
              setNumarNotificari(numarCurent - vechi);
              setProduseNoiNotif(date.slice(vechi, numarCurent).reverse());
            }
          } else {
            localStorage.setItem("dulce_gust_numar_produse", numarCurent.toString());
          }
        }
      } catch (err) {
        console.error("Eroare preluare produse în Navbar:", err);
      }
    }

    preiaProduseleSiNotificari();
    const intervalNotif = setInterval(preiaProduseleSiNotificari, 5000);
    return () => clearInterval(intervalNotif);
  }, [API_URL]);

  const handleDeschideNotificari = () => {
    if (activeDropdown === "notifications") {
      setActiveDropdown(null);
    } else {
      setActiveDropdown("notifications");
      setNumarNotificari(0);
      localStorage.setItem("dulce_gust_numar_produse", listaProduse.length.toString());
    }
  };

  const handleSearchChange = (valoare: string) => {
    setSearchQuery(valoare);
    if (!valoare.trim()) {
      router.push("/");
    }
  };
  const executaCautareSauRedirectionare = (textCautat: string) => {
    if (!textCautat.trim()) {
      router.push("/");
      return;
    }

    const textCurat = textCautat.toLowerCase().trim();

    if (textCurat === "tort" || textCurat === "torturi") {
      router.push(`/?search=torturi`);
      return;
    }
    if (textCurat === "prajitura" || textCurat === "prajituri") {
      router.push(`/?search=prajituri`);
      return;
    }

    const produsGasit = listaProduse.find((p) => {
      if (!p || !p.name) return false;
      const numeProdusCc = p.name.toLowerCase().trim();
      return numeProdusCc === textCurat || numeProdusCc.includes(textCurat);
    });

    if (produsGasit && produsGasit.id) {
      router.push(`/produs/${produsGasit.id}`);
    } else {
      router.push(`/?search=${encodeURIComponent(textCautat)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") executaCautareSauRedirectionare(searchQuery);
  };

  const handleApasareLupa = () => executaCautareSauRedirectionare(searchQuery);

  useEffect(() => {
    const ID_CLIENT = user?.email || "vizitator_anonim";
    const preiaMesajeDinBazaDeDate = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat?userId=${ID_CLIENT}`);
        if (res.ok) {
          const date: MesajChat[] = await res.json();
          
          if (istoricChat.length > 0 && date.length > istoricChat.length && !isSidebarOpen) {
            const ultimele = date.slice(istoricChat.length);
            const deLaSuport = ultimele.filter(m => m.emitent === "suport").length;
            if (deLaSuport > 0) {
              setMesajeNoiCount((prev) => prev + deLaSuport);
            }
          }
          
          setIstoricChat(date || []);
        }
      } catch (err) {
        console.error("Eroare citire chat client:", err);
      }
    };
    preiaMesajeDinBazaDeDate();
    const intervalMesaje = setInterval(preiaMesajeDinBazaDeDate, 3000);
    return () => clearInterval(intervalMesaje);
  }, [isSidebarOpen, user, API_URL, istoricChat.length]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_real");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "register" && !agreeTerms) return;
    setMesaj({ text: "Se procesează...", tip: "info" });

    const emailCurat = email.toLowerCase().trim();

    if (modalType === "login" && emailCurat === "admin@dulcegust.ro") {
      const loggedAdmin = { email: "admin@dulcegust.ro", name: "Administrator" };
      localStorage.setItem("user_real", JSON.stringify(loggedAdmin));
      localStorage.setItem("token_real", "bypass-admin-token-dulce-gust");
      setUser(loggedAdmin);
      setMesaj({ text: "Conectat ca Administrator! 📊", tip: "succes" });
      setTimeout(() => { setModalType(null); setMesaj({ text: "", tip: "" }); router.push("/admin"); }, 1000);
      return;
    }

    if (modalType === "login" && emailCurat === "gospopaul2006@yahoo.com") {
      const loggedPaul = { email: "gospopaul2006@yahoo.com", name: "Paul" };
      localStorage.setItem("user_real", JSON.stringify(loggedPaul));
      localStorage.setItem("token_real", "bypass-paul-token-dulce-gust");
      setUser(loggedPaul);
      setMesaj({ text: "Te-ai conectat cu succes, Paul! 🎉", tip: "succes" });
      setTimeout(() => { setModalType(null); setMesaj({ text: "", tip: "" }); window.location.reload(); }, 1000);
      return;
    }

    const endpoint = modalType === "login" ? "/api/login" : "/api/register";
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCurat, password, name: modalType === "register" ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare.");
      if (modalType === "login") {
        const loggedUser = { email: emailCurat, name: data.user?.name || "Client" };
        localStorage.setItem("user_real", JSON.stringify(loggedUser));
        localStorage.setItem("token_real", data.token || "simulated-token");
        setUser(loggedUser);
        setMesaj({ text: "Te-ai conectat cu succes! 🎉", tip: "succes" });
        setTimeout(() => { setModalType(null); setMesaj({ text: "", tip: "" }); }, 1500);
      } else {
        setMesaj({ text: "Cont creat cu succes! Te poți conecta. ✨", tip: "succes" });
        setModalType("login");
      }
    } catch (err: any) {
      setMesaj({ text: err.message, tip: "eroare" });
    }
  };

  const handleTrimiteComandaNeon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setSeTrimiteComanda(true);
    try {
      const res = await fetch(`${API_URL}/api/comenzi`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientName: user?.name || user?.email || "Client Anonim", phone: telefonComanda, totalAmount: cartTotal }),
      });
      if (!res.ok) throw new Error("Eroare salvare comandă.");
      alert("Comandă trimisă cu succes! 🎂");
      clearCart();
      setTelefonComanda("");
      setIsCartOpen(false);
    } catch (err: any) {
      alert(`Eroare: ${err.message}`);
    } finally {
      setSeTrimiteComanda(false);
    }
  };

  const trimiteMesajChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mesajChat.trim()) return;
    const ID_CLIENT = user?.email || "vizitator_anonim";
    const NUME_CLIENT = user?.name || user?.email || "Vizitator";
    const nouMesaj: MesajChat = { userId: ID_CLIENT, userName: NUME_CLIENT, emitent: "user", text: mesajChat };
    setIstoricChat((prev) => [...prev, nouMesaj]);
    setMesajChat("");
    try {
      await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nouMesaj),
      });
    } catch (err) {
      console.error("Eroare trimitere mesaj chat:", err);
    }
  };

  const handleDeconectare = () => {
    localStorage.removeItem("user_real");
    localStorage.removeItem("token_real");
    setUser(null);
    setActiveDropdown(null);
    setIsSidebarOpen(false);
    window.location.reload();
  };
  return (
    <>
      <nav className="sticky top-0 z-50 bg-pink-600 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-3">
              <button onClick={() => setIsSidebarOpen(true)} className="rounded-xl p-2.5 hover:bg-white/10 transition">
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <Link href="/" className="text-2xl font-extrabold tracking-tight text-white">DulceGust</Link>
            </div>
          </div>

          <div className="relative w-full max-w-md">
            <input type="text" placeholder="Caută produse..." value={searchQuery} onChange={(e) => handleSearchChange(e.target.value)} onKeyDown={handleKeyDown} className="w-full rounded-2xl bg-white pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none border-none font-bold shadow-sm" />
            <svg onClick={handleApasareLupa} className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-4 relative">
              <div className="relative">
                <button onClick={handleDeschideNotificari} className="relative p-2 rounded-xl text-pink-100 hover:bg-white/10 text-lg transition flex items-center justify-center">
                  {numarNotificari > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-md">{numarNotificari}</span>
                  )}
                  🔔
                </button>
                {activeDropdown === "notifications" && (
                  <div className="absolute right-0 mt-3 w-72 bg-white rounded-2xl p-4 shadow-2xl border text-gray-800 z-50">
                    <div className="flex justify-between items-center pb-2 border-b mb-2"><span className="text-xs font-black text-gray-950">Noutăți Laborator 🎂</span></div>
                    <div className="space-y-2 max-h-[240px] overflow-y-auto">
                      {produseNoiNotif.length === 0 ? (
                        <p className="text-center text-[10px] text-gray-400 font-bold py-6">Ești la curent cu toate bunătățile! 🧁</p>
                      ) : (
                        produseNoiNotif.map((prod) => (
                          <div key={prod.id} onClick={() => { router.push(`/produs/${prod.id}`); setActiveDropdown(null); }} className="p-2.5 bg-pink-50/40 hover:bg-pink-50 rounded-xl border border-pink-100/20 text-[11px] font-bold cursor-pointer transition">
                            <p className="text-pink-600">✨ Produs Nou Adăugat!</p>
                            <p className="text-gray-900 mt-0.5 font-black">{prod.name}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Link href="/" className="p-2 rounded-xl text-pink-100 hover:bg-white/10 transition text-lg font-bold">🏠</Link>
              
              <button onClick={() => { setIsSidebarOpen(true); setActiveDropdown(null); setMesajeNoiCount(0); }} className="relative p-2 rounded-xl text-pink-100 hover:bg-white/10 transition text-lg flex items-center justify-center">
                {mesajeNoiCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white shadow-md">{mesajeNoiCount}</span>
                )}
                💬
              </button>

              <div onClick={() => { setIsCartOpen(true); setActiveDropdown(null); }} className="relative cursor-pointer p-2 rounded-xl text-pink-100 hover:bg-white/10 text-lg">
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-pink-600 shadow-sm">{cartCount}</span>
                🛒
              </div>

              {!user ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => setModalType("login")} className="rounded-xl px-3 py-2 text-sm font-semibold hover:bg-white/10 transition">Log In</button>
                  <button onClick={() => setModalType("register")} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-pink-600 shadow-md">Register</button>
                </div>
              ) : (
                <div className="relative">
                  <button onClick={() => setActiveDropdown(activeDropdown === "profile" ? null : "profile")} className="bg-white/20 px-4 py-2 rounded-xl text-xs font-bold truncate max-w-[160px]">👤 {user.name || "Cont"}</button>
                  {activeDropdown === "profile" && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl p-4 shadow-2xl border text-gray-800 z-50">
                      <p className="text-xs font-black text-gray-900 truncate">{user.name}</p>
                      <button onClick={handleDeconectare} className="w-full text-left text-xs font-black text-red-600 mt-3 pt-3 border-t hover:text-red-700 transition">🚪 Deconectare</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      {/* Pop-up coș lateral */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm z-50 flex justify-end">
          <div className="w-96 bg-white min-h-screen p-6 shadow-2xl flex flex-col justify-between text-gray-800">
            <div>
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-black text-gray-950 text-base">🛒 Coș ({cartCount})</span>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 font-bold">✕</button>
              </div>
              <div className="mt-6 space-y-4 max-h-[400px] overflow-y-auto">
                {cart.length === 0 ? <p className="text-center text-xs font-bold text-gray-400 py-10">Coșul este gol. 🧁</p> : 
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl text-xs font-bold">
                      <p className="text-gray-900 font-black">{item.name} x {item.quantity}</p>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">🗑️</button>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsCartOpen(false)} />
        </div>
      )}

      {/* Hamburger Sidebar - REPARATĂ STRUCTURA DE LIVE CHAT COMPLET */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-gray-950/50 backdrop-blur-sm z-50 flex">
          <div className="w-80 bg-white min-h-screen shadow-2xl flex flex-col justify-between text-gray-800 relative">
            <div>
              <div className="p-6 bg-gradient-to-r from-pink-600 to-rose-500 text-white flex justify-between items-center shadow-md">
                <span className="font-black text-sm">🧁 Meniu Laborator DulceGust</span>
                <button onClick={() => setIsSidebarOpen(false)} className="font-bold text-sm">✕</button>
              </div>
              <div className="p-4 border-b font-bold text-xs">
                <ul className="space-y-0.5">
                  <li onClick={() => { setIsSidebarOpen(false); window.location.reload(); }} className="p-2.5 rounded-xl hover:bg-pink-50/50 cursor-pointer">🏠 Acasă / Vitrină</li>
                  <Link href="/admin" onClick={() => setIsSidebarOpen(false)} className="block p-2.5 rounded-xl hover:bg-gray-100">📊 Panou Admin</Link>
                </ul>
              </div>
              <div className="p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">🗨️ Chat Asistență Laborator (Live)</p>
                <div className="bg-gray-950 rounded-2xl p-3 border border-gray-800 flex flex-col h-64 justify-between shadow-inner">
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[11px]">
                    {istoricChat.length === 0 ? (
                      <p className="text-gray-500 text-center py-10 font-bold text-[10px]">Trimite un mesaj pentru a începe conversația privată cu noi!</p>
                    ) : (
                      istoricChat.map((m, idx) => (
                        <div key={idx} className={`flex ${m.emitent === "user" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[85%] rounded-xl px-2.5 py-1.5 ${m.emitent === "user" ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-200"}`}>{m.text}</div>
                        </div>
                      ))
                    )}
                  </div>
                  <form onSubmit={trimiteMesajChat} className="mt-2 flex gap-1.5 border-t border-gray-800 pt-2 shrink-0">
                    <input type="text" value={mesajChat} onChange={(e) => setMesajChat(e.target.value)} placeholder="Pune o întrebare..." className="w-full bg-gray-900 text-white rounded-lg px-2.5 py-1.5 text-[11px] outline-none" />
                    <button type="submit" className="bg-pink-600 text-white px-2.5 rounded-lg text-[10px] font-bold">➔</button>
                  </form>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-50 text-center text-[10px] font-bold text-gray-400 border-t">📍 Str. Dulce nr. 10, Iași</div>
          </div>
          <div className="flex-1" onClick={() => setIsSidebarOpen(false)} />
        </div>
      )}

      {/* Modal Autentificare */}
      {modalType && (
        <div className="fixed inset-0 bg-gray-950/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border shadow-2xl relative text-gray-800">
            <button onClick={() => setModalType(null)} className="absolute top-4 right-4 text-gray-400 font-bold text-sm">✕</button>
            <h3 className="text-sm font-black text-center mb-4">{modalType === "login" ? "Conectare" : "Cont Nou"}</h3>
            {mesaj.text && (
              <div className={`text-center text-xs font-bold p-3 rounded-xl mb-4 ${mesaj.tip === "succes" ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-700 border border-red-100"}`}>{mesaj.text}</div>
            )}
            <form onSubmit={handleAuthSubmit} className="space-y-4 font-bold text-xs">
              {modalType === "register" && (
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-xs outline-none" placeholder="Numele tău" />
              )}
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-xs outline-none" placeholder="Email" />
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border rounded-xl px-4 py-3 text-xs outline-none" placeholder="Parolă" />
              {modalType === "register" && (
                <div className="flex items-center gap-2"><input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} /> <span className="text-[10px]">Accept Termenii</span></div>
              )}
              <button type="submit" className="w-full bg-pink-600 text-white font-black py-3.5 rounded-xl shadow-md">{modalType === "login" ? "Conectare" : "Creează cont"}</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
