import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Stethoscope, Pill, Settings, LogOut, Menu, UserCircle, Home, Calendar, Moon, Sun } from 'lucide-react';
import AdminDashboard from './views/AdminDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import PharmacyDashboard from './views/PharmacyDashboard';
import PatientDashboard from './views/PatientDashboard';
import LandingPage from './views/LandingPage';
import AuthPage from './views/AuthPage';
import { Role } from './types';
import { NeonButton } from './components/UI';

// Simple Navigation Component within App
interface SidebarItemProps {
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => (
  <div 
    onClick={onClick}
    className={`
      flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 group
      ${active 
        ? 'bg-medical-primary dark:bg-emerald-600 text-white shadow-md shadow-emerald-900/20' 
        : 'text-emerald-100/70 hover:text-white hover:bg-white/10'}
    `}
  >
    <Icon size={20} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
    <span className="font-medium">{label}</span>
  </div>
);

type ViewState = 'landing' | 'auth' | 'app';

const App = () => {
  const [viewState, setViewState] = useState<ViewState>('landing');
  const [currentRole, setCurrentRole] = useState<Role>(Role.PATIENT);
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // DARK MODE LOGIC
  const [darkMode, setDarkMode] = useState(() => {
     if (typeof window !== 'undefined') {
         return localStorage.getItem('theme') === 'dark' || 
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
     }
     return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  // --- NAVIGATION FLOW ---
  
  // 1. Landing Page
  if (viewState === 'landing') {
    return (
      <LandingPage 
        onLogin={() => setViewState('auth')} 
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 2. Authentication Page
  if (viewState === 'auth') {
    return (
      <AuthPage 
        onLoginSuccess={(role) => {
          setCurrentRole(role);
          setViewState('app');
        }} 
        onBack={() => setViewState('landing')} 
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  // 3. Main Application (Dashboard)
  const renderContent = () => {
    switch (currentRole) {
      case Role.ADMIN:
        return <AdminDashboard />;
      case Role.DOCTOR:
        return <DoctorDashboard />;
      case Role.PHARMACIST:
        return <PharmacyDashboard />;
      case Role.PATIENT:
        return <PatientDashboard />;
      default:
        return <AdminDashboard />;
    }
  };

  const getNavItems = () => {
    const common = [{ id: 'settings', label: 'Paramètres', icon: Settings }];
    
    if (currentRole === Role.ADMIN) {
        return [{ id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard }, ...common];
    }
    if (currentRole === Role.DOCTOR) {
        return [{ id: 'dashboard', label: 'Mes Patients', icon: Stethoscope }];
    }
    if (currentRole === Role.PHARMACIST) {
        return [{ id: 'dashboard', label: 'Inventaire', icon: Pill }, ...common];
    }
    if (currentRole === Role.PATIENT) {
        return [
            { id: 'dashboard', label: 'Mon Espace', icon: Home }, 
            { id: 'appts', label: 'Rendez-vous', icon: Calendar },
        ];
    }
    return [];
  };

  const getRoleLabel = (role: Role) => {
    switch(role) {
        case Role.DOCTOR: return 'Médecin';
        case Role.PHARMACIST: return 'Pharmacien';
        case Role.PATIENT: return 'Patient';
        case Role.ADMIN: return 'Admin';
        default: return role;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-medical-primary/20 overflow-hidden flex transition-colors duration-300 relative">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-medical-dark dark:bg-slate-900 shadow-2xl transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 flex flex-col border-r border-transparent dark:border-slate-800
      `}>
        <div className="p-8">
            <h1 className="font-sans text-2xl font-bold flex items-center gap-3 text-white">
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-lg">
                    <span className="text-medical-dark text-lg font-bold">Γ</span>
                </div>
                <span>Clinique<br/><span className="text-sm font-normal text-emerald-200">Gamma</span></span>
            </h1>
            <div className="mt-6 px-3 py-1 bg-emerald-800/50 dark:bg-slate-800/50 rounded text-xs font-semibold text-emerald-200 dark:text-emerald-400 uppercase tracking-widest border border-emerald-700 dark:border-slate-700">
                Espace {getRoleLabel(currentRole)}
            </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
            {getNavItems().map(item => (
                <SidebarItem 
                    key={item.id}
                    icon={item.icon} 
                    label={item.label} 
                    active={currentView === item.id}
                    onClick={() => {
                      setCurrentView(item.id);
                      setSidebarOpen(false); // Close on selection (mobile)
                    }}
                />
            ))}
        </nav>

        <div className="p-4 border-t border-emerald-800 dark:border-slate-800 space-y-4 bg-emerald-950/30 dark:bg-slate-900/50">
             {/* Theme Toggle */}
             <button 
                onClick={toggleTheme}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-emerald-900/40 dark:bg-slate-800 border border-emerald-800 dark:border-slate-700 text-emerald-100 dark:text-slate-300 hover:bg-emerald-800 dark:hover:bg-slate-700/80 transition-all"
             >
                <span className="text-xs font-bold flex items-center gap-2">
                    {darkMode ? <Moon size={14}/> : <Sun size={14}/>} Mode {darkMode ? 'Sombre' : 'Clair'}
                </span>
                <div className={`w-8 h-4 rounded-full relative transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-slate-500'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform ${darkMode ? 'left-4.5' : 'left-0.5'}`} style={{ left: darkMode ? '18px' : '2px' }}></div>
                </div>
             </button>

             {/* Role Switcher */}
            <div className="bg-emerald-900/50 dark:bg-slate-800 rounded-xl p-4 border border-emerald-800 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-800 dark:bg-slate-700 flex items-center justify-center border border-emerald-700 dark:border-slate-600">
                        <UserCircle size={24} className="text-emerald-200" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-white truncate">Utilisateur Connecté</p>
                        <p className="text-xs text-emerald-400 truncate font-medium">{getRoleLabel(currentRole)}</p>
                    </div>
                </div>
                
                <label className="text-xs text-emerald-50 block mb-1">Changer de rôle (Démo)</label>
                <select 
                    value={currentRole} 
                    onChange={(e) => { setCurrentRole(e.target.value as Role); setCurrentView('dashboard'); setSidebarOpen(false); }}
                    className="w-full bg-emerald-950 dark:bg-slate-900 border border-emerald-800 dark:border-slate-600 text-xs rounded-lg p-2 text-emerald-200 outline-none focus:border-emerald-500 mb-2"
                >
                    <option value={Role.PATIENT}>Patient</option>
                    <option value={Role.DOCTOR}>Médecin</option>
                    <option value={Role.PHARMACIST}>Pharmacien</option>
                    <option value={Role.ADMIN}>Admin</option>
                </select>
            </div>
            
            <button 
                onClick={() => setViewState('auth')} 
                className="w-full flex items-center justify-center gap-2 p-2 text-red-300 hover:bg-red-900/20 hover:text-red-200 rounded-lg transition-colors text-sm font-medium"
            >
                <LogOut size={16} /> Déconnexion
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-slate-50 dark:bg-slate-950 transition-colors duration-300 w-full">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center px-4 md:px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 justify-between shadow-sm z-30 shrink-0">
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSidebarOpen(!sidebarOpen)} 
                  className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
                <span className="font-bold text-slate-800 dark:text-white truncate">Clinique Gamma</span>
            </div>
            {/* You could add a user avatar or notifications here */}
        </header>

        {/* Content Area - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 relative">
            <div className="relative z-10 max-w-7xl mx-auto h-full pb-20 lg:pb-0">
                {renderContent()}
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;