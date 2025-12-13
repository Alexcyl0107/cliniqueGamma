import React, { useState, useEffect } from 'react';
import { GlassCard, NeonButton, Badge } from '../components/UI';
import { 
  Calendar, FileText, Activity, Download, Pill, 
  Shield, CheckCircle, Send, Stethoscope, Clock, Loader, XCircle, Heart, User, Eye, Baby, Activity as Pulse, ShoppingBag
} from 'lucide-react';
import PublicPharmacy from './PublicPharmacy'; // Import du nouveau module

// --- DONNÉES DE DÉMO ---
const PATIENT_INFO = {
  name: 'Mensah Alain',
  id: 'P-8842',
};

const SERVICES_LIST = [
  { id: 'Generaliste', label: 'Médecine Générale', icon: Stethoscope },
  { id: 'Cardiologie', label: 'Cardiologie', icon: Heart },
  { id: 'Pediatrie', label: 'Pédiatrie', icon: Baby },
  { id: 'Urgence', label: 'Urgences', icon: Pulse },
  { id: 'Ophtalmologie', label: 'Ophtalmologie', icon: Eye },
  { id: 'Gynecologie', label: 'Gynécologie', icon: User },
];

// Simulation : Ordonnance envoyée par le médecin (Statique pour l'exemple)
const DOCTOR_PRESCRIPTION = { 
  id: 'ORD-2023-88', 
  date: '12 Oct 2023', 
  doctor: 'Dr. Kossi', 
  note: 'Traitement pour infection respiratoire légère.',
  items: ['Amoxicilline 1g (Matin/Soir)', 'Paracétamol 1000mg (si fièvre)'],
  available: true
};

