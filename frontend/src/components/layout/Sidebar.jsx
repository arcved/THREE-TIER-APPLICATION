import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, Boxes } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Package },
];

export default function Sidebar() {
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-slate-200 bg-white p-4 sm:flex">
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-glow">
          <Boxes size={18} />
        </span>
        <div>
          <p className="text-base font-bold leading-tight text-slate-900">Inventory</p>
          <p className="text-xs text-slate-400">Warehouse Manager</p>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to}>
            {({ isActive }) => (
              <motion.div
                whileHover={{ x: 2 }}
                className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-gradient text-white shadow-glow'
                    : 'text-slate-600 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                <Icon size={17} />
                {label}
              </motion.div>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-xl bg-brand-gradient-soft p-4">
        <p className="text-xs font-semibold text-brand-700">Tip</p>
        <p className="mt-1 text-xs text-slate-600">
          Click any product row to view its full stock movement history.
        </p>
      </div>
    </aside>
  );
}
