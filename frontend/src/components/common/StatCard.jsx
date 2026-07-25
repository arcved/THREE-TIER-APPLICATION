import { motion } from 'framer-motion';

export default function StatCard({ label, value, tone = 'default', icon: Icon, delay = 0 }) {
  const tones = {
    default: { text: 'text-slate-900', chip: 'bg-brand-100 text-brand-700' },
    danger: { text: 'text-red-600', chip: 'bg-red-100 text-red-600' },
    success: { text: 'text-emerald-600', chip: 'bg-emerald-100 text-emerald-600' },
  };
  const t = tones[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-shadow hover:shadow-glow"
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        {Icon && (
          <span className={`rounded-lg p-2 transition-transform group-hover:scale-110 ${t.chip}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className={`mt-2 text-2xl font-bold tracking-tight ${t.text}`}>{value}</p>
    </motion.div>
  );
}
