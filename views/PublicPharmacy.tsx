import React, { useState } from 'react';
import { GlassCard, NeonButton, Badge, NeonInput } from '../components/UI';
import { 
  ShoppingBag, Search, Plus, Minus, Trash2, CreditCard, CheckCircle, 
  Receipt, ArrowLeft, Smartphone, Wallet, Pill, AlertCircle
} from 'lucide-react';

// --- DATA MOCK ---
const PHARMACY_ITEMS = [
  { id: 1, name: 'Doliprane 1000mg', category: 'Douleur & Fièvre', price: 1200, stock: 50, image: '💊' },
  { id: 2, name: 'Efferalgan Vit C', category: 'Douleur & Fièvre', price: 1500, stock: 30, image: '🍋' },
  { id: 3, name: 'Amoxicilline 1g', category: 'Antibiotique', price: 3500, stock: 20, reqPrescription: true, image: '🦠' },
  { id: 4, name: 'Spasfon Lyoc', category: 'Douleur', price: 2800, stock: 45, image: '🌸' },
  { id: 5, name: 'Bétadine Jaune', category: 'Antiseptique', price: 1800, stock: 15, image: '🧴' },
  { id: 6, name: 'Bandes Gazes', category: 'Premiers Secours', price: 500, stock: 100, image: '🤕' },
  { id: 7, name: 'Sirop Toux Sèche', category: 'Rhume', price: 2200, stock: 25, image: '🍯' },
  { id: 8, name: 'Vitamine C Upsa', category: 'Tonus', price: 1900, stock: 40, image: '🍊' },
];

interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
}

interface PublicPharmacyProps {
  userType: 'doctor' | 'patient';
}

