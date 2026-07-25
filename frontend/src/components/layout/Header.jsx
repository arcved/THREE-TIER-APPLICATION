import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Bell, LogOut, PackageX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getProductStats } from '../../api/product.api';
import Button from '../common/Button';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getProductStats()
      .then((res) => setLowStockItems(res.data.data.lowStockItems || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-3 backdrop-blur">
      <div />
      <div className="flex items-center gap-3">
        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="relative rounded-full p-2 text-slate-500 transition hover:bg-brand-50 hover:text-brand-700"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {lowStockItems.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {lowStockItems.length}
              </span>
            )}
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl"
              >
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Low stock alerts
                </p>
                {lowStockItems.length === 0 ? (
                  <p className="px-2 py-3 text-sm text-slate-500">All stock levels look healthy.</p>
                ) : (
                  lowStockItems.map((item) => (
                    <button
                      key={item._id}
                      onClick={() => {
                        setOpen(false);
                        navigate(`/products/${item._id}`);
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm hover:bg-brand-50"
                    >
                      <span className="rounded-full bg-red-100 p-1.5 text-red-600">
                        <PackageX size={13} />
                      </span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-xs font-semibold text-red-600">{item.quantity} left</span>
                    </button>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="hidden items-center gap-2 rounded-full bg-slate-100 py-1 pl-1 pr-3 sm:flex">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </span>
          <span className="text-sm font-medium text-slate-700">{user?.name}</span>
        </div>

        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={14} /> Log out
        </Button>
      </div>
    </header>
  );
}
