import { motion } from 'framer-motion';
import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title, description, action, icon: Icon = PackageSearch }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center"
    >
      <span className="mb-3 rounded-full bg-brand-50 p-3 text-brand-600">
        <Icon size={22} />
      </span>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-xs text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </motion.div>
  );
}