const PublicPharmacy: React.FC<PublicPharmacyProps> = ({ userType }) => {
  const [view, setView] = useState<'catalog' | 'cart' | 'checkout' | 'receipt'>('catalog');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'tmoney' | 'flooz' | 'card' | 'cash'>('tmoney');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  // --- LOGIC ---

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { id: item.id, name: item.name, price: item.price, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQty = Math.max(1, i.qty + delta);
        return { ...i, qty: newQty };
      }
      return i;
    }));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulation API Paiement
    setTimeout(() => {
      setIsProcessing(false);
      setTransactionId(`TXN-${Math.floor(Math.random() * 1000000)}`);
      setView('receipt');
    }, 2000);
  };

  const filteredItems = PHARMACY_ITEMS.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    i.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- VIEWS ---

  if (view === 'receipt') {
    return (
      <div className="max-w-md mx-auto animate-fade-in py-10">
        <GlassCard className="border-t-8 border-t-emerald-500 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Receipt size={100} />
          </div>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-600">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Paiement Réussi !</h2>
            <p className="text-slate-500 text-sm">Merci pour votre achat.</p>
          </div>

          <div className="border-t border-b border-dashed border-slate-300 py-4 my-4 space-y-2">
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Date</span>
                <span className="font-bold text-slate-800">{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">ID Transaction</span>
                <span className="font-mono text-slate-800">{transactionId}</span>
             </div>
             <div className="flex justify-between text-sm">
                <span className="text-slate-500">Mode Paiement</span>
                <span className="font-bold uppercase text-slate-800">{paymentMethod}</span>
             </div>
          </div>

          <div className="space-y-2 mb-6">
             {cart.map(item => (
               <div key={item.id} className="flex justify-between text-sm">
                 <span>{item.qty}x {item.name}</span>
                 <span className="font-bold">{item.price * item.qty} F</span>
               </div>
             ))}
          </div>

          <div className="bg-slate-800 text-white p-4 rounded-xl flex justify-between items-center mb-6">
             <span className="font-medium">TOTAL PAYÉ</span>
             <span className="text-xl font-bold">{totalAmount.toLocaleString()} F</span>
          </div>

          <NeonButton 
            onClick={() => { setCart([]); setView('catalog'); }} 
            className="w-full"
            variant="primary"
          >
            Retour à la boutique
          </NeonButton>
        </GlassCard>
      </div>
    );
  }

  if (view === 'cart' || view === 'checkout') {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
        <button onClick={() => setView('catalog')} className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold">
           <ArrowLeft size={20} /> Continuer mes achats
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* LISTE PANIER */}
           <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                 <ShoppingBag className="text-emerald-600"/> Mon Panier ({cart.length})
              </h2>
              {cart.length === 0 ? (
                 <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                    <p className="text-slate-400">Votre panier est vide.</p>
                 </div>
              ) : (
                 <div className="space-y-3">
                    {cart.map(item => (
                       <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center shadow-sm">
                          <div>
                             <p className="font-bold text-slate-800">{item.name}</p>
                             <p className="text-emerald-600 font-bold">{item.price} F</p>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1">
                             <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:bg-white rounded shadow-sm"><Minus size={16}/></button>
                             <span className="font-bold w-4 text-center">{item.qty}</span>
                             <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:bg-white rounded shadow-sm"><Plus size={16}/></button>
                          </div>
                          <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 p-2">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    ))}
                 </div>
              )}
           </div>

           {/* RESUME & PAIEMENT */}
           <div>
              <GlassCard className="sticky top-6">
                 <h3 className="text-xl font-bold text-slate-800 mb-6">Résumé de la commande</h3>
                 <div className="flex justify-between mb-2 text-slate-600">
                    <span>Sous-total</span>
                    <span>{totalAmount.toLocaleString()} F</span>
                 </div>
                 <div className="flex justify-between mb-6 text-slate-600">
                    <span>Taxes</span>
                    <span>0 F</span>
                 </div>
                 <div className="flex justify-between mb-8 text-2xl font-bold text-emerald-800 border-t border-slate-200 pt-4">
                    <span>Total</span>
                    <span>{totalAmount.toLocaleString()} F CFA</span>
                 </div>

                 {view === 'cart' ? (
                    <NeonButton 
                      onClick={() => setView('checkout')} 
                      className="w-full py-4 text-lg" 
                      disabled={cart.length === 0}
                      icon={CreditCard}
                    >
                       Procéder au Paiement
                    </NeonButton>
                 ) : (
                    <div className="space-y-4 animate-fade-in">
                       <p className="font-bold text-slate-700 mb-2">Moyen de paiement :</p>
                       <div className="grid grid-cols-2 gap-2">
                          <button 
                             onClick={() => setPaymentMethod('tmoney')}
                             className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'tmoney' ? 'bg-yellow-50 border-yellow-500 text-yellow-700 ring-1 ring-yellow-500' : 'bg-white hover:bg-slate-50'}`}
                          >
                             <Smartphone size={20} />
                             <span className="font-bold text-xs">T-Money</span>
                          </button>
                          <button 
                             onClick={() => setPaymentMethod('flooz')}
                             className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'flooz' ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500' : 'bg-white hover:bg-slate-50'}`}
                          >
                             <Smartphone size={20} />
                             <span className="font-bold text-xs">Flooz</span>
                          </button>
                          <button 
                             onClick={() => setPaymentMethod('card')}
                             className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'bg-purple-50 border-purple-500 text-purple-700 ring-1 ring-purple-500' : 'bg-white hover:bg-slate-50'}`}
                          >
                             <CreditCard size={20} />
                             <span className="font-bold text-xs">Carte</span>
                          </button>
                          <button 
                             onClick={() => setPaymentMethod('cash')}
                             className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-green-50 border-green-500 text-green-700 ring-1 ring-green-500' : 'bg-white hover:bg-slate-50'}`}
                          >
                             <Wallet size={20} />
                             <span className="font-bold text-xs">Espèces</span>
                          </button>
                       </div>

                       <NeonButton 
                          onClick={handlePayment} 
                          className="w-full py-4 mt-4" 
                          variant="success"
                          disabled={isProcessing}
                       >
                          {isProcessing ? 'Transaction en cours...' : `Payer ${totalAmount.toLocaleString()} F`}
                       </NeonButton>
                    </div>
                 )}
              </GlassCard>
           </div>
        </div>
      </div>
    );
  }

  // --- CATALOG VIEW ---
  return (
    <div className="space-y-6 animate-fade-in relative h-full flex flex-col">
       {/* HEADER */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
          <div>
             <h1 className="text-2xl font-bold text-slate-800">Pharmacie en Ligne</h1>
             <p className="text-slate-500 text-sm">Commandez vos produits en toute sécurité.</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input 
                  type="text" 
                  placeholder="Chercher un médicament..." 
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
             </div>
             <button 
                onClick={() => setView('cart')}
                className="relative bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-200"
             >
                <ShoppingBag size={20} />
                {cart.length > 0 && (
                   <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                      {cart.reduce((a, b) => a + b.qty, 0)}
                   </span>
                )}
             </button>
          </div>
       </div>

       {/* CATALOGUE GRID */}
       <div className="flex-1 overflow-y-auto pb-20">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {filteredItems.map(item => (
                <GlassCard key={item.id} className="flex flex-col justify-between p-4 group relative overflow-hidden hover:border-emerald-300">
                   {item.reqPrescription && (
                      <div className="absolute top-2 left-2 z-10">
                         <Badge color="red">Ordonnance</Badge>
                      </div>
                   )}
                   <div className="h-32 bg-slate-50 rounded-xl mb-4 flex items-center justify-center text-5xl shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {item.image}
                   </div>
                   
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">{item.category}</p>
                      <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1">{item.name}</h3>
                      <div className="flex justify-between items-end mt-3">
                         <span className="text-xl font-black text-emerald-600">{item.price} F</span>
                         <button 
                            onClick={() => addToCart(item)}
                            className="bg-emerald-50 text-emerald-600 p-2 rounded-lg hover:bg-emerald-600 hover:text-white transition-all active:scale-95"
                         >
                            <Plus size={20} />
                         </button>
                      </div>
                   </div>
                </GlassCard>
             ))}
          </div>
          {filteredItems.length === 0 && (
              <div className="text-center py-20 opacity-50">
                  <Pill size={48} className="mx-auto mb-4"/>
                  <p>Aucun produit trouvé.</p>
              </div>
          )}
       </div>
    </div>
  );
};

export default PublicPharmacy;