import React, { useState, useEffect } from 'react';
import { GlassCard, NeonButton, Badge, MetricCard, NeonInput } from '../components/UI';
import { Pill, AlertTriangle, Package, TrendingDown, RefreshCcw, Search, DollarSign, Plus, Save, X, ArrowUpCircle } from 'lucide-react';
import { predictStockShortage } from '../services/geminiService';
import { Medicine } from '../types';

// Données initiales pour la démo
const INITIAL_DATA: Medicine[] = [
  { id: '1', name: 'Amoxicilline 500mg', stock: 120, category: 'Antibiotique', price: 3500, expiryDate: '2024-12-01' },
  { id: '2', name: 'Paracétamol 1000mg', stock: 45, category: 'Antalgique', price: 1200, expiryDate: '2025-06-15' },
  { id: '3', name: 'Metformine 850mg', stock: 12, category: 'Antidiabétique', price: 4500, expiryDate: '2024-05-20' },
  { id: '4', name: 'Ibuprofène 400mg', stock: 200, category: 'Anti-inflammatoire', price: 2100, expiryDate: '2025-01-10' },
  { id: '5', name: 'Atorvastatine 20mg', stock: 8, category: 'Cardiovasculaire', price: 8900, expiryDate: '2024-08-30' },
];

const PharmacyDashboard = () => {
  // --- STATES ---
  const [inventory, setInventory] = useState<Medicine[]>(INITIAL_DATA);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Medicine | null>(null);
  
  // Forms Data
  const [newMed, setNewMed] = useState({ name: '', category: '', price: '', stock: '', expiryDate: '' });
  const [restockQty, setRestockQty] = useState('');

  // --- ACTIONS ---

  // 1. AI Prediction
  const runPrediction = async () => {
    setLoadingAI(true);
    // On utilise l'état actuel de l'inventaire pour l'IA
    const inventoryString = inventory.map(i => `${i.name} (Stock: ${i.stock})`).join(', ');
    const resultJson = await predictStockShortage(inventoryString);
    try {
        const parsed = JSON.parse(resultJson);
        setPredictions(parsed);
    } catch (e) {
        console.error("Failed to parse AI response");
    }
    setLoadingAI(false);
  };

  useEffect(() => {
    runPrediction();
  }, []); // Run on mount

  // 2. Add Medicine
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

  // 3. Restock
  const openRestock = (item: Medicine) => {
      setSelectedItem(item);
      setRestockQty('');
      setShowRestockModal(true);
  };

  const handleRestock = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedItem || !restockQty) return;

      const updatedInventory = inventory.map(item => {
          if (item.id === selectedItem.id) {
              return { ...item, stock: item.stock + Number(restockQty) };
          }
          return item;
      });

      setInventory(updatedInventory);
      setShowRestockModal(false);
      setSelectedItem(null);
  };

  // Filter Logic
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-sans font-bold text-slate-800">Pharmacie & Stocks</h1>
            <p className="text-slate-500">Gestion de l'inventaire et des approvisionnements.</p>
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

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title="Valeur Stock" value={`${inventory.reduce((acc, curr) => acc + (curr.price * curr.stock), 0).toLocaleString()} F`} icon={DollarSign} color="blue" />
        <MetricCard title="Ruptures" value={inventory.filter(i => i.stock < 10).length.toString()} icon={AlertTriangle} color="red" />
        <MetricCard title="Total Références" value={inventory.length.toString()} icon={Package} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Table */}
        <div className="lg:col-span-2">
            <GlassCard>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Pill size={20} className="text-medical-primary"/> Inventaire
                    </h3>
                    <div className="relative w-64">
                        <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Rechercher..." 
                            className="w-full bg-slate-50 border border-slate-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-medical-primary transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="text-xs uppercase bg-slate-50 text-slate-500 font-semibold">
                            <tr>
                                <th className="px-4 py-3 border-b border-slate-200">Médicament</th>
                                <th className="px-4 py-3 border-b border-slate-200">Catégorie</th>
                                <th className="px-4 py-3 border-b border-slate-200 text-right">Prix</th>
                                <th className="px-4 py-3 border-b border-slate-200 text-center">Stock</th>
                                <th className="px-4 py-3 border-b border-slate-200 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredInventory.map((med) => (
                                <tr key={med.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-slate-800">
                                        {med.name}
                                        {med.stock < 10 && <span className="ml-2 text-[10px] bg-red-100 text-red-600 px-1 rounded font-bold">BAS</span>}
                                    </td>
                                    <td className="px-4 py-3">{med.category}</td>
                                    <td className="px-4 py-3 text-right font-bold text-slate-800">{med.price} F</td>
                                    <td className="px-4 py-3 text-center">
                                        <Badge color={med.stock < 10 ? 'red' : 'green'}>
                                            {med.stock}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <button 
                                            onClick={() => openRestock(med)}
                                            className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded hover:bg-emerald-600 hover:text-white transition-colors flex items-center gap-1 ml-auto"
                                        >
                                            <ArrowUpCircle size={14}/> Stock +
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredInventory.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-slate-400">Aucun médicament trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>

        {/* AI Predictions Sidebar */}
        <div className="lg:col-span-1">
            <GlassCard className="h-full border-purple-200 bg-purple-50/30">
                <div className="flex items-center gap-2 mb-4 text-purple-700">
                    <TrendingDown size={20} />
                    <h3 className="font-bold">Prévisions Ruptures (IA)</h3>
                </div>
                {loadingAI ? (
                    <div className="flex flex-col items-center justify-center h-40 text-purple-400 animate-pulse font-medium">
                        <RefreshCcw className="animate-spin mb-2" size={24}/>
                        Analyse des tendances...
                    </div>
                ) : (
                    <div className="space-y-3">
                        {predictions.length > 0 ? predictions.map((pred: any, idx: number) => (
                            <div key={idx} className="bg-white p-3 rounded-lg border-l-4 border-purple-500 shadow-sm">
                                <p className="text-slate-800 font-bold text-sm">{pred.medicineName}</p>
                                <div className="flex justify-between items-center mt-1">
                                    <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded">{pred.riskLevel} Risque</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2 italic">{pred.reason}</p>
                            </div>
                        )) : (
                            <div className="text-center p-6 text-slate-500">
                                <p className="text-sm">Aucun risque immédiat détecté par l'IA basé sur les stocks actuels.</p>
                            </div>
                        )}
                    </div>
                )}
            </GlassCard>
        </div>
      </div>

      {/* --- MODAL: AJOUTER MEDICAMENT --- */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <GlassCard className="w-full max-w-md p-6 shadow-2xl relative">
                <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Plus size={24} className="text-medical-primary"/> Nouveau Médicament
                </h2>
                <form onSubmit={handleAddMedicine} className="space-y-4">
                    <NeonInput 
                        label="Nom du médicament" 
                        placeholder="Ex: Doliprane 1000mg" 
                        value={newMed.name} 
                        onChange={e => setNewMed({...newMed, name: e.target.value})}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                         <NeonInput 
                            label="Catégorie" 
                            placeholder="Ex: Antalgique" 
                            value={newMed.category} 
                            onChange={e => setNewMed({...newMed, category: e.target.value})}
                        />
                         <NeonInput 
                            label="Date Expiration" 
                            type="date"
                            value={newMed.expiryDate} 
                            onChange={e => setNewMed({...newMed, expiryDate: e.target.value})}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <NeonInput 
                            label="Prix Unitaire (F)" 
                            type="number"
                            placeholder="0" 
                            value={newMed.price} 
                            onChange={e => setNewMed({...newMed, price: e.target.value})}
                            required
                        />
                         <NeonInput 
                            label="Stock Initial" 
                            type="number"
                            placeholder="0" 
                            value={newMed.stock} 
                            onChange={e => setNewMed({...newMed, stock: e.target.value})}
                        />
                    </div>
                    <div className="pt-4 flex gap-3">
                        <NeonButton type="button" variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Annuler</NeonButton>
                        <NeonButton type="submit" variant="primary" icon={Save} className="flex-1">Enregistrer</NeonButton>
                    </div>
                </form>
            </GlassCard>
        </div>
      )}

      {/* --- MODAL: RESTOCK --- */}
      {showRestockModal && selectedItem && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <GlassCard className="w-full max-w-sm p-6 shadow-2xl relative">
                <button onClick={() => setShowRestockModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-2">Réapprovisionnement</h2>
                <p className="text-sm text-slate-500 mb-6">Ajouter du stock pour <span className="font-bold text-medical-primary">{selectedItem.name}</span></p>
                
                <form onSubmit={handleRestock} className="space-y-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center mb-4">
                        <span className="block text-xs uppercase text-slate-400 font-bold">Stock Actuel</span>
                        <span className="block text-3xl font-black text-slate-800">{selectedItem.stock}</span>
                    </div>

                    <NeonInput 
                        label="Quantité reçue (+)" 
                        type="number" 
                        placeholder="Ex: 50" 
                        autoFocus
                        value={restockQty} 
                        onChange={e => setRestockQty(e.target.value)}
                        required
                        min="1"
                    />

                    <div className="pt-4 flex gap-3">
                        <NeonButton type="button" variant="secondary" onClick={() => setShowRestockModal(false)} className="flex-1">Annuler</NeonButton>
                        <NeonButton type="submit" variant="primary" icon={ArrowUpCircle} className="flex-1">Confirmer</NeonButton>
                    </div>
                </form>
            </GlassCard>
         </div>
      )}

    </div>
  );
};

export default PharmacyDashboard;