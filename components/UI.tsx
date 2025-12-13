import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface GlassCardProps {
  children?: ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = true }) => (
  <div className={`
    bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-6 shadow-sm
    ${hoverEffect ? 'hover:shadow-soft-green dark:hover:shadow-none dark:hover:border-medical-accent/30 transition-all duration-300' : ''}
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
  const baseStyles = "relative px-6 py-2.5 rounded-lg font-sans font-medium transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-medical-primary text-white hover:bg-medical-dark shadow-medical-primary/20 dark:hover:bg-emerald-500",
    secondary: "bg-white dark:bg-slate-800 text-medical-primary dark:text-emerald-400 border border-medical-primary/20 dark:border-emerald-500/30 hover:bg-medical-light dark:hover:bg-slate-700",
    danger: "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/40",
    success: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 hover:bg-emerald-200",
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={18} />}
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
    blue: 'text-medical-primary bg-medical-light dark:bg-emerald-900/30 dark:text-emerald-400', 
    purple: 'text-teal-600 bg-teal-50 dark:bg-teal-900/30 dark:text-teal-400', 
    green: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400', 
    red: 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400', 
  };

  return (
    <GlassCard className="flex flex-col justify-between h-32 relative overflow-hidden group border-slate-200 dark:border-slate-700">
      <div className={`absolute top-4 right-4 p-3 rounded-xl ${colorStyles[color]} opacity-80 group-hover:scale-110 transition-transform duration-500`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-sans font-bold mt-2 text-slate-800 dark:text-white">{value}</h3>
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <span className={trend.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{trend}</span>
          <span className="text-slate-400 dark:text-slate-500">vs mois dernier</span>
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
    blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
    green: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700',
    red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
    yellow: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700',
  };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[color]}`}>
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
  const baseClass = "w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-medical-primary focus:ring-1 focus:ring-medical-primary dark:focus:border-emerald-500 transition-all";
  
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
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