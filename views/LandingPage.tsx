import React from 'react';
import { GlassCard, NeonButton, Badge } from '../components/UI';
import { 
  Stethoscope, TestTube, Pill, Calendar, Phone, MapPin, Mail, 
  User, Clock, ShieldCheck, ArrowRight, Activity, DollarSign,
  CheckCircle, Moon, Sun, HeartPulse, Microscope, Award, Lock, LogIn
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  darkMode: boolean;
  toggleTheme: () => void;
}

// --- MOCK DATA ---
const SERVICES = [
  { id: 'gen', name: 'Médecine Générale', icon: Stethoscope },
  { id: 'ped', name: 'Pédiatrie', icon: User },
  { id: 'cardio', name: 'Cardiologie', icon: Activity },
  { id: 'lab', name: 'Laboratoire', icon: TestTube },
];

// --- MAIN LANDING PAGE COMPONENT ---
const LandingPage: React.FC<LandingPageProps> = ({ onLogin, darkMode, toggleTheme }) => {
  
  // Fonction de scroll générique
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const offset = 80; // Hauteur de la navbar
      const elementPosition = section.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans overflow-y-auto overflow-x-hidden transition-colors duration-300">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-sans font-bold text-2xl flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
             <div className="w-8 h-8 rounded-lg bg-medical-primary flex items-center justify-center shadow-lg shadow-emerald-100 dark:shadow-none">
                <span className="text-white text-lg font-bold">Γ</span>
            </div>
            <span className="text-slate-800 dark:text-white">Clinique<span className="text-medical-primary">Gamma</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <button onClick={() => scrollToSection('services')} className="hover:text-medical-primary dark:hover:text-emerald-400 transition-colors">Services</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-medical-primary dark:hover:text-emerald-400 transition-colors">À propos</button>
            <button onClick={() => scrollToSection('appointment')} className="hover:text-medical-primary dark:hover:text-emerald-400 transition-colors">Rendez-vous</button>
            <button onClick={() => scrollToSection('team')} className="hover:text-medical-primary dark:hover:text-emerald-400 transition-colors">Équipe</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-medical-primary dark:hover:text-emerald-400 transition-colors">Contact</button>
          </div>

          <div className="flex items-center gap-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
                title="Changer de thème"
              >
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <NeonButton onClick={onLogin} variant="primary" icon={ShieldCheck}>
                Espace Pro
              </NeonButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/30 dark:to-slate-950 transition-colors duration-300">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80')] bg-cover opacity-5 dark:opacity-10 mask-image-linear-gradient-to-l pointer-events-none mix-blend-multiply dark:mix-blend-overlay"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8 animate-fade-in">
          <Badge color="green">Santé 3.0</Badge>
          <h1 className="text-5xl md:text-7xl font-sans font-bold leading-tight text-slate-900 dark:text-white">
            Votre santé mérite <br />
            <span className="text-medical-primary">le meilleur parcours.</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Bienvenue à la Clinique Gamma. Prenez rendez-vous en ligne en quelques clics, recevez vos résultats et consultez nos spécialistes sans attente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <NeonButton onClick={() => scrollToSection('appointment')} variant="primary" icon={Calendar} className="text-lg px-8 py-4 shadow-lg shadow-emerald-200 dark:shadow-none">
                Prendre Rendez-vous
            </NeonButton>
            <NeonButton onClick={() => scrollToSection('services')} variant="secondary" icon={ArrowRight} className="text-lg px-8 py-4">
                Découvrir nos soins
            </NeonButton>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white mb-4">
            Nos Pôles d'<span className="text-medical-primary">Excellence</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">Une prise en charge globale pour toute la famille, du diagnostic au traitement.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="group hover:border-emerald-200 dark:hover:border-emerald-800">
            <div className="w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:bg-medical-primary group-hover:text-white transition-colors">
              <Stethoscope size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Consultation Médicale</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Médecins généralistes et spécialistes disponibles du lundi au vendredi.
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-medical-primary"/> Cardiologie & Pédiatrie</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-medical-primary"/> Urgences 24/7</li>
            </ul>
          </GlassCard>

          <GlassCard className="group hover:border-teal-200 dark:hover:border-teal-800">
            <div className="w-14 h-14 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 mb-6 group-hover:bg-teal-500 group-hover:text-white transition-colors">
              <TestTube size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Laboratoire d’Analyses</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Analyses fiables : sang, urine, tests rapides. Résultats envoyés au médecin.
            </p>
             <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-teal-500"/> Hématologie</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-teal-500"/> Biochimie</li>
            </ul>
          </GlassCard>

          <GlassCard className="group hover:border-emerald-200 dark:hover:border-emerald-800">
            <div className="w-14 h-14 rounded-xl bg-lime-100 dark:bg-lime-900/30 flex items-center justify-center text-lime-600 dark:text-lime-400 mb-6 group-hover:bg-lime-600 group-hover:text-white transition-colors">
              <Pill size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Pharmacie Interne</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              Dispensation des médicaments et conseils pharmaceutiques sur place.
            </p>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-2">
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-lime-600"/> Médicaments essentiels</li>
                <li className="flex items-center gap-2"><ArrowRight size={14} className="text-lime-600"/> Suivi des ordonnances</li>
            </ul>
          </GlassCard>
        </div>
      </section>

      {/* --- SECTION À PROPOS --- */}
      <section id="about" className="py-20 px-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors">
         <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <Badge color="blue">À Propos de Nous</Badge>
                <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white">
                    L'Innovation au service de <br/>
                    <span className="text-medical-primary">Votre Bien-être</span>
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                    Fondée avec une vision futuriste, la <strong>Clinique Gamma</strong> fusionne l'expertise médicale humaine avec la puissance de l'intelligence artificielle pour offrir des diagnostics plus précis et un suivi personnalisé.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-lg"><HeartPulse size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Soins Humains</h4>
                            <p className="text-sm text-slate-500">Une écoute attentive à chaque étape.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg"><Microscope size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Technologie IA</h4>
                            <p className="text-sm text-slate-500">Analyses prédictives et rapides.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg"><ShieldCheck size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Sécurité Totale</h4>
                            <p className="text-sm text-slate-500">Vos données sont protégées.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-lg"><Award size={20}/></div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-white">Excellence</h4>
                            <p className="text-sm text-slate-500">Certifié par les autorités de santé.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-medical-primary/20 rounded-3xl transform rotate-3 blur-lg"></div>
                <img 
                    src="https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80" 
                    alt="Clinique Moderne" 
                    className="relative rounded-3xl shadow-2xl w-full h-[400px] object-cover border-4 border-white dark:border-slate-800"
                />
            </div>
         </div>
      </section>

      {/* APPOINTMENT SECTION - REDESIGNED FOR AUTH REQUIREMENT */}
      <section id="appointment" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Call to Action Login */}
            <div className="lg:col-span-7">
                <div className="mb-6">
                  <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-white">
                      Prendre <span className="text-medical-primary">Rendez-vous</span>
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                      Accédez à votre espace patient sécurisé pour planifier votre visite.
                  </p>
                </div>
                
                <GlassCard className="shadow-xl shadow-emerald-50 dark:shadow-none border-emerald-100 dark:border-slate-800 min-h-[400px] flex flex-col justify-center items-center text-center p-12">
                    <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-medical-primary mb-6 animate-pulse">
                        <Lock size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Connexion Requise</h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-8 max-w-md">
                        Pour garantir la confidentialité de vos informations médicales et assurer un suivi personnalisé, la prise de rendez-vous est réservée aux utilisateurs connectés.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                        <NeonButton onClick={onLogin} variant="primary" className="flex-1 py-4 text-lg" icon={LogIn}>
                            Se Connecter / S'inscrire
                        </NeonButton>
                    </div>
                    <p className="mt-6 text-sm text-slate-400">
                        C'est votre première visite ? Créez un compte en 2 minutes.
                    </p>
                </GlassCard>
            </div>

            {/* Right: Info Columns */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Hours */}
                <GlassCard className="flex flex-col gap-4 bg-emerald-900 dark:bg-slate-900 text-white border-none">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <Clock size={20} className="text-emerald-400" /> Horaires d'ouverture
                    </h3>
                    <div className="space-y-2 text-emerald-100 dark:text-slate-300">
                        <div className="flex justify-between border-b border-emerald-800 dark:border-slate-800 pb-2">
                            <span>Lundi - Vendredi</span>
                            <span className="text-white font-medium">08h00 - 17h00</span>
                        </div>
                        <div className="flex justify-between border-b border-emerald-800 dark:border-slate-800 pb-2">
                            <span>Samedi</span>
                            <span className="text-white font-medium">09h00 - 14h00</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span>Urgences</span>
                            <span className="text-emerald-300 font-bold flex items-center gap-1"><Activity size={14}/> 24h/24</span>
                        </div>
                    </div>
                </GlassCard>

                {/* Pricing / Payments */}
                 <GlassCard className="flex flex-col gap-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <DollarSign size={20} className="text-teal-600 dark:text-teal-400" /> Tarifs & Paiements
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Consultations généralistes à partir de 5000 F.
                        Paiements acceptés :
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                        <Badge color="blue">Espèces</Badge>
                        <Badge color="purple">Flooz / T-Money</Badge>
                        <Badge color="green">Assurances</Badge>
                    </div>
                </GlassCard>
            </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 px-6 bg-slate-50 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-bold text-center mb-16 text-slate-900 dark:text-white">
            Notre Équipe <span className="text-medical-primary">Médicale</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { name: 'Dr. Kossi', role: 'Médecin Généraliste', desc: 'Expert en suivi médical et prise en charge globale.', color: 'emerald' },
                    { name: 'Dr. Ama', role: 'Pédiatre', desc: 'Spécialiste des soins pour enfants et adolescents.', color: 'teal' },
                    { name: 'Mme. Adjovi', role: 'Pharmacienne', desc: 'Responsable de la gestion pharmaceutique.', color: 'lime' },
                ].map((member, idx) => (
                    <GlassCard key={idx} className="text-center relative overflow-hidden border-none shadow-md bg-white dark:bg-slate-800">
                        <div className={`w-24 h-24 mx-auto bg-${member.color}-100 dark:bg-${member.color}-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-${member.color}-700 dark:text-${member.color}-400 mb-4`}>
                            {member.name.split(' ')[1]?.[0] || member.name[0]}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{member.name}</h3>
                        <p className={`text-${member.color}-600 dark:text-${member.color}-400 font-medium mb-3`}>{member.role}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{member.desc}</p>
                    </GlassCard>
                ))}
            </div>
        </div>
      </section>

      {/* --- SECTION CONTACT (Nouvelle section dédiée) --- */}
      <section id="contact" className="py-20 px-6 bg-white dark:bg-slate-950 transition-colors">
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                 <h2 className="text-3xl md:text-4xl font-sans font-bold text-slate-900 dark:text-white mb-4">
                    Contactez <span className="text-medical-primary">Clinique Gamma</span>
                 </h2>
                 <p className="text-slate-500 dark:text-slate-400">Nous sommes à votre écoute 24h/24 et 7j/7.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                      <GlassCard className="flex items-start gap-4 hover:border-emerald-500 transition-colors">
                          <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl">
                              <MapPin size={24} />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Notre Adresse</h3>
                              <p className="text-slate-600 dark:text-slate-400">Rue de la Santé, Quartier Administratif<br/>Lomé, Togo</p>
                          </div>
                      </GlassCard>

                      <GlassCard className="flex items-start gap-4 hover:border-emerald-500 transition-colors">
                          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                              <Phone size={24} />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Téléphone</h3>
                              <p className="text-slate-600 dark:text-slate-400 font-medium">+228 90 00 00 00</p>
                              <p className="text-slate-500 text-sm">Urgences: +228 99 99 99 99</p>
                          </div>
                      </GlassCard>

                      <GlassCard className="flex items-start gap-4 hover:border-emerald-500 transition-colors">
                          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl">
                              <Mail size={24} />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">Email</h3>
                              <p className="text-slate-600 dark:text-slate-400">contact@cliniquegamma.com</p>
                              <p className="text-slate-500 text-sm">recrutement@cliniquegamma.com</p>
                          </div>
                      </GlassCard>
                  </div>

                  <GlassCard className="p-0 overflow-hidden min-h-[300px] relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover opacity-50 dark:opacity-30"></div>
                      <div className="relative z-10 text-center p-6">
                          <MapPin size={48} className="mx-auto text-medical-primary mb-4 animate-bounce" />
                          <h3 className="text-2xl font-bold text-slate-800 dark:text-white">Plan d'Accès</h3>
                          <p className="text-slate-600 dark:text-slate-300 font-medium mb-4">Nous sommes situés au cœur de la ville.</p>
                          <NeonButton variant="primary" onClick={() => window.open('https://maps.google.com', '_blank')}>
                              Ouvrir dans Google Maps
                          </NeonButton>
                      </div>
                  </GlassCard>
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
                <h4 className="text-xl font-sans font-bold text-slate-900 dark:text-white mb-2">Clinique Gamma</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                    Votre santé, notre priorité. 
                    <br/>Un service rapide, humain et digitalisé.
                </p>
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                &copy; {new Date().getFullYear()} Clinique Gamma. Tous droits réservés.
            </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;