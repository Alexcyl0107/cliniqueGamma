import React, { useState } from 'react';
import { GlassCard, NeonButton, NeonInput, Badge } from '../components/UI';
import { User, Lock, Mail, Phone, ArrowLeft, ShieldCheck, UserPlus, LogIn, Stethoscope, Pill, Briefcase, KeyRound, Moon, Sun, X, Plus } from 'lucide-react';
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
  
  // États du formulaire
  const [role, setRole] = useState<Role>(Role.PATIENT); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // État Clé de Sécurité (Staff)
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [accessKey, setAccessKey] = useState('');
  const [keyError, setKeyError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    
    // Simulation délai API
    setTimeout(() => {
      setLoading(false);
      
      if (role === Role.PATIENT) {
        onLoginSuccess(role);
      } else {
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
      
      {/* Côté Gauche - Image & Branding */}
      <div className="hidden lg:flex w-1/2 bg-medical-dark dark:bg-slate-900 relative overflow-hidden items-center justify-center text-white p-12 transition-colors">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80')] bg-cover opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-medical-dark via-emerald-900/90 to-medical-primary/40 dark:from-slate-900 dark:via-emerald-950/80 dark:to-slate-800/40"></div>
        
        <div className="relative z-10 max-w-lg space-y-8 animate-fade-in text-center lg:text-left">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-2xl shadow-emerald-900/50 mb-8 mx-auto lg:mx-0">
             <Plus className="text-medical-primary" strokeWidth={4} size={36} />
          </div>
          <h1 className="text-5xl font-black leading-tight tracking-tighter">
            Bienvenue sur <br/>
            <span className="text-emerald-300">Clinique Gamma</span>
          </h1>
          <p className="text-emerald-100 text-lg leading-relaxed font-medium">
            La plateforme de gestion médicale nouvelle génération. 
            Connectez-vous pour accéder à votre espace personnel ou professionnel.
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 justify-center lg:justify-start">
             <div className="flex items-center gap-2 bg-emerald-800/50 dark:bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-emerald-700 dark:border-slate-700">
                <ShieldCheck className="text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-widest">Données Sécurisées</span>
             </div>
             <div className="flex items-center gap-2 bg-emerald-800/50 dark:bg-slate-800/50 p-3 rounded-xl backdrop-blur-sm border border-emerald-700 dark:border-slate-700">
                <Stethoscope className="text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-widest">Outils Précis</span>
             </div>
          </div>
        </div>
      </div>

      {/* Côté Droit - Formulaire */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="absolute top-8 right-8 flex gap-4 z-20">
             <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
              >
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
            <button 
                onClick={onBack}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-medical-primary font-black uppercase text-[10px] tracking-widest"
            >
                <ArrowLeft size={16} /> Site Vitrine
            </button>
        </div>

        <div className="w-full max-w-md space-y-8 animate-fade-in">
            <div className="text-center">
                <h2 className="text-3xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                    {isLogin ? 'Connexion' : 'Créer un compte'}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {isLogin ? 'Accédez à vos outils de santé digitaux.' : 'Rejoignez le réseau Clinique Gamma.'}
                </p>
            </div>

            <GlassCard className="border-emerald-100 dark:border-slate-800 shadow-xl shadow-emerald-50/50 dark:shadow-none">
                <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Choix du rôle */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                            Type de compte
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {roles.map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setRole(r.id)}
                                    className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                                        role === r.id 
                                        ? 'bg-medical-primary dark:bg-emerald-600 text-white border-medical-primary shadow-lg ring-2 ring-emerald-500/20' 
                                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 hover:border-emerald-500'
                                    }`}
                                >
                                    <r.icon size={18} />
                                    <span className="text-[10px] font-black uppercase tracking-tight">{r.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                      {!isLogin && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <NeonInput 
                                  label="Nom complet" 
                                  placeholder="Ex: Koffi Mensah"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  required 
                              />
                              <NeonInput 
                                  label="Mobile" 
                                  placeholder="+228..." 
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                              />
                          </div>
                      )}

                      <NeonInput 
                          label="E-mail" 
                          type="email" 
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                      
                      <NeonInput 
                          label="Mot de passe" 
                          type="password" 
                          placeholder="••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                    </div>

                    <NeonButton 
                        type="submit" 
                        variant="primary" 
                        className="w-full py-4 mt-2" 
                        icon={loading ? undefined : (isLogin ? LogIn : UserPlus)}
                        disabled={loading}
                    >
                        {loading ? 'Traitement...' : (isLogin ? 'Se connecter' : 'Valider inscription')}
                    </NeonButton>
                </form>

                {/* MODAL CLÉ D'ACCÈS */}
                {showKeyInput && (
                    <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl z-20 flex flex-col items-center justify-center p-8 animate-fade-in text-center">
                        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full text-red-600 dark:text-red-400 mb-4 shadow-sm">
                            <Lock size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase tracking-tighter">Accès Restreint Staff</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 font-bold">
                            Veuillez saisir votre clé d'authentification professionnelle.
                        </p>
                        <form onSubmit={verifyKeyAndLogin} className="w-full space-y-4">
                            <NeonInput 
                                label="Clé de sécurité"
                                type="password"
                                placeholder="Saisir la clé..."
                                value={accessKey}
                                onChange={(e) => {setAccessKey(e.target.value); setKeyError('')}}
                                autoFocus
                            />
                            {keyError && <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{keyError}</p>}
                            
                            <NeonButton type="submit" variant="primary" className="w-full" icon={KeyRound}>
                                Déverrouiller
                            </NeonButton>
                            <button 
                                type="button"
                                onClick={() => setShowKeyInput(false)}
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 hover:text-slate-800 dark:hover:text-slate-200"
                            >
                                Retour
                            </button>
                        </form>
                    </div>
                )}
            </GlassCard>

            <div className="text-center pb-8">
                <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">
                    {isLogin ? "Nouveau ici ?" : "Déjà membre ?"}
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="ml-2 font-black text-medical-primary hover:underline dark:text-emerald-400 uppercase tracking-widest"
                    >
                        {isLogin ? "S'inscrire" : "Se connecter"}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;