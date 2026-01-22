import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => (
  <div className={`
    bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm
    ${hoverEffect ? 'hover:shadow-soft-green dark:hover:shadow-none dark:hover:border-emerald-500/20 transition-all duration-300' : ''}
    ${className}
  `}>
    {children}
  </div>
);

interface NeonButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  className?: string;
  icon?: LucideIcon | any;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export const NeonButton: React.FC<NeonButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  icon: Icon,
  type = "button",
  disabled = false
}) => {
  const baseStyles = "relative px-5 py-2.5 rounded-xl font-sans font-black transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[10px]";
  
  const variants = {
    primary: "bg-medical-primary text-white hover:bg-medical-dark shadow-medical-primary/20 dark:bg-emerald-700/80 dark:hover:bg-emerald-600 dark:border dark:border-emerald-500/30",
    secondary: "bg-white dark:bg-slate-800 text-medical-primary dark:text-emerald-400 border border-medical-primary/20 dark:border-slate-700 hover:bg-medical-light dark:hover:bg-slate-700",
    danger: "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-300 border border-red-100 dark:border-red-800/50 hover:bg-red-100",
    success: "bg-emerald-500 text-slate-900 dark:bg-emerald-600 dark:text-white border-none hover:opacity-90",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={14} />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  trend?: string;
  icon: any;
  color: 'blue' | 'purple' | 'green' | 'red';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, trend, icon: Icon, color }) => {
  const colorStyles = {
    blue: 'text-medical-primary bg-medical-light dark:bg-blue-900/30 dark:text-blue-300', 
    purple: 'text-teal-600 bg-teal-50 dark:bg-purple-900/30 dark:text-purple-300', 
    green: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-300', 
    red: 'text-rose-600 bg-rose-50 dark:bg-red-900/30 dark:text-red-300', 
  };

  return (
    <GlassCard className="flex flex-col justify-between h-32 relative overflow-hidden group border-slate-200 dark:border-slate-800">
      <div className={`absolute top-4 right-4 p-3 rounded-xl ${colorStyles[color]} opacity-80 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
        <h3 className="text-3xl font-sans font-black mt-1 text-slate-800 dark:text-white leading-none tracking-tighter">{value}</h3>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[10px] font-bold mt-auto pt-2">
          <span className={trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{trend}</span>
          <span className="text-slate-400 dark:text-slate-500 italic">vs mois dernier</span>
        </div>
      )}
    </GlassCard>
  );
};

interface BadgeProps {
  children?: ReactNode;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

export const Badge: React.FC<BadgeProps> = ({ children, color = 'blue' }) => {
  const styles = {
    blue: 'bg-blue-500 text-white dark:bg-blue-600',
    green: 'bg-emerald-500 text-slate-900 dark:text-white dark:bg-emerald-600',
    red: 'bg-rose-500 text-white dark:bg-rose-600',
    yellow: 'bg-amber-400 text-slate-900 dark:bg-amber-500 dark:text-slate-950',
    purple: 'bg-purple-500 text-white dark:bg-purple-600',
  };
  
  return (
    <span className={`px-2 py-1 rounded-md text-[9px] font-black uppercase tracking-widest shadow-sm ${styles[color]}`}>
      {children}
    </span>
  );
};

interface NeonInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  as?: 'input' | 'textarea' | 'select';
  options?: string[]; 
}

export const NeonInput: React.FC<NeonInputProps> = ({ label, as = 'input', className = '', options, ...props }) => {
  const baseClass = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-50 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-medical-primary dark:focus:border-emerald-500 transition-all font-medium text-sm";
  
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 ml-1 uppercase tracking-[0.2em]">{label}</label>
      {as === 'textarea' ? (
        <textarea className={`${baseClass} min-h-[100px] resize-y`} {...(props as any)} />
      ) : as === 'select' ? (
        <select className={baseClass} {...(props as any)}>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input className={baseClass} {...(props as any)} />
      )}
    </div>
  );
};