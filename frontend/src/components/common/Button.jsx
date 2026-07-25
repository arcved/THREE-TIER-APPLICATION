import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Button({
  children,
  variant = 'primary',
  className = '',
  loading = false,
  disabled = false,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-2';
  const variants = {
    primary:
      'bg-brand-gradient text-white shadow-glow hover:brightness-110 active:scale-[0.98]',
    secondary:
      'bg-white text-slate-700 border border-slate-200 hover:border-brand-300 hover:bg-brand-50 active:scale-[0.98]',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]',
    ghost:
      'text-slate-500 hover:bg-slate-100 hover:text-slate-700',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 size={15} className="animate-spin" />}
      {children}
    </motion.button>
  );
}
