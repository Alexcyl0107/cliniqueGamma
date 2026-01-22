import React, { useState, useEffect, useRef } from 'react';
// Added MetricCard to the imports from components/UI to fix the "Cannot find name 'MetricCard'" error
import { GlassCard, NeonButton, Badge, NeonInput, MetricCard } from '../components/UI';
import { 
  User, Calendar, FileText, Activity, BrainCircuit, X, MessageSquare, Clock, 
  MapPin, Stethoscope, Pill, TestTube, Search, CheckCircle, AlertCircle, 
  Printer, Send, Plus, ChevronRight, Bell, Settings, LogOut, FilePlus, Mail, Inbox, AlertOctagon, Volume2, VolumeX,
  Phone, Ruler, Weight, Droplet, Save, UserPlus, ShoppingBag, MoreVertical
} from 'lucide-react';
import { analyzeSymptoms } from '../services/geminiService';
import { Patient } from '../types';
import PublicPharmacy from './PublicPharmacy'; 

const MOCK_PATIENTS_DATA = [
  { id: '1', name: 'Alain Mensah', age: 45, gender: 'Homme', lastVisit: '10 Oct 2023', diagnosis: 'Hypertension', status: 'En attente', phone: '+228 90 11 22 33', height: '180', weight: '85', bloodType: 'O+', allergies: 'Pénicilline', address: 'Lomé, Quartier Adidogomé' },
  { id: '2', name: 'Julie Dubois', age: 34, gender: 'Femme', lastVisit: '12 Sep 2023', diagnosis: 'Migraine', status: 'En traitement', phone: '+228 91 44 55 66', height: '165', weight: '60', bloodType: 'A-', allergies: 'Aucune', address: 'Lomé, Quartier Agbalépédogan' },
];

const DoctorDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'planning' | 'patients' | 'messages' | 'pharmacy'>('dashboard');
  const [patientsList, setPatientsList] = useState(MOCK_PATIENTS_DATA);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [isEmergency, setIsEmergency] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6 animate-fade-in">
      {/* Sidebar Interne */}
      <div className="w-full lg:w-64 flex lg:flex-col flex-row bg-white dark:bg-slate-900 border-r dark:border-slate-800 py-8 px-4 rounded-2xl shadow-sm">
         <div className="mb-8 px-4 hidden lg:block">
            <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Menu Praticien</h2>
         </div>
         <nav className="flex lg:flex-col space-y-2 w-full">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: Activity },
              { id: 'patients', label: 'Mes Patients', icon: User },
              { id: 'pharmacy', label: 'Pharmacie', icon: ShoppingBag },
            ].map(item => (
               <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${currentView === item.id ? 'bg-medical-primary dark:bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
               >
                  <item.icon size={16} />
                  <span>{item.label}</span>
               </button>
            ))}
         </nav>
      </div>

      {/* Zone de Contenu */}
      <div className="flex-1 space-y-6">
         {currentView === 'dashboard' && (
            <div className="space-y-6">
                <header>
                  <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Bonjour, Dr. Kossi 👋</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-xs">Aujourd'hui, vous avez 12 consultations prévues.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard title="Rendez-vous" value="12" icon={Calendar} color="blue" trend="+2" />
                    <MetricCard title="Urgences" value="1" icon={AlertOctagon} color="red" trend="-20%" />
                    <MetricCard title="Analyses" value="5" icon={TestTube} color="purple" trend="+1" />
                </div>

                <GlassCard>
                  <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest mb-6">Prochains Patients</h3>
                  <div className="space-y-4">
                    {patientsList.map(p => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-medical-primary/10 text-medical-primary flex items-center justify-center font-bold">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-white">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase">{p.status}</p>
                          </div>
                        </div>
                        <NeonButton variant="secondary" onClick={() => setSelectedPatient(p)}>Ouvrir</NeonButton>
                      </div>
                    ))}
                  </div>
                </GlassCard>
            </div>
         )}

         {currentView === 'patients' && (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 border dark:border-slate-800 shadow-sm animate-fade-in">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-black uppercase tracking-tighter text-slate-800 dark:text-white">Base Patients</h2>
                  <NeonButton icon={Plus}>Nouveau Patient</NeonButton>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 dark:text-slate-500 text-[10px] uppercase font-black border-b dark:border-slate-800">
                                <th className="py-4 px-4">Patient</th>
                                <th className="py-4 px-4">Âge / Sexe</th>
                                <th className="py-4 px-4">Statut</th>
                                <th className="py-4 px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patientsList.map(p => (
                                <tr key={p.id} className="border-b dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <td className="py-4 px-4 font-black text-sm uppercase text-slate-800 dark:text-slate-100">{p.name}</td>
                                    <td className="py-4 px-4 text-xs font-bold text-slate-500">{p.age} ans • {p.gender}</td>
                                    <td className="py-4 px-4">
                                      <Badge color={p.status === 'En attente' ? 'yellow' : 'green'}>{p.status}</Badge>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-4 py-2 rounded-xl hover:bg-medical-primary hover:text-white transition-all">Dossier</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
         )}

         {currentView === 'pharmacy' && <PublicPharmacy userType="doctor" />}
      </div>
    </div>
  );
};

export default DoctorDashboard;