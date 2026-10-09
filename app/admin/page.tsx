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

export default function AdminDashboard() {
  const [esteAdmin, setEsteAdmin] = useState<boolean>(false);
  const [codAcces, setCodAcces] = useState<string>("");
  const [comenzi, setComenzi] = useState<Comanda[]>([]);
  const [produse, setProduse] = useState<Produs[]>([]);
  const [incarcare, setIncarcare] = useState<boolean>(true);
  const [eroare, setEroare] = useState<string | null>(null);

  // Statut pentru Editare / Modificare
  const [idProdusEditat, setIdProdusEditat] = useState<string | null>(null);

  // Formular produs
  const [numeProdus, setNumeProdus] = useState("");
  const [descriereProdus, setDescriereProdus] = useState("");
  const [pretProdus, setPretProdus] = useState("");
  const [categorieProdus, setCategorieProdus] = useState("torturi");
  const [imagineBase64, setImagineBase64] = useState("");
  const [tagProdus, setTagProdus] = useState("");
  const [seTrimite, setSeTrimite] = useState(false);

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
      setProduse(dateProd);

      const resCom = await fetch(`${API_URL}/api/comenzi`);
      if (resCom.ok) {
        const dateCom = await resCom.json();
        setComenzi(dateCom.date || dateCom || []);
      }
    } catch (err) {
      console.error("Eroare preluare date admin:", err);
      setEroare("Nu s-au putut încărca datele din baza de date Neon.");
    } finally {
      setIncarcare(false);
    }
  };

  useEffect(() => {
    if (!esteAdmin) return;
    incarcaDateleAdmin();
  }, [esteAdmin, API_URL]);

  const handleImagineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fisier = e.target.files?.[0];
    if (fisier) {
      const cititor = new FileReader();
      if (fisier.size / 1024 > 1500) {
        alert("Imaginea este prea mare! Alege o poză de maximum 1.5 MB.");
        e.target.value = "";
        return;
      }
      cititor.onloadend = () => {
        setImagineBase64(cititor.result as string);
      };
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

      if (!res.ok) throw new Error("Backend-ul a respins operațiunea.");

      alert(idProdusEditat ? "Modificările au fost salvate în mod real! ✨" : "Produs nou adăugat! 🎉");
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
    if (!confirm("Sigur vrei să ștergi definitiv acest produs din baza de date Neon?")) return;

    try {
      const res = await fetch(`${API_URL}/api/produse/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Nu s-a putut efectua ștergerea.");
      alert("Produsul a fost eliminat complet! 🗑️");
      if (idProdusEditat === id) handleAnuleazaEditarea();
      incarcaDateleAdmin();
    } catch (err: any) {
      alert(`Eroare la ștergere: ${err.message}`);
    }
  };
  if (!esteAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center p-6">
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-4xl">🔐</span>
            <h2 className="text-2xl font-black mt-2">DulceGust OS</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">Panou Securizat Admin</p>
          </div>
          <form onSubmit={handleLoginAdmin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 tracking-wider block mb-1 uppercase">Cod Acces Master</label>
              <input type="password" required value={codAcces} onChange={(e) => setCodAcces(e.target.value)} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 text-xs outline-none focus:border-pink-500" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs py-3.5 rounded-xl transition">Deblochează Panoul</button>
          </form>
          <div className="text-center mt-6">
            <Link href="/" className="text-xs text-gray-500 hover:text-pink-400 font-bold transition">← Înapoi în cofetărie</Link>
          </div>
        </div>
      </div>
    );
  }

  const totalIncasat = comenzi.reduce((sum, c) => sum + (c.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-800 pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Dashboard 📊</h1>
            <p className="text-xs text-gray-400 font-medium mt-1">Gestiunea în timp real a bazei de date Neon PostgreSQL</p>
          </div>
          <div className="flex gap-3">
            <Link href="/" className="bg-gray-900 border border-gray-800 hover:bg-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl transition flex items-center">🏠 Vezi Site-ul</Link>
            <button onClick={() => { localStorage.removeItem("role_admin"); setEsteAdmin(false); }} className="bg-red-950 border border-red-900/50 text-red-400 hover:bg-red-900 text-xs font-bold px-4 py-2.5 rounded-xl transition">🔒 Închide Sesiunea</button>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { titlu: "Total Comenzi", valoare: comenzi.length, icon: "📦", culoare: "text-blue-500" },
            { titlu: "Încasări Totale", valoare: `${totalIncasat} LEI`, icon: "💰", culoare: "text-green-500" },
            { titlu: "Produse Active", valoare: produse.length, icon: "🍰", culoare: "text-pink-500" },
            { titlu: "Status Server", valoare: "ONLINE", icon: "⚡", culoare: "text-orange-500" }
          ].map((kpi, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 p-5 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{kpi.titlu}</p>
                <p className={`text-2xl font-black mt-1 ${kpi.culoare}`}>{kpi.valoare}</p>
              </div>
              <span className="text-3xl bg-gray-950/60 h-12 w-12 rounded-xl flex items-center justify-center border border-gray-800/40">{kpi.icon}</span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm h-fit">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>{idProdusEditat ? "📝" : "➕"}</span> 
                {idProdusEditat ? "Modifică Produsul" : "Încarcă Produs Nou"}
              </h3>
              {idProdusEditat && (
                <button onClick={handleAnuleazaEditarea} className="text-[10px] bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded-md text-gray-400 font-bold uppercase">Anulează</button>
              )}
            </div>
            
            <form onSubmit={handleSalveazaSauModificaProdus} className="space-y-4 text-xs font-bold">
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Nume Produs</label>
                <input type="text" required value={numeProdus} onChange={(e) => setNumeProdus(e.target.value)} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-pink-500" placeholder="Ex: Tort Amaretto" />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 uppercase block mb-1">Descriere</label>
                <textarea required value={descriereProdus} onChange={(e) => setDescriereProdus(e.target.value)} rows={2} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-pink-500 resize-none" placeholder="Ingrediente..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Preț (LEI)</label>
                  <input type="number" required value={pretProdus} onChange={(e) => setPretProdus(e.target.value)} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-pink-500" placeholder="140" />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Schimbă Imaginea</label>
                  <input type="file" accept="image/*" onChange={handleImagineChange} className="w-full bg-gray-950 border border-gray-800 text-gray-400 rounded-xl px-2 py-2 outline-none focus:border-pink-500 text-[10px] file:mr-2 file:bg-pink-600 file:text-white file:rounded-md file:border-0 file:font-bold file:text-[9px] file:py-1 file:px-2" />
                </div>
              </div>

              {imagineBase64 && (
                <div className="mt-2 p-2 bg-gray-950 border border-gray-800 rounded-xl flex items-center gap-3">
                  <img src={imagineBase64} alt="Preview" className="w-12 h-12 object-cover rounded-lg border border-gray-800" />
                  <span className="text-[10px] text-green-400 font-bold">✓ Imagine pregătită!</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Categorie</label>
                  <select value={categorieProdus} onChange={(e) => setCategorieProdus(e.target.value)} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-pink-500">
                    <option value="torturi">Torturi</option>
                    <option value="prajituri">Prăjituri</option>
                    <option value="tech-deals">Tech-Deals</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 uppercase block mb-1">Tag Special</label>
                  <input type="text" value={tagProdus} onChange={(e) => setTagProdus(e.target.value)} className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-pink-500" placeholder="Ex: Best Seller" />
                </div>
              </div>
              <button type="submit" disabled={seTrimite} className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-800 text-white font-black py-3 rounded-xl transition shadow-md">
                {seTrimite ? "Se salvează în Neon..." : idProdusEditat ? "💾 Salvează Modificările" : "🚀 Pune Produsul pe Site"}
              </button>
            </form>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm h-fit">
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <span>🛒</span> Flux Comenzi Recente
            </h3>
            {incarcare ? (
              <p className="text-xs text-gray-500 font-bold py-6">Se citesc datele...</p>
            ) : comenzi.length === 0 ? (
              <p className="text-xs text-gray-500 font-bold py-6">Fără comenzi active.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-gray-800 text-gray-400 font-bold uppercase">
                      <th className="pb-3">Client</th>
                      <th className="pb-3 text-right">Valoare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {comenzi.map((c) => (
                      <tr key={c.id} className="text-gray-300">
                        <td className="py-3 font-bold text-white">{c.clientName}</td>
                        <td className="py-3 text-right font-black text-green-400">{c.totalAmount} LEI</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                <span>📋</span> Produse în Meniu (Click pe căsuță)
              </h3>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {produse.map((p) => (
                  <div 
                    key={p.id} 
                    onClick={() => handleSelecteazaProdusPentruEditare(p)}
                    className={`p-3 rounded-xl flex justify-between items-center text-xs font-bold border transition cursor-pointer ${
                      idProdusEditat === p.id 
                        ? "bg-pink-950/40 border-pink-500 shadow" 
                        : "bg-gray-950 border-gray-800/60 hover:bg-gray-800/40 hover:border-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1 pointer-events-none">
                      <div className="w-8 h-7 bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden border border-gray-800 shrink-0">
                        {p.icon && p.icon.startsWith("data:image") ? (
                          <img src={p.icon} alt={p.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-base">{p.icon || "🧁"}</span>
                        )}
                      </div>
                      <div className="truncate flex-1">
                        <p className="text-white truncate">{p.name}</p>
                        <span className="text-[9px] text-pink-500 uppercase tracking-widest mt-0.5 block">{p.category}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <p className="text-gray-300">{p.price} LEI</p>
                      <button 
                        onClick={(e) => handleStergeProdus(p.id, e)}
                        className="p-2 bg-red-950/40 hover:bg-red-900 border border-red-900/50 hover:border-red-600 rounded-lg text-red-400 hover:text-white transition shadow-sm pointer-events-auto"
                        title="Șterge definitiv"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800 text-center text-[10px] font-bold text-gray-600 tracking-wider">
              DULCEGUST METRICS CORE v1.3
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
