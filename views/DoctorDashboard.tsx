import React, { useState, useEffect, useRef } from 'react';
import { GlassCard, NeonButton, Badge, NeonInput } from '../components/UI';
import { 
  User, Calendar, FileText, Activity, BrainCircuit, X, MessageSquare, Clock, 
  MapPin, Stethoscope, Pill, TestTube, Search, CheckCircle, AlertCircle, 
  Printer, Send, Plus, ChevronRight, Bell, Settings, LogOut, FilePlus, Mail, Inbox, AlertOctagon, Volume2, VolumeX,
  Phone, Ruler, Weight, Droplet, Save, UserPlus, ShoppingBag, MoreVertical
} from 'lucide-react';
import { analyzeSymptoms } from '../services/geminiService';
import { Patient } from '../types';
import PublicPharmacy from './PublicPharmacy'; 

// --- MOCK DATA ---
const MOCK_PATIENTS_DATA = [
  { id: '1', name: 'Alain Mensah', age: 45, gender: 'Homme', lastVisit: '10 Oct 2023', diagnosis: 'Hypertension', status: 'Waiting', phone: '+228 90 11 22 33', height: '180', weight: '85', bloodType: 'O+', allergies: 'Pénicilline', address: 'Lomé, Quartier Adidogomé' },
  { id: '2', name: 'Julie Dubois', age: 34, gender: 'Femme', lastVisit: '12 Sep 2023', diagnosis: 'Migraine', status: 'In Treatment', phone: '+228 91 44 55 66', height: '165', weight: '60', bloodType: 'A-', allergies: 'Aucune', address: 'Lomé, Quartier Agbalépédogan' },
  { id: '3', name: 'Paul Kouame', age: 28, gender: 'Homme', lastVisit: '01 Oct 2023', status: 'Waiting', phone: '+228 92 77 88 99', height: '175', weight: '70', bloodType: 'B+', allergies: 'Arachides', address: 'Kpalimé, Centre Ville' },
];

const MOCK_HISTORY = [
  { date: '10 Oct 2023', type: 'Consultation', note: 'Douleurs thoraciques légères.' },
  { date: '15 Sep 2023', type: 'Analyse', note: 'Bilan sanguin complet - Normal.' },
];

const MOCK_MEDS = ['Amoxicilline', 'Paracétamol', 'Ibuprofène', 'Metformine', 'Bisoprolol'];

const STATIC_APPOINTMENTS = [
    { id: 'stat-1', time: '09:00', patientName: 'Réunion Staff', type: 'meeting', duration: 30, note: 'Point hebdomadaire' },
    { id: 'stat-2', time: '11:00', patientName: 'Sophie T.', type: 'consultation', duration: 30, note: 'Suivi grossesse' },
    { id: 'stat-3', time: '13:00', patientName: 'Pause Déjeuner', type: 'break', duration: 60, note: '' },
    { id: 'stat-4', time: '15:30', patientName: 'M. Koffi', type: 'consultation', duration: 30, note: 'Renouvellement ordonnance' },
];

