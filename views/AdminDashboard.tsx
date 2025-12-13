import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, MetricCard, NeonButton, NeonInput, Badge } from '../components/UI';
import { 
  Users, Activity, DollarSign, AlertCircle, UserPlus, Settings, 
  Eye, ShieldAlert, CheckCircle, XCircle, Clock, Lock, FileText, Pill, Search, X, Save, AlertOctagon, VolumeX
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

// --- MOCK DATA ---
const CHART_DATA = [
  { name: 'Lun', patients: 40, revenue: 2400 },
  { name: 'Mar', patients: 30, revenue: 1398 },
  { name: 'Mer', patients: 20, revenue: 9800 },
  { name: 'Jeu', patients: 27, revenue: 3908 },
  { name: 'Ven', patients: 18, revenue: 4800 },
  { name: 'Sam', patients: 23, revenue: 3800 },
  { name: 'Dim', patients: 34, revenue: 4300 },
];

const INITIAL_LOGS = [
  { id: 1, time: '10:42', user: 'Dr. Kossi', role: 'Médecin', action: 'Validation Dossier #8842', type: 'success' },
  { id: 2, time: '10:38', user: 'Pharmacie', role: 'Pharmacien', action: 'Alerte Stock: Amoxicilline', type: 'warning' },
  { id: 3, time: '10:35', user: 'Système', role: 'IA', action: 'Détection conflit médicamenteux prévenue', type: 'info' },
  { id: 4, time: '10:30', user: 'Acc. Guest', role: 'Inconnu', action: 'Tentative connexion échouée (IP 192...)', type: 'danger' },
  { id: 5, time: '10:15', user: 'M. Mensah', role: 'Patient', action: 'Demande de RDV confirmée', type: 'success' },
];

const CRITICAL_ALERTS = [
  { id: 1, title: 'Rupture Stock Critique', desc: 'Insuline Rapide - Stock 0', urgent: true },
  { id: 2, title: 'Personnel Manquant', desc: 'Dr. Sarah absente (Urgences)', urgent: true },
  { id: 3, title: 'Facture Impayée', desc: 'Dossier #9921 - 150.000F en attente', urgent: false },
];

const INITIAL_STAFF = [
    { id: 1, name: 'Dr. Sarah Connor', role: 'Cardiologie', status: 'Disponible', color: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50' },
    { id: 2, name: 'Dr. John Doe', role: 'Neurologie', status: 'En Chirurgie', color: 'bg-rose-500', text: 'text-rose-700 bg-rose-50' },
    { id: 3, name: 'Dr. Emily Chen', role: 'Pédiatrie', status: 'En Pause', color: 'bg-amber-500', text: 'text-amber-700 bg-amber-50' },
    { id: 4, name: 'Dr. Alan Grant', role: 'Généraliste', status: 'Disponible', color: 'bg-emerald-500', text: 'text-emerald-700 bg-emerald-50' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'supervision'>('overview');
  
  // States de données
  const [alerts, setAlerts] = useState(CRITICAL_ALERTS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  // States Modale Ajout Personnel
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: 'Général' });

  // Urgence State
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyPatient, setEmergencyPatient] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialisation Audio
  useEffect(() => {
    // Son d'alarme (Bip fort)
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.loop = true;
  }, []);

  // Polling pour vérifier les urgences
  useEffect(() => {
    const checkEmergency = () => {
        const emergencyActive = localStorage.getItem('emergency_active') === 'true';
        const patientName = localStorage.getItem('emergency_patient') || 'Inconnu';
        
        if (emergencyActive && !isEmergency) {
             setIsEmergency(true);
             setEmergencyPatient(patientName);
             audioRef.current?.play().catch(e => console.log("Audio autoplay bloqué, interaction requise", e));
        } else if (!emergencyActive && isEmergency) {
             setIsEmergency(false);
             audioRef.current?.pause();
             if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };
    
    checkEmergency();
    const interval = setInterval(checkEmergency, 1000);
    return () => clearInterval(interval);
  }, [isEmergency]);

  const stopAlarm = () => {
      localStorage.removeItem('emergency_active');
      localStorage.removeItem('emergency_patient');
      setIsEmergency(false);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
  };

  const resolveAlert = (id: number) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.role) return;

    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newPerson = {
        id: Date.now(),
        name: newStaff.name,
        role: newStaff.department ? `${newStaff.role} (${newStaff.department})` : newStaff.role,
        status: 'Disponible',
        color: randomColor,
        text: 'text-slate-700 bg-slate-50'
    };

    setStaffList([...staffList, newPerson]);
    
    // Ajouter un log
    const newLog = { 
        id: Date.now(), 
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), 
        user: 'Admin', 
        role: 'Admin', 
        action: `Nouveau membre ajouté : ${newStaff.name}`, 
        type: 'info' 
    };
    setLogs([newLog, ...logs]);

    setShowAddStaffModal(false);
    setNewStaff({ name: '', role: '', department: 'Général' });
  };

  // --- VUE: SUPERVISION ---
  const SupervisionView = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Colonne Gauche : Journal d'activité (Logs) */}
            <div className="lg:col-span-2 space-y-6">
                <GlassCard className="min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Activity size={20} className="text-blue-600"/> Journal d'Activité (Temps Réel)
                        </h3>
                        <div className="flex gap-2">
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live
                            </span>
                            <button className="text-xs text-blue-600 hover:underline">Voir tout l'historique</button>
                        </div>
                    </div>
                    
                    <div className="space-y-0">
                        {isEmergency && (
                             <div className="flex items-start gap-4 p-4 border-b border-red-200 bg-red-50 animate-pulse transition-colors">
                                <div className="text-xs font-mono text-red-400 pt-1 w-12">Maintenant</div>
                                <div className="mt-1 w-2 h-2 rounded-full shrink-0 bg-red-600 animate-ping"></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-black text-red-700 text-sm">URGENCE SIGNALÉE</p>
                                    </div>
                                    <p className="text-sm text-red-600 font-bold">Patient : {emergencyPatient} - Besoin immédiat</p>
                                </div>
                            </div>
                        )}
                        {logs.map((log, i) => (
                            <div key={log.id} className="flex items-start gap-4 p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                <div className="text-xs font-mono text-slate-400 pt-1 w-12">{log.time}</div>
                                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 
                                    ${log.type === 'success' ? 'bg-emerald-500' : 
                                      log.type === 'danger' ? 'bg-red-500' : 
                                      log.type === 'warning' ? 'bg-amber-500' : 'bg-blue-400'}`}
                                ></div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <p className="font-bold text-slate-700 text-sm">
                                            {log.user} <span className="font-normal text-slate-400 text-xs">({log.role})</span>
                                        </p>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                            <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded text-slate-600">Détails</button>
                                            {log.type === 'danger' && (
                                                <button className="text-xs bg-red-100 hover:bg-red-200 px-2 py-1 rounded text-red-600 font-bold">Bloquer IP</button>
                                            )}
                                        </div>
                                    </div>
                                    <p className="text-sm text-slate-600">{log.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-purple-600"/> Gestion des Accès & Sécurité
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                <tr>
                                    <th className="p-3">Utilisateur</th>
                                    <th className="p-3">Rôle</th>
                                    <th className="p-3">Dernière Connexion</th>
                                    <th className="p-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr className="hover:bg-slate-50">
                                    <td className="p-3 font-bold text-slate-700">Dr. Kossi</td>
                                    <td className="p-3">Médecin</td>
                                    <td className="p-3 text-green-600">En ligne</td>
                                    <td className="p-3 text-right"><button className="text-blue-600 hover:underline">Gérer</button></td>
                                </tr>
                                <tr className="hover:bg-slate-50">
                                    <td className="p-3 font-bold text-slate-700">Pharmacie Centrale</td>
                                    <td className="p-3">Staff</td>
                                    <td className="p-3 text-slate-400">Il y a 2h</td>
                                    <td className="p-3 text-right"><button className="text-blue-600 hover:underline">Gérer</button></td>
                                </tr>
                                <tr className="bg-red-50/50">
                                    <td className="p-3 font-bold text-slate-700">Guest_User_99</td>
                                    <td className="p-3">Ex-Employé</td>
                                    <td className="p-3 text-red-600 font-bold">Tentative bloquée</td>
                                    <td className="p-3 text-right">
                                        <button className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold hover:bg-red-200">Banni</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </GlassCard>
            </div>

            {/* Colonne Droite : Centre d'Intervention */}
            <div className="space-y-6">
                <GlassCard className="border-l-4 border-l-red-500 bg-red-50/20">
                    <div className="flex items-center gap-2 mb-4 text-red-700">
                        <ShieldAlert size={24} />
                        <h3 className="font-bold text-lg">Centre d'Intervention</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-6">Actions requises immédiatement pour assurer la continuité des services.</p>
                    
                    <div className="space-y-4">
                        {alerts.length === 0 ? (
                            <div className="text-center py-8 text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                                <CheckCircle size={32} className="mx-auto mb-2"/>
                                <p className="font-bold">Aucune alerte critique</p>
                                <p className="text-xs">Tout fonctionne normalement.</p>
                            </div>
                        ) : (
                            alerts.map(alert => (
                                <div key={alert.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                                    {alert.urgent && <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-0.5 font-bold uppercase">Urgent</div>}
                                    <h4 className="font-bold text-slate-800 text-sm mb-1">{alert.title}</h4>
                                    <p className="text-xs text-slate-500 mb-3">{alert.desc}</p>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => resolveAlert(alert.id)}
                                            className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2 rounded hover:bg-emerald-700 transition-colors"
                                        >
                                            Résoudre
                                        </button>
                                        <button className="flex-1 bg-slate-100 text-slate-600 text-xs font-bold py-2 rounded hover:bg-slate-200 transition-colors">
                                            Déléguer
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>

                <GlassCard>
                    <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">État des Services</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Serveur Principal</span>
                            <span className="text-emerald-600 font-bold">99.9%</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Base de Données</span>
                            <span className="text-emerald-600 font-bold">OK</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500"></div> API IA (Gemini)</span>
                            <span className="text-amber-600 font-bold">Latence</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Module SMS</span>
                            <span className="text-emerald-600 font-bold">Actif</span>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </div>
    </div>
  );

  // --- VUE: DASHBOARD GENERAL (EXISTANTE MAIS AMÉLIORÉE) ---
  const OverviewView = () => (
    <div className="space-y-6 animate-fade-in">
        {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Patients Total" value="1,284" trend="+12%" icon={Users} color="blue" />
        <MetricCard title="Revenus Jour" value="42,500 F" trend="+8%" icon={DollarSign} color="green" />
        <MetricCard title="Personnel Actif" value={staffList.length.toString()} icon={Activity} color="purple" />
        <MetricCard title="Alertes Critiques" value={alerts.length.toString()} icon={AlertCircle} color="red" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-96">
        <GlassCard className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Flux Patients</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Line type="monotone" dataKey="patients" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 4 }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Analyses Revenus</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#f1f5f9'}}
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} 
              />
              <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>

      {/* Active Doctors Status */}
      <GlassCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">État du Personnel</h3>
          <div className="flex gap-2">
             <button className="text-xs font-bold text-slate-500 hover:text-blue-600 bg-slate-50 px-3 py-1 rounded-full">Filtrer par service</button>
             <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-1 rounded-full flex items-center gap-1"><Clock size={12}/> TEMPS RÉEL</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staffList.map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                {doc.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className={`absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full ${doc.color}`}></div>
                        </div>
                        <div>
                            <p className="text-slate-800 font-bold text-sm">{doc.name}</p>
                            <p className="text-slate-500 text-xs">{doc.role}</p>
                        </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-xs text-blue-600 font-bold transition-opacity">
                        Voir
                    </button>
                </div>
            ))}
        </div>
      </GlassCard>
    </div>
  );

  return (
    <div className={`space-y-6 animate-fade-in relative transition-colors duration-500 ${isEmergency ? 'bg-red-50 p-4 -m-4 rounded-xl' : ''}`}>
      
      {/* EMERGENCY OVERLAY */}
      {isEmergency && (
          <div className="fixed inset-0 z-[60] pointer-events-none flex items-start justify-center pt-4">
              <div className="bg-red-600 text-white px-8 py-4 rounded-b-xl shadow-2xl animate-pulse pointer-events-auto flex items-center gap-6 border-4 border-white">
                  <AlertOctagon size={48} className="animate-bounce" />
                  <div>
                      <h2 className="text-3xl font-black uppercase tracking-widest">URGENCE VITALE</h2>
                      <p className="text-lg font-bold">Patient : {emergencyPatient} - Service Urgences</p>
                  </div>
                  <button 
                    onClick={stopAlarm}
                    className="bg-white text-red-600 px-6 py-3 rounded-lg font-black hover:bg-red-100 transition-colors shadow-lg flex items-center gap-2"
                  >
                      <VolumeX size={24}/> STOP ALARME
                  </button>
              </div>
          </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-sans font-bold text-slate-800">
            Administration
          </h1>
          <p className="text-slate-500 font-medium">Contrôle global et supervision de la clinique</p>
        </div>
        <div className="flex gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-medical-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Activity size={16}/> Vue d'Ensemble
          </button>
          <button 
            onClick={() => setActiveTab('supervision')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 relative ${activeTab === 'supervision' ? 'bg-medical-primary text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <Eye size={16}/> Supervision & Alertes
            {(alerts.length > 0 || isEmergency) && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border border-white"></span>}
          </button>
        </div>
        <div className="hidden md:flex gap-4">
          <NeonButton onClick={() => setShowAddStaffModal(true)} icon={UserPlus} variant="secondary">Ajouter Personnel</NeonButton>
        </div>
      </div>

      {activeTab === 'overview' ? <OverviewView /> : <SupervisionView />}

      {/* --- MODAL AJOUT PERSONNEL --- */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-fade-in">
            <GlassCard className="w-full max-w-md p-6 shadow-2xl relative">
                <button onClick={() => setShowAddStaffModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <UserPlus size={24} className="text-medical-primary"/> Nouveau Membre
                </h2>
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <NeonInput 
                        label="Nom Complet" 
                        placeholder="Ex: Dr. Marc Lavoie" 
                        value={newStaff.name} 
                        onChange={e => setNewStaff({...newStaff, name: e.target.value})}
                        required
                    />
                    <div className="grid grid-cols-1 gap-4">
                        <NeonInput 
                            as="select"
                            label="Rôle" 
                            value={newStaff.role} 
                            onChange={e => setNewStaff({...newStaff, role: e.target.value})}
                            options={['', 'Médecin', 'Infirmier', 'Pharmacien', 'Technicien Labo', 'Secrétaire']}
                            required
                        />
                         <NeonInput 
                            label="Département / Spécialité" 
                            placeholder="Ex: Cardiologie, Accueil..." 
                            value={newStaff.department} 
                            onChange={e => setNewStaff({...newStaff, department: e.target.value})}
                        />
                    </div>
                    
                    <div className="pt-4 flex gap-3">
                        <NeonButton type="button" variant="secondary" onClick={() => setShowAddStaffModal(false)} className="flex-1">Annuler</NeonButton>
                        <NeonButton type="submit" variant="primary" icon={Save} className="flex-1">Enregistrer</NeonButton>
                    </div>
                </form>
            </GlassCard>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;