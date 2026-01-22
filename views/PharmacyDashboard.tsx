
import React, { useState, useEffect } from 'react';
import { GlassCard, NeonButton, Badge, MetricCard, NeonInput } from '../components/UI';
import { Pill, AlertTriangle, Package, TrendingDown, RefreshCcw, Search, DollarSign, Plus, Save, X, ArrowUpCircle, CheckCircle } from 'lucide-react';
import { predictStockShortage } from '../services/geminiService';
import { Medicine } from '../types';

const INITIAL_DATA: Medicine[] = [
  { id: '1', name: 'Amoxicilline 500mg', stock: 120, category: 'Antibiotique', price: 3500, expiryDate: '2024-12-01' },
  { id: '2', name: 'Paracétamol 1000mg', stock: 45, category: 'Antalgique', price: 1200, expiryDate: '2025-06-15' },
  { id: '3', name: 'Metformine 850mg', stock: 12, category: 'Antidiabétique', price: 4500, expiryDate: '2024-05-20' },
  { id: '4', name: 'Ibuprofène 400mg', stock: 200, category: 'Anti-inflammatoire', price: 2100, expiryDate: '2025-01-10' },
  { id: '5', name: 'Atorvastatine 20mg', stock: 8, category: 'Cardiovasculaire', price: 8900, expiryDate: '2024-08-30' },
];