const DoctorDashboard = () => {
  const [currentView, setCurrentView] = useState<'dashboard' | 'planning' | 'patients' | 'messages' | 'pharmacy'>('dashboard');
  const [patientsList, setPatientsList] = useState(MOCK_PATIENTS_DATA);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  
  const [newPatientData, setNewPatientData] = useState({
      name: '', age: '', gender: 'Homme', phone: '', address: '',
      height: '', weight: '', bloodType: '', allergies: 'Aucune', history: ''
  });

  const [incomingRequests, setIncomingRequests] = useState<any[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isEmergency, setIsEmergency] = useState(false);
  const [emergencyPatient, setEmergencyPatient] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [vitals, setVitals] = useState({ bp: '', temp: '', weight: '' });
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  
  const [prescription, setPrescription] = useState<{med: string, dose: string}[]>([]);
  const [medInput, setMedInput] = useState('');
  const [doseInput, setDoseInput] = useState('');

  useEffect(() => {
    audioRef.current = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    const checkUpdates = () => {
        try {
            const storedReq = localStorage.getItem('patient_request');
            if (storedReq) {
                const req = JSON.parse(storedReq);
                if (req && req.status === 'pending') setIncomingRequests([req]);
                else setIncomingRequests([]);
            } else setIncomingRequests([]);
        } catch (error) { console.error(error); }

        const emergencyActive = localStorage.getItem('emergency_active') === 'true';
        const patientName = localStorage.getItem('emergency_patient') || 'Inconnu';
        
        if (emergencyActive && !isEmergency) {
             setIsEmergency(true);
             setEmergencyPatient(patientName);
             audioRef.current?.play().catch(e => console.log("Audio autoplay bloqué", e));
        } else if (!emergencyActive && isEmergency) {
             setIsEmergency(false);
             audioRef.current?.pause();
             if (audioRef.current) audioRef.current.currentTime = 0;
        }
    };
    checkUpdates();
    const interval = setInterval(checkUpdates, 1000);
    return () => clearInterval(interval);
  }, [isEmergency]);

  const stopAlarm = () => {
      localStorage.removeItem('emergency_active');
      localStorage.removeItem('emergency_patient');
      setIsEmergency(false);
      audioRef.current?.pause();
      if (audioRef.current) audioRef.current.currentTime = 0;
      setNotification("Alarme arrêtée. Patient pris en charge.");
      setTimeout(() => setNotification(null), 3000);
  };

  const handleConfirmAppointment = (req: any, time: string) => {
    if (!time) return;
    const updatedReq = { ...req, status: 'confirmed', time: time, doctor: 'Dr. Kossi' };
    try {
        localStorage.setItem('patient_request', JSON.stringify(updatedReq));
        setIncomingRequests([]);
        setNotification(`Rendez-vous confirmé pour ${req.patientName} à ${time}`);
        setTimeout(() => setNotification(null), 4000);
    } catch (e) { alert("Erreur sauvegarde."); }
  };

  const handleSavePatient = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newPatientData.name || !newPatientData.phone) return;

      const newP = {
          id: Date.now().toString(),
          name: newPatientData.name,
          age: Number(newPatientData.age),
          gender: newPatientData.gender,
          phone: newPatientData.phone,
          height: newPatientData.height,
          weight: newPatientData.weight,
          bloodType: newPatientData.bloodType,
          allergies: newPatientData.allergies,
          address: newPatientData.address,
          lastVisit: 'Jamais',
          diagnosis: 'Nouveau Patient',
          status: 'Waiting'
      };

      setPatientsList([newP as any, ...patientsList]);
      setShowAddPatientModal(false);
      setNotification(`Dossier créé : ${newPatientData.name}`);
      setTimeout(() => setNotification(null), 3000);
      setNewPatientData({
          name: '', age: '', gender: 'Homme', phone: '', address: '',
          height: '', weight: '', bloodType: '', allergies: 'Aucune', history: ''
      });
  };

  const addMedication = () => {
    if(medInput && doseInput) {
      setPrescription([...prescription, { med: medInput, dose: doseInput }]);
      setMedInput(''); setDoseInput('');
    }
  };
  const removeMedication = (index: number) => {
    const newList = [...prescription];
    newList.splice(index, 1);
    setPrescription(newList);
  };

  const getDailySchedule = () => {
      let schedule = [...STATIC_APPOINTMENTS];
      try {
          const storedReq = localStorage.getItem('patient_request');
          if (storedReq) {
              const req = JSON.parse(storedReq);
              if (req.status === 'confirmed' && req.time) {
                  schedule.push({
                      id: 'dyn-' + req.id,
                      time: req.time,
                      patientName: req.patientName,
                      type: req.service === 'Urgence' ? 'urgency' : 'consultation',
                      duration: 30,
                      note: req.symptoms || 'Consultation générale'
                  });
              }
          }
      } catch (e) { console.error("Erreur parsing schedule", e); }
      return schedule;
  };

  const hours = Array.from({ length: 10 }, (_, i) => {
      const h = i + 8;
      return `${h.toString().padStart(2, '0')}:00`;
  });
  
  const dailySchedule = getDailySchedule();

  return (
    <div className={`flex h-full bg-slate-50 dark:bg-slate-950 gap-4 transition-colors duration-500 ${isEmergency ? 'bg-red-50 dark:bg-red-900/10' : ''}`}>
      
      {isEmergency && (
          <div className="fixed inset-0 z-[60] pointer-events-none flex items-start justify-center pt-4">
              <div className="bg-red-600 text-white px-8 py-4 rounded-b-xl shadow-2xl animate-pulse pointer-events-auto flex items-center gap-6 border-4 border-white">
                  <AlertOctagon size={48} className="animate-bounce" />
                  <div>
                      <h2 className="text-3xl font-black uppercase tracking-widest">URGENCE VITALE</h2>
                      <p className="text-lg font-bold">Patient : {emergencyPatient} - Service Urgences</p>
                  </div>
                  <button onClick={stopAlarm} className="bg-white text-red-600 px-6 py-3 rounded-lg font-black hover:bg-red-100 transition-colors shadow-lg flex items-center gap-2">
                      <VolumeX size={24}/> STOP ALARME
                  </button>
              </div>
          </div>
      )}

      {/* Sidebar Navigation */}
      <div className="w-20 lg:w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full py-6 transition-colors duration-300">
         <div className="px-6 mb-8 hidden lg:block">
            <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Espace Médecin</h2>
         </div>
         <nav className="flex-1 space-y-1 px-2 lg:px-4">
            {[
              { id: 'dashboard', label: 'Tableau de bord', icon: Activity },
              { id: 'messages', label: 'Demandes RDV', icon: Inbox },
              { id: 'planning', label: 'Planning', icon: Calendar },
              { id: 'patients', label: 'Mes Patients', icon: User },
              { id: 'pharmacy', label: 'Pharmacie', icon: ShoppingBag },
            ].map(item => (
               <button
                  key={item.id}
                  onClick={() => { setCurrentView(item.id as any); setSelectedPatient(null); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${
                     currentView === item.id 
                     ? 'bg-blue-50 dark:bg-slate-800 text-blue-700 dark:text-emerald-400 shadow-sm' 
                     : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
               >
                  <item.icon size={20} />
                  <span className="hidden lg:inline">{item.label}</span>
                  {item.id === 'messages' && incomingRequests.length > 0 && (
                     <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
               </button>
            ))}
         </nav>
         <div className="px-4 mt-auto">
             <button className="w-full flex items-center gap-3 px-3 py-3 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 rounded-xl transition-all">
                <LogOut size={20} />
                <span className="hidden lg:inline font-medium">Déconnexion</span>
             </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-8">
         {currentView === 'dashboard' && (
            <div className="space-y-6 animate-fade-in relative">
              {notification && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full animate-slide-down bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
                    <CheckCircle size={20} />
                    <span className="font-bold">{notification}</span>
                </div>
              )}
              {/* Header Dashboard */}
              <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bonjour, Dr. Kossi 👋</h1>
                  <p className="text-slate-500 dark:text-slate-400">Vous avez <span className="text-blue-600 dark:text-emerald-400 font-bold">{incomingRequests.length} messages</span> en attente.</p>
                </div>
                <div className="flex gap-3">
                  <div className="text-right hidden md:block">
                    <p className="text-2xl font-bold text-slate-800 dark:text-white">09:30</p>
                    <p className="text-sm text-slate-400">Lun, 12 Oct</p>
                  </div>
                </div>
              </div>
              {/* Metrics (Simulated) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 {/* ... Metrics cards ... */}
                 <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50 flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start"><div className="p-2 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-lg"><User size={20}/></div></div>
                    <div><span className="text-3xl font-bold text-slate-800 dark:text-white">12</span><p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Rendez-vous</p></div>
                 </div>
                 <div className={`p-6 rounded-2xl border flex flex-col justify-between h-32 transition-colors ${isEmergency ? 'bg-red-600 text-white border-red-700 animate-pulse' : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/50'}`}>
                   <div className="flex justify-between items-start">
                    <div className={`p-2 rounded-lg ${isEmergency ? 'bg-white text-red-600' : 'bg-red-100 dark:bg-red-800 text-red-600 dark:text-red-300'}`}><Activity size={20}/></div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isEmergency ? 'bg-white text-red-600' : 'text-red-400 bg-white dark:bg-slate-800'}`}>Urgent</span>
                  </div>
                  <div>
                    <span className={`text-3xl font-bold ${isEmergency ? 'text-white' : 'text-slate-800 dark:text-white'}`}>{isEmergency ? '1 ACTIF' : '2'}</span>
                    <p className={`text-sm font-medium ${isEmergency ? 'text-red-100' : 'text-slate-500 dark:text-slate-400'}`}>{isEmergency ? 'URGENCE EN COURS' : 'Cas Critiques'}</p>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-2xl border border-purple-100 dark:border-purple-900/50 flex flex-col justify-between h-32">
                   <div className="flex justify-between items-start">
                    <div className="p-2 bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 rounded-lg"><TestTube size={20}/></div>
                  </div>
                  <div>
                    <span className="text-3xl font-bold text-slate-800 dark:text-white">5</span>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Résultats Labo</p>
                  </div>
                </div>
                 <button onClick={() => setCurrentView('messages')} className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex flex-col justify-between h-32 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all cursor-pointer relative group">
                   <div className="flex justify-between items-start">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-800 text-emerald-600 dark:text-emerald-300 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-800"><Mail size={20}/></div>
                     {incomingRequests.length > 0 && <span className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                  </div>
                  <div className="text-left">
                    <span className="text-3xl font-bold text-emerald-800 dark:text-emerald-200">{incomingRequests.length}</span>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Demandes Patients</p>
                  </div>
                </button>
              </div>
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 transition-colors">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-6">Prochain Patient</h3>
                  <div className="flex items-center gap-6 p-4 border border-blue-100 dark:border-slate-700 bg-blue-50/30 dark:bg-slate-800/50 rounded-xl">
                      <div className="w-16 h-16 rounded-full bg-blue-200 dark:bg-slate-700 text-blue-700 dark:text-blue-300 flex items-center justify-center text-2xl font-bold">AM</div>
                      <div className="flex-1">
                          <h4 className="text-xl font-bold text-slate-800 dark:text-white">Alain Mensah</h4>
                          <p className="text-slate-500 dark:text-slate-400">Consultation Générale • 09:30</p>
                      </div>
                      <button onClick={() => { setSelectedPatient(patientsList[0]); setCurrentView('patients'); }} className="bg-blue-600 dark:bg-emerald-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:bg-blue-700 dark:hover:bg-emerald-700">Ouvrir Dossier</button>
                  </div>
              </div>
            </div>
         )}
         
         {/* --- PLANNING VIEW --- */}
         {currentView === 'planning' && (
             <div className="animate-fade-in space-y-6 h-full flex flex-col">
                 <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                           <Calendar className="text-blue-600 dark:text-emerald-400"/> Planning de la journée
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Aujourd'hui, {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                    </div>
                    <div className="flex gap-2">
                        <NeonButton variant="secondary" onClick={() => {}}>Vue Semaine</NeonButton>
                        <NeonButton variant="primary" onClick={() => {}}>Ajouter RDV</NeonButton>
                    </div>
                 </div>

                 <div className="flex flex-col lg:flex-row gap-6 flex-1 overflow-hidden">
                     {/* Calendar/Timeline Area */}
                     <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-y-auto p-6 relative transition-colors">
                         <div className="space-y-0 relative">
                             <div className="absolute left-[70px] top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800"></div>

                             {hours.map((hour) => {
                                 const appts = dailySchedule.filter(a => a.time.startsWith(hour.split(':')[0]));
                                 
                                 return (
                                     <div key={hour} className="flex min-h-[100px] border-b border-slate-50 dark:border-slate-800 last:border-0 relative group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                         <div className="w-16 text-right pr-4 py-4 text-xs font-bold text-slate-400 dark:text-slate-500 font-mono shrink-0">
                                             {hour}
                                         </div>
                                         
                                         <div className="flex-1 py-2 px-2 relative">
                                             {appts.length > 0 ? (
                                                 appts.map((appt, idx) => (
                                                     <div 
                                                        key={idx} 
                                                        className={`
                                                            p-3 rounded-xl border-l-4 shadow-sm mb-2 flex justify-between items-center cursor-pointer hover:shadow-md transition-all
                                                            ${appt.type === 'urgency' ? 'bg-red-50 dark:bg-red-900/30 border-l-red-500 text-red-900 dark:text-red-200' : 
                                                              appt.type === 'meeting' ? 'bg-purple-50 dark:bg-purple-900/30 border-l-purple-500 text-purple-900 dark:text-purple-200' :
                                                              appt.type === 'break' ? 'bg-slate-100 dark:bg-slate-800 border-l-slate-400 text-slate-600 dark:text-slate-400 opacity-70' :
                                                              'bg-blue-50 dark:bg-blue-900/30 border-l-blue-500 text-blue-900 dark:text-blue-200'
                                                            }
                                                        `}
                                                     >
                                                         <div>
                                                             <div className="flex items-center gap-2">
                                                                 <span className="font-bold text-sm">{appt.time}</span>
                                                                 <span className="font-bold text-base">{appt.patientName}</span>
                                                             </div>
                                                             {appt.note && <p className="text-xs opacity-80 mt-1">{appt.note}</p>}
                                                         </div>
                                                     </div>
                                                 ))
                                             ) : (
                                                 <div className="h-full w-full border-2 border-dashed border-transparent rounded-xl flex items-center justify-center group-hover:border-slate-200 dark:group-hover:border-slate-700 transition-colors">
                                                     <span className="text-xs text-slate-400 font-medium opacity-0 group-hover:opacity-100 flex items-center gap-1 cursor-pointer">
                                                         <Plus size={14} /> Disponible
                                                     </span>
                                                 </div>
                                             )}
                                         </div>
                                     </div>
                                 );
                             })}
                         </div>
                     </div>

                     {/* Sidebar Summary */}
                     <div className="w-full lg:w-72 flex flex-col gap-4">
                         <GlassCard className="bg-blue-600 dark:bg-emerald-600 text-white border-none">
                             <div className="flex items-center gap-3 mb-4">
                                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                     <Clock size={20} />
                                 </div>
                                 <div>
                                     <p className="text-xs text-blue-100 dark:text-emerald-100 uppercase font-bold">Heure Actuelle</p>
                                     <p className="text-2xl font-bold font-mono">09:30</p>
                                 </div>
                             </div>
                             <div className="space-y-2">
                                 <div className="flex justify-between text-sm border-b border-white/20 pb-1">
                                     <span>RDV Total</span>
                                     <span className="font-bold">{dailySchedule.filter(x => x.type !== 'break').length}</span>
                                 </div>
                                 <div className="flex justify-between text-sm border-b border-white/20 pb-1">
                                     <span>Urgences</span>
                                     <span className="font-bold text-red-200">{dailySchedule.filter(x => x.type === 'urgency').length}</span>
                                 </div>
                             </div>
                         </GlassCard>

                         <GlassCard>
                             <h4 className="font-bold text-slate-800 dark:text-white mb-3 text-sm">Prochaine Pause</h4>
                             <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                 <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 p-2 rounded-lg">
                                     <Clock size={18}/>
                                 </div>
                                 <div>
                                     <p className="font-bold text-slate-700 dark:text-slate-200">13:00</p>
                                     <p className="text-xs text-slate-500 dark:text-slate-400">Déjeuner (1h)</p>
                                 </div>
                             </div>
                         </GlassCard>
                     </div>
                 </div>
             </div>
         )}
         
         {currentView === 'messages' && (
              <div className="space-y-6 animate-fade-in max-w-4xl mx-auto relative">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-3">Demandes de Rendez-vous</h2>
                  {/* ... Messages logic (kept from previous code) ... */}
                  {incomingRequests.length === 0 ? <p className="text-center text-slate-500 py-10">Aucune demande.</p> : incomingRequests.map((req, idx) => (
                      <GlassCard key={idx} className="border-l-4 border-l-blue-500 p-0 overflow-hidden">
                          <div className="p-6">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{req.patientName}</h3>
                                    <p className="text-sm text-slate-500">Service : <span className="font-bold text-blue-600 dark:text-emerald-400">{req.service || 'Général'}</span></p>
                                  </div>
                                  <Badge color={req.service === 'Urgence' ? 'red' : 'blue'}>{req.service === 'Urgence' ? 'URGENT' : 'Nouveau'}</Badge>
                              </div>
                              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 mb-4 italic border border-slate-100 dark:border-slate-800">
                                  "{req.symptoms}"
                              </div>
                              
                              <div className="flex flex-col md:flex-row gap-4 items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                                  <div className="flex items-center gap-2 w-full md:w-auto">
                                      <Clock size={16} className="text-slate-400"/>
                                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 whitespace-nowrap">Proposer un horaire :</span>
                                  </div>
                                  <div className="flex gap-2 w-full overflow-x-auto pb-1 md:pb-0">
                                      {['09:00', '10:30', '14:00', '15:15'].map(time => (
                                          <button 
                                            key={time}
                                            onClick={() => handleConfirmAppointment(req, time)}
                                            className="px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-300 dark:hover:border-blue-700 hover:text-blue-600 dark:hover:text-blue-300 transition-colors whitespace-nowrap"
                                          >
                                              {time}
                                          </button>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </GlassCard>
                  ))}
              </div>
         )}

         {/* --- PHARMACY VIEW --- */}
         {currentView === 'pharmacy' && (
             <div className="h-full">
                 <PublicPharmacy userType="doctor" />
             </div>
         )}
         
         {/* --- PATIENTS VIEW --- */}
         {currentView === 'patients' && (
             !selectedPatient ? (
                 <div className="h-full bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 animate-fade-in flex flex-col transition-colors">
                    <div className="flex justify-between items-center mb-6">
                       <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Liste des Patients</h2>
                       <div className="flex gap-3">
                           <div className="relative">
                              <Search className="absolute left-3 top-3 text-slate-400" size={16}/>
                              <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:border-blue-500 dark:text-white" />
                           </div>
                           <NeonButton onClick={() => setShowAddPatientModal(true)} icon={Plus}>Nouveau Patient</NeonButton>
                       </div>
                    </div>

                    <div className="overflow-x-auto">
                       <table className="w-full text-left border-collapse">
                          <thead>
                             <tr className="text-slate-400 text-sm border-b border-slate-100 dark:border-slate-800">
                                <th className="py-3 px-4 font-medium">Nom</th>
                                <th className="py-3 px-4 font-medium">Âge/Sexe</th>
                                <th className="py-3 px-4 font-medium">Téléphone</th>
                                <th className="py-3 px-4 font-medium">Dernier Motif</th>
                                <th className="py-3 px-4 font-medium">Action</th>
                             </tr>
                          </thead>
                          <tbody>
                             {patientsList.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800 last:border-0 transition-colors">
                                   <td className="py-3 px-4 font-bold text-slate-700 dark:text-slate-200">{p.name}</td>
                                   <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-sm">{p.age} ans / {p.gender}</td>
                                   <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-sm font-mono">{p.phone || '-'}</td>
                                   <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-sm">{p.diagnosis || 'Nouveau'}</td>
                                   <td className="py-3 px-4">
                                      <button 
                                        onClick={() => setSelectedPatient(p)}
                                        className="text-xs bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 dark:hover:bg-slate-700 transition-colors"
                                      >
                                         Ouvrir
                                      </button>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>
             ) : (
                  <div className="h-full flex flex-col animate-fade-in gap-6">
                    {/* Top Bar: Identity - ENRICHED */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start gap-4 transition-colors">
                       <div className="flex gap-6">
                          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                             <User size={40} />
                          </div>
                          <div>
                             <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{selectedPatient.name}</h1>
                             <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400 mt-2">
                                <span className="flex items-center gap-1"><Calendar size={14}/> {selectedPatient.age} ans</span>
                                <span className="flex items-center gap-1"><User size={14}/> {selectedPatient.gender}</span>
                                <span className="flex items-center gap-1"><Phone size={14}/> {selectedPatient.phone || 'Non renseigné'}</span>
                                <span className="flex items-center gap-1"><MapPin size={14}/> {selectedPatient.address || 'Non renseigné'}</span>
                             </div>
                             
                             <div className="flex flex-wrap gap-2 mt-4">
                                <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                    <Ruler size={12}/> {selectedPatient.height ? `${selectedPatient.height} cm` : '--'}
                                </span>
                                <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                                    <Weight size={12}/> {selectedPatient.weight ? `${selectedPatient.weight} kg` : '--'}
                                </span>
                                <span className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-200 dark:border-red-900/50 flex items-center gap-1">
                                    <Droplet size={12}/> {selectedPatient.bloodType || 'Gr?'}
                                </span>
                                <Badge color="red">Allergies: {selectedPatient.allergies || 'Aucune'}</Badge>
                             </div>
                          </div>
                       </div>
                       <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 self-start">
                          <X size={24} />
                       </button>
                    </div>

                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
                       {/* Left Col: History & Vitals */}
                       <div className="space-y-6">
                          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-blue-600 dark:text-emerald-400" /> Prise de Constantes
                             </h3>
                             <div className="space-y-3">
                                <NeonInput label="Tension (mmHg)" placeholder="120/80" value={vitals.bp} onChange={(e) => setVitals({...vitals, bp: e.target.value})} />
                                <NeonInput label="Température (°C)" placeholder="37.5" value={vitals.temp} onChange={(e) => setVitals({...vitals, temp: e.target.value})} />
                                <NeonInput label="Poids Actuel (kg)" placeholder={selectedPatient.weight} value={vitals.weight} onChange={(e) => setVitals({...vitals, weight: e.target.value})} />
                             </div>
                          </div>
                          {/* History List */}
                          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 transition-colors">
                             <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-blue-600 dark:text-emerald-400" /> Historique
                             </h3>
                             <div className="space-y-4">
                                {MOCK_HISTORY.map((evt, i) => (
                                  <div key={i} className="flex gap-3">
                                     <div className="w-2 h-2 mt-2 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                                     <div>
                                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200">{evt.date}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">{evt.note}</p>
                                     </div>
                                  </div>
                                ))}
                             </div>
                          </div>
                       </div>

                       {/* Center & Right: Consultation */}
                       <div className="lg:col-span-2 flex flex-col gap-6">
                          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex-1 transition-colors">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                                    <Stethoscope size={20} className="text-blue-600 dark:text-emerald-400" /> Consultation
                                </h3>
                             </div>

                             <div className="space-y-4">
                                <NeonInput as="textarea" label="Symptômes" placeholder="Le patient décrit..." value={notes} onChange={(e) => setNotes(e.target.value)}/>
                                <NeonInput as="textarea" label="Diagnostic" placeholder="Conclusion médicale..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="font-bold text-slate-800 dark:text-white"/>
                             </div>

                             {/* Prescription */}
                             <div className="mt-8 border-t border-slate-100 dark:border-slate-800 pt-6">
                                <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2"><Pill size={18} className="text-blue-600 dark:text-emerald-400" /> Ordonnance</h4>
                                <div className="flex gap-2 mb-3">
                                   <div className="flex-1">
                                      <input list="meds" className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500" placeholder="Nom du médicament" value={medInput} onChange={(e) => setMedInput(e.target.value)}/>
                                      <datalist id="meds">{MOCK_MEDS.map(m => <option key={m} value={m} />)}</datalist>
                                   </div>
                                   <input className="w-1/3 p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500" placeholder="Posologie" value={doseInput} onChange={(e) => setDoseInput(e.target.value)}/>
                                   <button onClick={addMedication} className="bg-blue-600 dark:bg-emerald-600 text-white p-2 rounded-lg hover:bg-blue-700 dark:hover:bg-emerald-700"><Plus size={20}/></button>
                                </div>
                                {prescription.length > 0 && (
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2 mb-4">
                                       {prescription.map((item, idx) => (
                                         <div key={idx} className="flex justify-between items-center text-sm border-b border-blue-100 dark:border-blue-800 last:border-0 pb-1">
                                            <span className="font-medium text-slate-700 dark:text-slate-200">• {item.med}</span>
                                            <span className="text-slate-500 dark:text-slate-400 italic">{item.dose}</span>
                                            <button onClick={() => removeMedication(idx)} className="text-red-400 hover:text-red-600"><X size={14}/></button>
                                         </div>
                                       ))}
                                    </div>
                                )}
                             </div>
                             
                             <div className="mt-6 flex flex-wrap gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-emerald-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-emerald-700 shadow-md"><Send size={16} /> Enregistrer & Envoyer</button>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
             )
         )}
         
      </div>

      {/* --- MODAL: NOUVEAU PATIENT --- */}
      {showAddPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
            <GlassCard className="w-full max-w-2xl p-0 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <UserPlus size={24} className="text-medical-primary"/> Enregistrement Patient
                    </h2>
                    <button onClick={() => setShowAddPatientModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
                    <form id="newPatientForm" onSubmit={handleSavePatient} className="space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={16}/> Identité & Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <NeonInput label="Nom Complet" placeholder="Ex: Jean Kouassi" required value={newPatientData.name} onChange={e => setNewPatientData({...newPatientData, name: e.target.value})} />
                                <div className="grid grid-cols-2 gap-2">
                                    <NeonInput label="Âge" type="number" placeholder="30" required value={newPatientData.age} onChange={e => setNewPatientData({...newPatientData, age: e.target.value})} />
                                    <NeonInput as="select" label="Sexe" options={['Homme', 'Femme', 'Enfant']} value={newPatientData.gender} onChange={e => setNewPatientData({...newPatientData, gender: e.target.value})} />
                                </div>
                                <NeonInput label="Téléphone" placeholder="+228..." required value={newPatientData.phone} onChange={e => setNewPatientData({...newPatientData, phone: e.target.value})} />
                                <NeonInput label="Adresse / Quartier" placeholder="Lomé..." value={newPatientData.address} onChange={e => setNewPatientData({...newPatientData, address: e.target.value})} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Activity size={16}/> Données Biométriques
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <NeonInput label="Taille (cm)" type="number" placeholder="175" value={newPatientData.height} onChange={e => setNewPatientData({...newPatientData, height: e.target.value})} />
                                <NeonInput label="Poids (kg)" type="number" placeholder="70" value={newPatientData.weight} onChange={e => setNewPatientData({...newPatientData, weight: e.target.value})} />
                                <NeonInput as="select" label="Groupe Sanguin" options={['', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} value={newPatientData.bloodType} onChange={e => setNewPatientData({...newPatientData, bloodType: e.target.value})} />
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <AlertCircle size={16}/> Antécédents
                            </h3>
                            <div className="space-y-4">
                                <NeonInput label="Allergies Connues" placeholder="Ex: Pénicilline, Arachides..." value={newPatientData.allergies} onChange={e => setNewPatientData({...newPatientData, allergies: e.target.value})} />
                                <NeonInput as="textarea" label="Antécédents Médicaux / Notes" placeholder="Diabète familial, Asthme..." value={newPatientData.history} onChange={e => setNewPatientData({...newPatientData, history: e.target.value})} />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 sticky bottom-0 z-10 flex gap-3">
                    <NeonButton type="button" variant="secondary" onClick={() => setShowAddPatientModal(false)} className="flex-1">Annuler</NeonButton>
                    <NeonButton type="submit" form="newPatientForm" variant="primary" icon={Save} className="flex-1">Enregistrer le Patient</NeonButton>
                </div>
            </GlassCard>
        </div>
      )}

    </div>
  );
};

export default DoctorDashboard;