
import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, MetricCard, NeonButton, NeonInput, Badge } from '../components/UI';
import { 
  Users, Activity, DollarSign, AlertCircle, UserPlus, Settings, 
  Eye, ShieldAlert, CheckCircle, XCircle, Clock, Lock, FileText, Pill, Search, X, Save, AlertOctagon, VolumeX
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

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
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [alerts, setAlerts] = useState(CRITICAL_ALERTS);
  const [staffList, setStaffList] = useState(INITIAL_STAFF);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: '', role: '', department: 'Général' });
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyPatient, setEmergencyPatient] = useState('');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const checkDark = () => setIsDarkMode(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const checkEmergency = () => {
        const emergencyActive = localStorage.getItem('emergency_active') === 'true';
        const patientName = localStorage.getItem('emergency_patient') || 'Inconnu';
        if (emergencyActive && !isEmergency) {
             setIsEmergency(true);
             setEmergencyPatient(patientName);
             audioRef.current?.play().catch(() => {});
        } else if (!emergencyActive && isEmergency) {
             setIsEmergency(false);
             audioRef.current?.pause();
        }
    };
    const interval = setInterval(checkEmergency, 1000);
    return () => clearInterval(interval);
  }, [isEmergency]);

  const stopAlarm = () => {
      localStorage.removeItem('emergency_active');
      setIsEmergency(false);
      audioRef.current?.pause();
  };

  const resolveAlert = (id: number) => setAlerts(alerts.filter(a => a.id !== id));

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const newPerson = { id: Date.now(), name: newStaff.name, role: `${newStaff.role} (${newStaff.department})`, status: 'Disponible', color: 'bg-emerald-500', text: '' };
    setStaffList([...staffList, newPerson]);
    setShowAddStaffModal(false);
  };

  const SupervisionView = () => (
    <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <GlassCard className="min-h-[500px]">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800 dark:text-white">
                            <Activity size={20} className="text-blue-600 dark:text-emerald-400"/> Journal d'Activité
                        </h3>
                    </div>
                    <div className="space-y-0">
                        {logs.map((log) => (
                            <div key={log.id} className="flex items-start gap-4 p-4 border-b border-slate-50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <div className="text-xs font-mono text-slate-400 dark:text-slate-500 w-12 pt-1">{log.time}</div>
                                <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-400'}`}></div>
                                <div className="flex-1">
                                    <p className="font-bold text-slate-700 dark:text-slate-200 text-sm">{log.user}</p>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{log.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
            <div className="space-y-6">
                <GlassCard>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-[10px] uppercase tracking-widest">État des Services</h3>
                    <div className="space-y-3">
                        {[
                          { name: 'Serveur Principal', val: '99.9%', col: 'bg-emerald-500' },
                          { name: 'Base de Données', val: 'OK', col: 'bg-emerald-500' },
                        ].map((s, i) => (
                          <div key={i} className="flex justify-between items-center text-sm">
                              <span className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                                <span className={`w-2 h-2 rounded-full ${s.col}`}></span> {s.name}
                              </span>
                              <span className="font-bold text-emerald-600 dark:text-emerald-400">{s.val}</span>
                          </div>
                        ))}
                    </div>
                </GlassCard>
            </div>
        </div>
    </div>
  );

  const OverviewView = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Patients Total" value="1,284" trend="+12%" icon={Users} color="blue" />
        <MetricCard title="Revenus Jour" value="42,500 F" trend="+8%" icon={DollarSign} color="green" />
        <MetricCard title="Personnel Actif" value={staffList.length.toString()} icon={Activity} color="purple" />
        <MetricCard title="Alertes Critiques" value={alerts.length.toString()} icon={AlertCircle} color="red" />
      </div>
      <GlassCard className="h-96">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Flux Patients</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={CHART_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#e2e8f0"} vertical={false} />
            <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: isDarkMode ? '#0f172a' : '#fff',
                border: `1px solid ${isDarkMode ? '#334155' : '#e2e8f0'}`,
                color: isDarkMode ? '#f8fafc' : '#1e293b',
                borderRadius: '8px'
              }} 
            />
            <Line type="monotone" dataKey="patients" stroke="#10b981" strokeWidth={4} dot={{ r: 4, fill: '#10b981' }} />
          </LineChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">Administration</h1>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Supervision globale</p>
        </div>
        <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
          <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'overview' ? 'bg-medical-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Vue d'Ensemble</button>
          <button onClick={() => setActiveTab('supervision')} className={`px-4 py-2 rounded-lg text-xs font-black uppercase transition-all ${activeTab === 'supervision' ? 'bg-medical-primary text-white' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>Supervision</button>
        </div>
      </div>
      {activeTab === 'overview' ? <OverviewView /> : <SupervisionView />}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
            <GlassCard className="w-full max-w-md p-6 border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-black mb-6 uppercase text-slate-800 dark:text-white">Nouveau Membre</h2>
                <form onSubmit={handleAddStaff} className="space-y-4">
                    <NeonInput label="Nom" value={newStaff.name} onChange={e => setNewStaff({...newStaff, name: e.target.value})} required />
                    <NeonButton type="submit" variant="primary" className="w-full">Enregistrer</NeonButton>
                    <button type="button" onClick={() => setShowAddStaffModal(false)} className="w-full text-slate-400 text-xs uppercase font-bold mt-2">Annuler</button>
                </form>
            </GlassCard>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