const PatientDashboard = () => {
  const [currentView, setCurrentView] = useState<'home' | 'appointments' | 'documents' | 'pharmacy'>('home');
  
  // État pour la demande de RDV
  const [symptomInput, setSymptomInput] = useState('');
  const [selectedService, setSelectedService] = useState('Generaliste');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'pending' | 'confirmed'>('idle');
  const [appointmentData, setAppointmentData] = useState<any>(null);

  // Vérifier le statut au chargement et périodiquement
  useEffect(() => {
    const checkStatus = () => {
      try {
        const storedReq = localStorage.getItem('patient_request');
        if (storedReq) {
          const parsedReq = JSON.parse(storedReq);
          // Only update if status actually changed to avoid re-renders
          if (parsedReq.status !== requestStatus) {
             setRequestStatus(parsedReq.status);
             if (parsedReq.status === 'confirmed') {
                setAppointmentData(parsedReq);
             }
          }
        } else {
             if (requestStatus !== 'idle') setRequestStatus('idle');
        }
      } catch (e) {
         console.error("Erreur lecture patient_request", e);
         localStorage.removeItem('patient_request');
         setRequestStatus('idle');
      }
    };

    checkStatus();
    // Polling pour simuler le temps réel quand le médecin répond
    const interval = setInterval(checkStatus, 2000); 
    return () => clearInterval(interval);
  }, [requestStatus]); 

  const handleRequestAppointment = () => {
    if (!symptomInput.trim()) return;
    
    // Création de la demande
    const newRequest = {
        id: Date.now(),
        patientName: PATIENT_INFO.name,
        symptoms: symptomInput,
        service: selectedService, 
        status: 'pending',
        requestDate: new Date().toLocaleDateString(),
        doctor: 'Non assigné',
        time: null
    };

    // LOGIQUE URGENCE
    if (selectedService === 'Urgence') {
        localStorage.setItem('emergency_active', 'true');
        localStorage.setItem('emergency_patient', PATIENT_INFO.name);
    }

    // Sauvegarde dans le "Back-end" (LocalStorage)
    try {
        localStorage.setItem('patient_request', JSON.stringify(newRequest));
        setSymptomInput('');
        setRequestStatus('pending');
    } catch(e) {
        alert("Erreur lors de l'envoi. Veuillez réessayer.");
    }
  };

  const cancelRequest = () => {
     localStorage.removeItem('patient_request');
     setRequestStatus('idle');
     setSymptomInput('');
     setSelectedService('Generaliste');
     // Annuler l'urgence si on annule la demande
     localStorage.removeItem('emergency_active');
  };

  const resetDemo = () => {
      localStorage.removeItem('patient_request');
      localStorage.removeItem('emergency_active');
      setRequestStatus('idle');
      setAppointmentData(null);
      setSelectedService('Generaliste');
  };

  return (
    <div className="flex h-full bg-slate-50 gap-4">
      {/* Sidebar Interne Simplifiée */}
      <div className="w-20 lg:w-64 flex flex-col bg-white border-r border-slate-200 h-full py-6">
         <div className="px-6 mb-8 hidden lg:block">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Espace Patient</h2>
         </div>
         <nav className="flex-1 space-y-2 px-2 lg:px-4">
            {[
              { id: 'home', label: 'Mon Espace', icon: Activity },
              { id: 'appointments', label: 'Historique RDV', icon: Calendar },
              { id: 'documents', label: 'Mes Ordonnances', icon: FileText },
              { id: 'pharmacy', label: 'Achat Médicaments', icon: ShoppingBag }, // NOUVEAU BOUTON
            ].map(item => (
               <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl font-bold transition-all ${
                     currentView === item.id 
                     ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                  }`}
               >
                  <item.icon size={22} />
                  <span className="hidden lg:inline">{item.label}</span>
               </button>
            ))}
         </nav>
      </div>

      {/* Zone Contenu Principal */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-10">
         
         {/* --- HOME VIEW --- */}
         {currentView === 'home' && (
            <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
              {/* En-tête Accueil */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-800">Mon Espace Santé</h1>
                  <p className="text-slate-500">Bienvenue, {PATIENT_INFO.name}.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 border border-emerald-100 shadow-sm">
                        <Shield size={16} /> Patient Vérifié
                    </div>
                </div>
              </div>

              {/* BLOC UNIQUE : LOGIQUE DYNAMIQUE */}
              <div className="max-w-3xl mx-auto mt-10">
                <section className="space-y-6">
                    
                    {/* ETAT 1 : Formulaire (Si rien n'est en cours) */}
                    {requestStatus === 'idle' && (
                        <>
                            <div className="text-center mb-6">
                                <div className="inline-flex p-3 bg-blue-100 text-blue-600 rounded-full mb-4 shadow-sm">
                                    <Stethoscope size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-800">Besoin d'un médecin ?</h2>
                                <p className="text-slate-500">Choisissez le service et décrivez vos symptômes.</p>
                            </div>
                            
                            <GlassCard className="border-t-4 border-t-blue-500 min-h-[350px] flex flex-col justify-center shadow-xl shadow-blue-50">
                                
                                {/* SELECTEUR DE SERVICE */}
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                        1. Service Souhaité
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {SERVICES_LIST.map((srv) => (
                                            <button
                                                key={srv.id}
                                                onClick={() => setSelectedService(srv.id)}
                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all ${
                                                    selectedService === srv.id
                                                    ? srv.id === 'Urgence' 
                                                        ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-200 scale-105 animate-pulse'
                                                        : 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-200 scale-105'
                                                    : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-white hover:border-blue-300'
                                                }`}
                                            >
                                                <srv.icon size={20} className="mb-1" />
                                                <span className="text-xs font-bold">{srv.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    {selectedService === 'Urgence' && (
                                        <div className="mt-2 text-center text-xs font-bold text-red-600 bg-red-50 p-2 rounded">
                                            ⚠️ Attention: Cela déclenchera une alerte prioritaire chez les médecins.
                                        </div>
                                    )}
                                </div>

                                <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">
                                    2. Description des symptômes
                                </label>
                                <textarea 
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-5 text-slate-800 text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all min-h-[120px] resize-none mb-6 shadow-inner"
                                    placeholder="Ex: J'ai de la fièvre depuis 2 jours..."
                                    value={symptomInput}
                                    onChange={(e) => setSymptomInput(e.target.value)}
                                />
                                <NeonButton 
                                    onClick={handleRequestAppointment} 
                                    variant={selectedService === 'Urgence' ? 'danger' : 'primary'}
                                    className="w-full justify-center py-4 text-lg font-bold tracking-wide" 
                                    icon={Send}
                                >
                                    {selectedService === 'Urgence' ? 'SIGNALER UNE URGENCE' : 'ENVOYER MA DEMANDE'}
                                </NeonButton>
                            </GlassCard>
                        </>
                    )}

                    {/* ETAT 2 : En attente du médecin */}
                    {requestStatus === 'pending' && (
                        <GlassCard className={`text-center py-16 border-t-4 relative ${
                            selectedService === 'Urgence' ? 'border-t-red-500 bg-red-50/50' : 'border-t-yellow-400 bg-yellow-50/30'
                        }`}>
                             <button 
                                onClick={cancelRequest} 
                                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 text-sm font-bold flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-slate-100 shadow-sm"
                             >
                                <XCircle size={16} /> Annuler
                             </button>
                             <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse ${
                                 selectedService === 'Urgence' ? 'bg-red-100 text-red-600 shadow-red-200' : 'bg-yellow-100 text-yellow-600 shadow-yellow-100'
                             }`}>
                                <Loader size={40} className="animate-spin-slow" />
                            </div>
                            <h3 className={`text-3xl font-bold mb-3 ${selectedService === 'Urgence' ? 'text-red-800' : 'text-slate-800'}`}>
                                {selectedService === 'Urgence' ? 'ALERTE URGENCE ENVOYÉE' : 'Demande Transmise'}
                            </h3>
                            <p className="text-slate-600 text-lg max-w-md mx-auto mb-4">
                                Votre demande pour le service <span className="font-bold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">{SERVICES_LIST.find(s => s.id === JSON.parse(localStorage.getItem('patient_request') || '{}').service)?.label || 'Général'}</span> est en cours de traitement.
                            </p>
                            <p className="text-slate-500 inline-block px-4 py-2 rounded-lg border border-slate-100 shadow-sm bg-white">
                                {selectedService === 'Urgence' ? 'Une équipe va vous prendre en charge immédiatement.' : "En attente de la fixation de l'heure..."}
                            </p>
                        </GlassCard>
                    )}

                    {/* ETAT 3 : Confirmé avec Heure */}
                    {requestStatus === 'confirmed' && appointmentData && (
                        <GlassCard className="relative overflow-hidden border-t-4 border-t-emerald-500 shadow-2xl shadow-emerald-100">
                            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-bold rounded-bl-xl">
                                VALIDÉ PAR LE MÉDECIN
                            </div>
                            
                            <div className="text-center py-8">
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-sm mb-4">Votre rendez-vous est fixé à</p>
                                
                                {/* HEURE DYNAMIQUE */}
                                <div className="text-7xl font-black text-slate-800 tracking-tighter mb-4 scale-110 transform transition-transform">
                                    {appointmentData.time}
                                </div>
                                
                                <div className="flex justify-center items-center gap-3 mb-8 flex-wrap">
                                     <span className="bg-emerald-100 text-emerald-800 px-4 py-1 rounded-full font-bold flex items-center gap-2">
                                        <Calendar size={18}/> {appointmentData.requestDate}
                                     </span>
                                     <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full font-bold flex items-center gap-2">
                                        <Stethoscope size={18}/> {appointmentData.doctor}
                                     </span>
                                     <span className="bg-purple-50 text-purple-800 px-4 py-1 rounded-full font-bold flex items-center gap-2 border border-purple-100">
                                        <Activity size={18}/> {SERVICES_LIST.find(s => s.id === appointmentData.service)?.label || appointmentData.service || 'Consultation'}
                                     </span>
                                </div>

                                <div className="max-w-md mx-auto bg-slate-50 p-4 rounded-xl text-left border border-slate-200">
                                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">Rappel des symptômes :</p>
                                    <p className="text-slate-700 italic">"{appointmentData.symptoms}"</p>
                                </div>

                                 <button 
                                    onClick={resetDemo}
                                    className="mt-8 px-6 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-bold hover:bg-slate-200 transition-colors text-sm"
                                >
                                    Faire une nouvelle demande (Mode Démo)
                                </button>
                            </div>
                        </GlassCard>
                    )}

                </section>
              </div>
            </div>
         )}
         
         {/* --- APPOINTMENTS VIEW --- */}
         {currentView === 'appointments' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
               <h2 className="text-2xl font-bold text-slate-800 mb-6">Historique des Rendez-vous</h2>
               <GlassCard>
                  <div className="space-y-6">
                    {/* Si confirmé, l'ajouter à l'historique */}
                    {requestStatus === 'confirmed' && appointmentData ? (
                         <div className="flex flex-col md:flex-row items-center gap-6 p-6 bg-emerald-50 border border-emerald-100 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 bg-emerald-200 text-emerald-800 px-3 py-1 text-xs font-bold rounded-bl-xl">NOUVEAU</div>
                            <div className="text-center min-w-[100px]">
                                <span className="block font-black text-4xl text-emerald-600">Auj.</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="font-bold text-2xl text-slate-800">Consultation Confirmée</p>
                                <p className="text-slate-600 text-lg mb-2">{appointmentData.doctor} - {appointmentData.service}</p>
                                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-emerald-700 font-bold shadow-sm border border-emerald-100">
                                    <Clock size={20}/> HEURE : {appointmentData.time}
                                </div>
                            </div>
                            <Badge color="green">Confirmé</Badge>
                        </div>
                    ) : (
                        <p className="text-slate-400 text-center italic py-4">Aucun rendez-vous à venir.</p>
                    )}
                    
                    {/* Passé (Statique) */}
                    <div className="flex flex-col md:flex-row items-center gap-6 p-4 border border-slate-100 rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all">
                         <div className="text-center min-w-[80px]">
                            <span className="block font-black text-2xl text-slate-400">10</span>
                            <span className="text-sm font-bold text-slate-300 uppercase">SEP</span>
                         </div>
                         <div className="flex-1 text-center md:text-left">
                            <p className="font-bold text-xl text-slate-700">Suivi Cardiologie</p>
                            <p className="text-slate-500">Dr. Sarah Connor</p>
                         </div>
                         <Badge color="blue">Terminé</Badge>
                    </div>
                  </div>
               </GlassCard>
            </div>
         )}
         
         {/* --- DOCUMENTS VIEW --- */}
         {currentView === 'documents' && (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
               <h2 className="text-2xl font-bold text-slate-800 mb-6">Toutes mes Ordonnances</h2>
               <div className="grid grid-cols-1 gap-4">
                  {[DOCTOR_PRESCRIPTION].map(doc => (
                     <GlassCard key={doc.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="bg-purple-50 p-4 rounded-xl text-purple-600">
                              <Pill size={28} />
                           </div>
                           <div>
                              <h4 className="font-bold text-slate-800 text-lg">Ordonnance #{doc.id}</h4>
                              <p className="text-sm text-slate-500">{doc.date} • {doc.doctor}</p>
                              <p className="text-xs text-slate-400 mt-1">{doc.items.length} médicaments</p>
                           </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-purple-600 hover:border-purple-200 transition-all font-bold shadow-sm">
                           <Download size={18} /> Télécharger
                        </button>
                     </GlassCard>
                  ))}
               </div>
            </div>
         )}

         {/* --- PHARMACY VIEW --- */}
         {currentView === 'pharmacy' && (
             <div className="h-full">
                 <PublicPharmacy userType="patient" />
             </div>
         )}

      </div>
    </div>
  );
};

export default PatientDashboard;