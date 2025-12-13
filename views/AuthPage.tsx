import React, { useState } from 'react';
import { GlassCard, NeonButton, NeonInput, Badge } from '../components/UI';
import { User, Lock, Mail, Phone, ArrowLeft, ShieldCheck, UserPlus, LogIn, Stethoscope, Pill, Briefcase, KeyRound, Moon, Sun, X } from 'lucide-react';
import { Role } from '../types';

interface AuthPageProps {
  onLoginSuccess: (role: Role) => void;
  onBack: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess, onBack, darkMode, toggleTheme }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form States
  const [role, setRole] = useState<Role>(Role.PATIENT); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Security Key State (Pour le staff)
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [keyError, setKeyError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    
    // Simuler délai API
    setTimeout(() => {
      setLoading(false);
      
      if (role === Role.PATIENT) {
        // Le patient n'a pas besoin de clé spéciale
        onLoginSuccess(role);
      } else {
        // Le staff doit entrer la clé d'accès
        setShowKeyInput(true);
      }
    }, 1000);
  };

  const verifyKeyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessKey === 'KEY_DEV') {
        onLoginSuccess(role);
    } else {
        setKeyError("Clé d'accès incorrecte. Accès refusé.");
    }
  };

  const roles = [
    { id: Role.PATIENT, label: 'Patient', icon: User, desc: 'Espace Santé' },
    { id: Role.DOCTOR, label: 'Médecin', icon: Stethoscope, desc: 'Espace Pro' },
    { id: Role.PHARMACIST, label: 'Pharmacie', icon: Pill, desc: 'Gestion Stocks' },
    { id: Role.ADMIN, label: 'Admin', icon: Briefcase, desc: 'Gestion Globale' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Left Side - Image & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-medical-dark dark:bg-slate-900 relative overflow-hidden items-center justify-center text-white p-12 transition-colors">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80')] bg-cover opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-medical-dark via-emerald-900/90 to-medical-primary/40 dark:from-slate-900 dark:via-emerald-950/80 dark:to-slate-800/40"></div>
        
        <div className="relative z-10 max-w-lg space-y-8 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-emerald-900/50 mb-8">
             <span className="text-medical-primary text-3xl font-bold">Γ</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight">
            Bienvenue sur <br/>
            <span className="text-emerald-300">Clinique Gamma</span>
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed">
            La plateforme de gestion médicale nouvelle génération. 
            Connectez-vous pour accéder à votre espace personnel ou professionnel.
          </p>
          
          <div className="flex gap-4 pt-4">
             <div className="flex items-center gap-2 bg-emerald-800/50 dark:bg-slate-800/50 p-3 rounded-lg backdrop-blur-sm border border-emerald-700 dark:border-slate-700">
                <ShieldCheck className="text-emerald-300" />
                <span className="text-sm font-medium">Données Sécurisées</span>
             </div>
             <div className="flex items-center gap-2 bg-emerald-800/50 dark:bg-slate-800/50 p-3 rounded-lg backdrop-blur-sm border border-emerald-700 dark:border-slate-700">
                <Stethoscope className="text-emerald-300" />
                <span className="text-sm font-medium">Outils Cliniques IA</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 md:p-6 lg:p-12 relative overflow-y-auto">
        <div className="absolute top-4 right-4 md:top-8 md:right-8 flex gap-2 md:gap-4 z-20">
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Changer de thème"
              >
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-medical-primary dark:hover:text-emerald-400 transition-colors font-medium text-sm bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm lg:bg-transparent lg:shadow-none lg:p-0"
            >
                <span className="hidden lg:inline"><ArrowLeft size={16} /></span> 
                Site Vitrine
                <span className="lg:hidden"><ArrowLeft size={16} /></span>
            </button>
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in mt-12 lg:mt-0">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    {isLogin ? 'Connexion' : 'Créer un compte'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2">
                    {isLogin ? 'Identifiez-vous pour accéder à votre espace.' : 'Rejoignez la Clinique Gamma.'}
                </p>
            </div>

            <GlassCard className="border-emerald-100 shadow-xl shadow-emerald-50/50 dark:shadow-none dark:border-slate-800 relative">
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Role Selection Grid - Responsive */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                            {isLogin ? 'Se connecter en tant que :' : 'Je suis :'}
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setRole(r.id)}
                                    className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-all ${
                                        role === r.id 
                                        ? 'bg-medical-primary dark:bg-emerald-600 text-white border-medical-primary dark:border-emerald-600 ring-2 ring-emerald-200 dark:ring-emerald-900 ring-offset-1 shadow-md' 
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-medical-primary dark:hover:border-emerald-500 hover:text-medical-primary dark:hover:text-emerald-500'
                                    }`}
                                >
                                    <r.icon size={18} />
                                    <div className="text-center w-full">
                                        <span className="block text-[10px] font-bold uppercase truncate">{r.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {!isLogin && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <NeonInput 
                                label="Nom complet" 
                                placeholder={role === Role.DOCTOR ? "Dr. Jean Dupont" : "Jean Dupont"}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required 
                            />
                            <NeonInput 
                                label="Téléphone" 
                                placeholder="+228..." 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    )}

                    <NeonInput 
                        label="Email" 
                        type="email" 
                        placeholder={role === Role.DOCTOR ? "medecin@clinique.com" : "email@exemple.com"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    
                    <div>
                        <NeonInput 
                            label="Mot de passe" 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                         {isLogin && (
                            <div className="flex justify-end mt-1">
                                <a href="#" className="text-xs text-medical-primary hover:underline font-medium dark:text-emerald-400">Mot de passe oublié ?</a>
                            </div>
                        )}
                    </div>

                    <NeonButton 
                        type="submit" 
                        variant="primary" 
                        className="w-full py-3 mt-4" 
                        icon={loading ? undefined : (isLogin ? LogIn : UserPlus)}
                    >
                        {loading ? 'Connexion en cours...' : (isLogin ? `Accéder (${roles.find(r => r.id === role)?.label})` : 'S\'inscrire')}
                    </NeonButton>
                </form>

                {/* --- MODAL CLÉ D'ACCÈS POUR LE PERSONNEL --- */}
                {showKeyInput && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl z-20 flex flex-col items-center justify-center p-6 animate-fade-in text-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full text-red-600 dark:text-red-400 mb-4">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Accès Restreint</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                            L'accès à l'espace <strong>{roles.find(r => r.id === role)?.label}</strong> nécessite une clé de sécurité.
                        </p>
                        <form onSubmit={verifyKeyAndLogin} className="w-full space-y-4">
                            <NeonInput 
                                label="Clé d'Accès Staff"
                                type="password"
                                placeholder="Entrez la clé..."
                                value={accessKey}
                                onChange={(e) => {setAccessKey(e.target.value); setKeyError('')}}
                                autoFocus
                            />
                            {keyError && <p className="text-red-500 text-xs font-bold">{keyError}</p>}
                            
                            <NeonButton type="submit" variant="primary" className="w-full" icon={KeyRound}>
                                Valider l'accès
                            </NeonButton>
                            <button 
                                type="button"
                                onClick={() => {setShowKeyInput(false); setAccessKey(''); setKeyError('')}}
                                className="text-sm text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 mt-2"
                            >
                                Annuler
                            </button>
                        </form>
                    </div>
                )}
            </GlassCard>

            <div className="text-center pb-8 lg:pb-0">
                <p className="text-slate-600 dark:text-slate-400">
                    {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                        }}
                        className="ml-2 font-bold text-medical-primary hover:underline focus:outline-none dark:text-emerald-400"
                    >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
        
        {/* Footer info */}
        <div className="lg:absolute bottom-6 text-slate-400 text-xs dark:text-slate-500">
            &copy; {new Date().getFullYear()} Clinique Gamma. Sécurité HIPAA & RGPD.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;