const PharmacyDashboard = () => {
  const [inventory, setInventory] = useState<Medicine[]>(INITIAL_DATA);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
  const [newMed, setNewMed] = useState({ name: '', category: '', price: '', stock: '', expiryDate: '' });

  const runPrediction = async () => {
    setLoadingAI(true);
    const inventoryString = inventory.map(i => `${i.name} (Stock: ${i.stock})`).join(', ');
    const resultJson = await predictStockShortage(inventoryString);
    try {
        const parsed = JSON.parse(resultJson);
        setPredictions(parsed);
    } catch (e) {
        console.error("Erreur d'analyse de la réponse IA");
    }
    setLoadingAI(false);
  };

  useEffect(() => {
    runPrediction();
  }, []);

  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMed.name || !newMed.price) return;
    const newItem: Medicine = {
        id: Date.now().toString(),
        name: newMed.name,
        category: newMed.category || 'Général',
        price: Number(newMed.price),
        stock: Number(newMed.stock) || 0,
        expiryDate: newMed.expiryDate || new Date().toISOString().split('T')[0]
    };
    setInventory([...inventory, newItem]);
    setShowAddModal(false);
    setNewMed({ name: '', category: '', price: '', stock: '', expiryDate: '' });
  };

  const handleRestock = (id: string) => {
      setInventory(prev => prev.map(item => item.id === id ? { ...item, stock: item.stock + 10 } : item));
  };

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter leading-none">Pharmacie & Stocks</h1>
            <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Gestion de l'inventaire et des approvisionnements.</p>
        </div>
        <div className="flex gap-3">
            <NeonButton onClick={runPrediction} icon={RefreshCcw} variant="secondary">
                {loadingAI ? 'Analyse...' : 'IA Prévisions'}
            </NeonButton>
            <NeonButton onClick={() => setShowAddModal(true)} icon={Plus} variant="primary">
                Nouveau Produit
            </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Valeur Stock" value={`${inventory.reduce((acc, curr) => acc + (curr.price * curr.stock), 0).toLocaleString()} F`} icon={DollarSign} color="blue" />
        <MetricCard title="Ruptures" value={inventory.filter(i => i.stock < 10).length.toString()} icon={AlertTriangle} color="red" />
        <MetricCard title="Total Références" value={inventory.length.toString()} icon={Package} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <GlassCard className="overflow-hidden border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 border-b border-slate-50 dark:border-slate-800 pb-4">
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center gap-2 uppercase tracking-tight">
                        <Pill size={20} className="text-medical-primary"/> Inventaire Actuel
                    </h3>
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" size={16} />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-10 pr-4 py-2 text-xs font-bold focus:outline-none focus:border-medical-primary dark:text-white transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
                        <thead className="text-[10px] uppercase text-slate-500 dark:text-slate-500 font-black tracking-widest border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-4 py-3">Médicament</th>
                                <th className="px-4 py-3">Catégorie</th>
                                <th className="px-4 py-3 text-right">Prix</th>
                                <th className="px-4 py-3 text-center">Stock</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredInventory.map((med) => (
                                <tr key={med.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-4 py-4 font-black text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                                        {med.name}
                                        {med.stock < 10 && <span className="ml-2 text-[8px] bg-red-100/50 dark:bg-red-900/30 text-red-600 dark:text-red-300 px-1.5 py-0.5 rounded-full font-black animate-pulse">ALERTE</span>}
                                    </td>
                                    <td className="px-4 py-4 text-xs font-bold uppercase text-slate-500 dark:text-slate-500">{med.category}</td>
                                    <td className="px-4 py-4 text-right font-black text-slate-800 dark:text-slate-200">{med.price} F</td>
                                    <td className="px-4 py-4 text-center">
                                        <Badge color={med.stock < 10 ? 'red' : 'green'}>
                                            {med.stock} Unités
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button 
                                            onClick={() => handleRestock(med.id)}
                                            className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all"
                                        >
                                            Rappro. +10
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>

        <div className="lg:col-span-1">
            <GlassCard className="h-full border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-6 text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <TrendingDown size={20} className="text-emerald-500" />
                    <h3 className="font-black uppercase text-sm tracking-tight">IA Analyse</h3>
                </div>
                {loadingAI ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-500 animate-pulse">
                        <RefreshCcw className="animate-spin mb-3" size={24}/>
                        <span className="font-black uppercase text-[9px] tracking-widest">Calcul en cours...</span>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {predictions.length > 0 ? predictions.map((pred: any, idx: number) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm transition-transform hover:translate-x-1">
                                <p className="text-slate-800 dark:text-slate-100 font-black text-sm uppercase">{pred.medicineName}</p>
                                <div className="mt-2">
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${pred.riskLevel === 'Élevé' || pred.riskLevel === 'High' ? 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300' : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300'}`}>Risque {pred.riskLevel}</span>
                                </div>
                                <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-2 font-medium leading-relaxed italic">"{pred.reason}"</p>
                            </div>
                        )) : (
                            <div className="text-center p-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                                <CheckCircle size={32} className="mx-auto text-emerald-500/50 mb-3"/>
                                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Inventaire Optimal</p>
                            </div>
                        )}
                    </div>
                )}
            </GlassCard>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
            <GlassCard className="w-full max-w-md p-8 shadow-2xl relative border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <button onClick={() => setShowAddModal(false)} className="absolute top-6 right-6 text-slate-400 hover:text-red-500 transition-colors">
                    <X size={24} />
                </button>
                <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-8 uppercase tracking-tighter flex items-center gap-2">
                    <Plus size={28} className="text-medical-primary"/> Nouveau Médicament
                </h2>
                <form onSubmit={handleAddMedicine} className="space-y-6">
                    <NeonInput label="Désignation" placeholder="Nom du produit" value={newMed.name} onChange={e => setNewMed({...newMed, name: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                         <NeonInput label="Prix (F)" type="number" value={newMed.price} onChange={e => setNewMed({...newMed, price: e.target.value})} required />
                         <NeonInput label="Stock Initial" type="number" value={newMed.stock} onChange={e => setNewMed({...newMed, stock: e.target.value})} />
                    </div>
                    <div className="pt-4 flex gap-4">
                        <NeonButton type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Annuler</NeonButton>
                        <NeonButton type="submit" variant="primary" icon={Save} className="flex-1">Enregistrer</NeonButton>
                    </div>
                </form>
            </GlassCard>
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
