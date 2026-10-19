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
  const [listaProduse, setListaProduse] = useState<Produs[]>([]); // Stocăm produsele pentru redirecționare instantă
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalType, setModalType] = useState<"login" | "register" | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<"favorites" | "notifications" | "profile" | null>(null);

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

  // Încărcăm lista de produse la inițializare pentru a putea face verificarea numelui
  useEffect(() => {
    async function preiaProdusele() {
      try {
        const res = await fetch(`${API_URL}/api/produse`);
        if (res.ok) {
          const date = await res.json();
          setListaProduse(date || []);
        }
      } catch (err) {
        console.error("Eroare preluare produse în Navbar:", err);
      }
    }
    preiaProdusele();
  }, [API_URL]);

  const handleSearchChange = (valoare: string) => {
    setSearchQuery(valoare);
    if (!valoare.trim()) {
      router.push("/");
    }
  };
  // REPARATĂ INTELIGENT: Funcție care caută produsul scris și te redirecționează direct pe pagina lui dedicată
  const executaCautareSauRedirectionare = (textCautat: string) => {
    if (!textCautat.trim()) {
      router.push("/");
      return;
    }

    // Căutăm o potrivire ideală în lista de prăjituri și torturi din Neon
    const produsGasit = listaProduse.find((p) => 
      p.name.toLowerCase().trim() === textCautat.toLowerCase().trim() ||
      p.name.toLowerCase().trim().includes(textCautat.toLowerCase().trim())
    );

    // Dacă utilizatorul a scris numele specific al unui produs existent, îl trimitem direct pe pagina lui
    if (produsGasit) {
      router.push(`/produs/${produsGasit.id}`);
    } else {
      // Altfel, dacă a scris un termen general, aplicăm filtrarea clasică pe prima pagină
      router.push(`/?search=${encodeURIComponent(textCautat)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executaCautareSauRedirectionare(searchQuery);
    }
  };

  const handleApasareLupa = () => {
    executaCautareSauRedirectionare(searchQuery);
  };

  useEffect(() => {
    if (!isSidebarOpen) return;
    const ID_CLIENT = user?.email || "vizitator_anonim";
    const preiaMesajeDinBazaDeDate = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat?userId=${ID_CLIENT}`);
        if (res.ok) {
          const date = await res.json();
          setIstoricChat(date || []);
        }
      } catch (err) {
        console.error("Eroare citire chat client:", err);
      }
    };
    preiaMesajeDinBazaDeDate();
    const intervalMesaje = setInterval(preiaMesajeDinBazaDeDate, 3000);
    return () => clearInterval(intervalMesaje);
  }, [isSidebarOpen, user, API_URL]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user_real");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (localStorage.getItem("deschide_hamburger_chat") === "true") {
      setIsSidebarOpen(true);
      const sugestie = localStorage.getItem("chat_sugestie");
      if (sugestie) setMesajChat(sugestie);
      localStorage.removeItem("deschide_hamburger_chat");
      localStorage.removeItem("chat_sugestie");
    }
  }, []);
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalType === "register" && !agreeTerms) return;
    setMesaj({ text: "Se procesează...", tip: "info" });
    const endpoint = modalType === "login" ? "/api/login" : "/api/register";
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: modalType === "register" ? name : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare.");
      if (modalType === "login") {
        const loggedUser = { email: email, name: data.user?.name || "Client" };
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

          {/* Adăugat onKeyDown pentru a asculta tasta Enter */}
          <div className="relative w-full max-w-md">
            <input 
              type="text" 
              placeholder="Caută produse..." 
              value={searchQuery} 
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full rounded-2xl bg-white pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 outline-none border-none font-bold shadow-sm" 
            />
            <svg 
              onClick={handleApasareLupa}
              className="absolute left-4 top-3.5 h-4 w-4 text-gray-400 hover:text-pink-600 cursor-pointer transition-colors" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://w3.org"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-4 relative">
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-xl text-pink-100 hover:bg-white/10 transition text-lg">💬</button>
              <div onClick={() => setIsCartOpen(true)} className="relative cursor-pointer p-2 rounded-xl text-pink-100 hover:bg-white/10 text-lg">
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

      {/* Pop-up coș și Sidebar chat rămân active dedesubt neschimbate */}
    </>
  );
}
