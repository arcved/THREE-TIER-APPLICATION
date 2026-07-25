import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown, ArrowUp, ArrowDown, Pencil, Trash2, Eye } from 'lucide-react';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Category' },
  { key: 'price', label: 'Price' },
  { key: 'quantity', label: 'Quantity' },
];

export default function ProductTable({ products, onEdit, onDelete, onView }) {
  const [sort, setSort] = useState({ key: null, dir: 1 });

  const sorted = useMemo(() => {
    if (!sort.key) return products;
    return [...products].sort((a, b) => {
      const av = a[sort.key] ?? '';
      const bv = b[sort.key] ?? '';
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * sort.dir;
      return String(av).localeCompare(String(bv)) * sort.dir;
    });
  }, [products, sort]);

  const toggleSort = (key) => {
    setSort((s) => (s.key === key ? { key, dir: -s.dir } : { key, dir: 1 }));
  };

  const SortIcon = ({ column }) => {
    if (sort.key !== column) return <ArrowUpDown size={12} className="text-slate-300" />;
    return sort.dir === 1 ? (
      <ArrowUp size={12} className="text-brand-600" />
    ) : (
      <ArrowDown size={12} className="text-brand-600" />
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-4 py-3">
                <button
                  onClick={() => toggleSort(col.key)}
                  className="flex items-center gap-1 transition hover:text-brand-600"
                >
                  {col.label} <SortIcon column={col.key} />
                </button>
              </th>
            ))}
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((p, i) => {
            const lowStock = p.quantity <= p.lowStockThreshold;
            return (
              <motion.tr
                key={p._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2, delay: Math.min(i * 0.02, 0.3) }}
                className="group transition-colors hover:bg-brand-50/60"
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  <button onClick={() => onView(p)} className="hover:text-brand-700 hover:underline">
                    {p.name}
                  </button>
                </td>
                <td className="px-4 py-3 text-slate-500">{p.sku}</td>
                <td className="px-4 py-3 text-slate-500">
                  {p.category ? (
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{p.category}</span>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      lowStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {p.quantity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 opacity-70 transition group-hover:opacity-100">
                    <button
                      onClick={() => onView(p)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                      title="View"
                    >
                      <Eye size={15} />
                    </button>
                    <button
                      onClick={() => onEdit(p)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-brand-100 hover:text-brand-700"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => onDelete(p)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
