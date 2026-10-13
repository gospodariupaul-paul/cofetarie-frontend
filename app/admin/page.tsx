"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Comanda {
  id: string;
  clientName: string;
  phone: string;
  totalAmount: number;
  createdAt: string;
}

interface Produs {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  icon?: string;
  tag?: string;
}

interface MesajChatAdmin {
  id?: string;
  userId: string;
  userName: string;
  emitent: "user" | "suport";
  text: string;
  createdAt?: string;
}

export default function AdminDashboard() {
  const [esteAdmin, setEsteAdmin] = useState<boolean>(false);
  const [codAcces, setCodAcces] = useState<string>("");
  const [comenzi, setComenzi] = useState<Comanda[]>([]);
  const [produse, setProduse] = useState<Produs[]>([]);
  const [incarcare, setIncarcare] = useState<boolean>(true);
  const [eroare, setEroare] = useState<string | null>(null);

  const [idProdusEditat, setIdProdusEditat] = useState<string | null>(null);
  const [numeProdus, setNumeProdus] = useState("");
  const [descriereProdus, setDescriereProdus] = useState("");
  const [pretProdus, setPretProdus] = useState("");
  const [categorieProdus, setCategorieProdus] = useState("torturi");
  const [imagineBase64, setImagineBase64] = useState("");
  const [tagProdus, setTagProdus] = useState("");
  const [seTrimite, setSeTrimite] = useState(false);

  // NOU: Gestiune Camere Chat Separate pentru Admin
  const [toateMesajeleBaza, setToateMesajeleBaza] = useState<MesajChatAdmin[]>([]);
  const [clientSelectatChat, setClientSelectatChat] = useState<string | null>(null);
  const [textRaspunsAdmin, setTextRaspunsAdmin] = useState("");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://onrender.com";

  const handleLoginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (codAcces === "admin1234") {
      setEsteAdmin(true);
      localStorage.setItem("role_admin", "true");
    } else {
      alert("Cod de acces incorect!");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("role_admin") === "true") {
      setEsteAdmin(true);
    }
  }, []);
  const incarcaDateleAdmin = async () => {
    try {
      const resProd = await fetch(`${API_URL}/api/produse`);
      const dateProd = await resProd.json();
      setProduse(dateProd || []);

      const resCom = await fetch(`${API_URL}/api/comenzi`);
      if (resCom.ok) {
        const dateCom = await resCom.json();
        setComenzi(dateCom || []);
      }
    } catch (err) {
      console.error("Eroare preluare date admin:", err);
      setEroare("Nu s-au putut încărca datele din baza de date Neon.");
    } finally {
      setIncarcare(false);
    }
  };

  // NOU: Descarcă automat absolut toate mesajele din Neon la fiecare 3 secunde pentru a crea camerele
  useEffect(() => {
    if (!esteAdmin) return;
    
    const preiaToateMesajeleChat = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat`);
        if (res.ok) {
          const dateChat = await res.json();
          setToateMesajeleBaza(dateChat || []);
        }
      } catch (err) {
        console.error("Eroare preluare chat global admin:", err);
      }
    };

    preiaToateMesajeleChat();
    const intervalChat = setInterval(preiaToateMesajeleChat, 3000);
    return () => clearInterval(intervalChat);
  }, [esteAdmin, API_URL]);

  useEffect(() => {
    if (!esteAdmin) return;
    incarcaDateleAdmin();
  }, [esteAdmin]);

  // Filtrăm mesajele pe ecran doar pentru camera selectată (clientul selectat)
  const mesajeCameraCurenta = toateMesajeleBaza.filter((m) => m.userId === clientSelectatChat);

  // Extragem o listă unică cu clienții care au trimis mesaje (pentru meniul stâng de camere)
  const clientiUniciCuMesaje = Array.from(new Set(toateMesajeleBaza.map((m) => m.userId))).map((id) => {
    const gasit = toateMesajeleBaza.find((m) => m.userId === id);
    return { userId: id, userName: gasit?.userName || "Client" };
  });

  const handleImagineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fisier = e.target.files?.[0];
    if (fisier) {
      const cititor = new FileReader();
      if (fisier.size / 1024 > 1500) {
        alert("Imaginea este prea mare! Maximum 1.5 MB.");
        e.target.value = "";
        return;
      }
      cititor.onloadend = () => setImagineBase64(cititor.result as string);
      cititor.readAsDataURL(fisier);
    }
  };
  const handleSelecteazaProdusPentruEditare = (p: Produs) => {
    setIdProdusEditat(p.id);
    setNumeProdus(p.name);
    setDescriereProdus(p.description || "");
    setPretProdus(p.price.toString());
    setCategorieProdus(p.category);
    setImagineBase64(p.icon || "");
    setTagProdus(p.tag || "");
  };

  const handleAnuleazaEditarea = () => {
    setIdProdusEditat(null);
    setNumeProdus("");
    setDescriereProdus("");
    setPretProdus("");
    setCategorieProdus("torturi");
    setImagineBase64("");
    setTagProdus("");
  };

  const handleSalveazaSauModificaProdus = async (e: React.FormEvent) => {
    e.preventDefault();
    setSeTrimite(true);

    const urlFinal = idProdusEditat ? `${API_URL}/api/produse/${idProdusEditat}` : `${API_URL}/api/produse`;
    const metoda = idProdusEditat ? "PUT" : "POST";

    try {
      const res = await fetch(urlFinal, {
        method: metoda,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: numeProdus,
          description: descriereProdus,
          price: parseFloat(pretProdus),
          category: categorieProdus,
          icon: imagineBase64 || "🧁",
          tag: tagProdus || undefined,
        }),
      });

      if (!res.ok) throw new Error("Operațiune respinsă.");
      alert("Salvat cu succes! ✨");
      handleAnuleazaEditarea();
      incarcaDateleAdmin();
    } catch (err: any) {
      alert(`Eroare: ${err.message}`);
    } finally {
      setSeTrimite(false);
    }
  };

  const handleStergeProdus = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Ștergi acest produs?")) return;

    try {
      const res = await fetch(`${API_URL}/api/produse/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Eroare ștergere.");
      alert("Eliminat! 🗑️");
      if (idProdusEditat === id) handleAnuleazaEditarea();
      incarcaDateleAdmin();
    } catch (err: any) {
      alert(`Eroare: ${err.message}`);
    }
  };

  // Trimite răspunsul către clientul selectat în Neon PostgreSQL
  const handleTrimiteRaspunsChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textRaspunsAdmin.trim() || !clientSelectatChat) return;

    const gasitNume = toateMesajeleBaza.find((m) => m.userId === clientSelectatChat);

    const raspunsNou = {
      userId: clientSelectatChat,
      userName: gasitNume?.userName || "Client",
      emitent: "suport" as const,
      text: textRaspunsAdmin
    };

    setToateMesajeleBaza((prev) => [...prev, raspunsNou]);
    const textDeTrimis = textRaspunsAdmin;
    setTextRaspunsAdmin("");

    try {
      await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(raspunsNou),
      });
    } catch (err) {
      console.error("Eroare salvare răspuns admin:", err);
    }
  };
  if (!esteAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
          <h2 className="text-xl font-black text-center mb-4">DulceGust OS</h2>
          <form onSubmit={handleLoginAdmin} className="space-y-4">
            <input type="password" required value={codAcces} onChange={(e) => setCodAcces(e.target.value)} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 text-xs outline-none" placeholder="Cod master admin" />
            <button type="submit" className="w-full bg-pink-600 text-white font-bold py-3 rounded-xl">Intră în Panou</button>
          </form>
        </div>
      </div>
    );
  }

  const totalIncasat = comenzi.reduce((sum, c) => sum + (c.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Dashboard 📊</h1>
            <p className="text-xs text-gray-400 mt-1">Gestiunea în timp real a bazei de date Neon PostgreSQL</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="bg-gray-900 border border-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl transition">🏠 Vezi Site</Link>
            <button onClick={() => { localStorage.removeItem("role_admin"); setEsteAdmin(false); }} className="bg-red-950 text-red-400 text-xs font-bold px-4 py-2.5 rounded-xl">🔒 Ieșire</button>
          </div>
        </div>

        {/* KPI-uri */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { titlu: "Total Comenzi", valoare: comenzi.length, icon: "📦" },
            { titlu: "Încasări Totale", valoare: `${totalIncasat} LEI`, icon: "💰" },
            { titlu: "Produse Active", valoare: produse.length, icon: "🍰" },
            { titlu: "Status Core", valoare: "ONLINE", icon: "⚡" }
          ].map((kpi, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">{kpi.titlu}</p>
                <p className="text-2xl font-black text-white mt-1">{kpi.valoare}</p>
              </div>
              <span className="text-2xl bg-gray-950 h-10 w-10 rounded-xl flex items-center justify-center">{kpi.icon}</span>
            </div>
          ))}
        </div>
        {/* Grid Split pe 4 Coloane */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Formular adăugare */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm h-fit">
            <h3 className="text-xs font-black text-white mb-4">{idProdusEditat ? "📝 Modifică Produs" : "➕ Încarcă Produs"}</h3>
            <form onSubmit={handleSalveazaSauModificaProdus} className="space-y-4 text-xs font-bold">
              <input type="text" required value={numeProdus} onChange={(e) => setNumeProdus(e.target.value)} className="w-full bg-gray-950 border text-white rounded-xl px-4 py-3 outline-none" placeholder="Nume" />
              <textarea required value={descriereProdus} onChange={(e) => setDescriereProdus(e.target.value)} rows={2} className="w-full bg-gray-950 border text-white rounded-xl px-4 py-3 outline-none resize-none" placeholder="Descriere..." />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" required value={pretProdus} onChange={(e) => setPretProdus(e.target.value)} className="w-full bg-gray-950 border text-white rounded-xl px-3 py-2.5" placeholder="Preț" />
                <input type="file" accept="image/*" onChange={handleImagineChange} className="w-full bg-gray-950 text-gray-400 text-[10px]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select value={categorieProdus} onChange={(e) => setCategorieProdus(e.target.value)} className="w-full bg-gray-950 border text-white rounded-xl px-3 py-2.5"><option value="torturi">Torturi</option><option value="prajituri">Prăjituri</option></select>
                <input type="text" value={tagProdus} onChange={(e) => setTagProdus(e.target.value)} className="w-full bg-gray-950 border text-white rounded-xl px-3 py-2.5" placeholder="Tag" />
              </div>
              <button type="submit" className="w-full bg-pink-600 text-white font-black py-3 rounded-xl">{seTrimite ? "Se salvează..." : "🚀 Pune pe Site"}</button>
            </form>
          </div>

          {/* Comenzi */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-fit">
            <h3 className="text-sm font-black text-white mb-4">🛒 Flux Comenzi</h3>
            <table className="w-full text-left text-xs">
              <tbody className="divide-y divide-gray-800">
                {comenzi.map((c) => (
                  <tr key={c.id} className="text-gray-300">
                    <td className="py-2.5 font-bold text-white truncate max-w-[80px]">{c.clientName}</td>
                    <td className="py-2.5 text-right font-black text-green-400">{c.totalAmount} LEI</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Inventar Produse */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-fit">
            <h3 className="text-sm font-black text-white mb-4">📋 Inventar Produse</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {produse.map((p) => (
                <div key={p.id} onClick={() => handleSelecteazaProdusPentruEditare(p)} className="p-2 bg-gray-950 border rounded-xl flex justify-between items-center text-xs font-bold cursor-pointer hover:bg-gray-800">
                  <p className="text-white truncate max-w-[120px] pointer-events-none">{p.name}</p>
                  <div className="flex items-center gap-2 pointer-events-auto">
                    <span className="text-gray-400">{p.price}L</span>
                    <button onClick={(e) => handleStergeProdus(p.id, e)} className="text-red-500">🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CHAT CHIRURGICAL PE CAMERE INDIVIDUALE DE CLIENȚI */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 flex flex-col justify-between h-[450px]">
            <div>
              <h3 className="text-sm font-black text-white mb-3">💬 Suport Clienți (Camere Live)</h3>
              
              {/* Selectorul de Camere active de Clienți */}
              <div className="flex gap-1.5 overflow-x-auto pb-2 border-b border-gray-800 mb-3">
                {clientiUniciCuMesaje.length === 0 ? <span className="text-[10px] text-gray-500 font-bold">Nicio cameră activă.</span> :
                  clientiUniciCuMesaje.map((c) => (
                    <button 
                      key={c.userId} 
                      onClick={() => setClientSelectatChat(c.userId)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight shrink-0 transition ${
                        clientSelectatChat === c.userId ? "bg-pink-600 text-white shadow" : "bg-gray-950 text-gray-400 hover:text-gray-200"
                      }`}
                    >
                      {c.userName.split("@")[0]}
                    </button>
                  ))
                }
              </div>

              {/* Istoricul camerei selectate */}
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 flex flex-col gap-1">
                {!clientSelectatChat ? (
                  <p className="text-center text-[10px] text-gray-500 font-bold py-10">Alege o cameră de sus pentru a discuta live cu clientul!</p>
                ) : mesajeCameraCurenta.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.emitent === "suport" ? "items-end" : "items-start"}`}>
                    <div className={`max-w-[85%] rounded-xl px-2.5 py-1.5 text-[11px] font-medium ${
                      m.emitent === "suport" ? "bg-pink-600 text-white" : "bg-gray-800 text-gray-200"
                    }`}>{m.text}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Formular răspuns în camera curentă */}
            <form onSubmit={handleTrimiteRaspunsChat} className="mt-3 flex gap-1.5 border-t border-gray-800/60 pt-2">
              <input type="text" disabled={!clientSelectatChat} value={textRaspunsAdmin} onChange={(e) => setTextRaspunsAdmin(e.target.value)} placeholder={clientSelectatChat ? "Răspunde în această cameră..." : "Selectează o cameră mai întâi..."} className="w-full bg-gray-950 border rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-pink-500 disabled:opacity-40" />
              <button type="submit" disabled={!clientSelectatChat} className="bg-pink-600 text-white px-3 rounded-lg text-xs font-black disabled:opacity-40">➔</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
