import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpRight, ArrowDownRight, PackageCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import DashboardLayout from '../../components/layout/DashboardLayout';
import Button from '../../components/common/Button';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getProduct, getMovements, createMovement } from '../../api/product.api';

const selectClass =
  'rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [moveQty, setMoveQty] = useState('');
  const [moveType, setMoveType] = useState('in');
  const [moveReason, setMoveReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [productRes, movementsRes] = await Promise.all([
        getProduct(id),
        getMovements(id),
      ]);
      setProduct(productRes.data.data);
      setMovements(movementsRes.data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const chartData = useMemo(
    () =>
      [...movements]
        .slice(0, 10)
        .reverse()
        .map((m) => ({
          label: new Date(m.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
          net: m.type === 'in' ? m.quantity : -m.quantity,
          type: m.type,
        })),
    [movements]
  );

  const handleMovement = async (e) => {
    e.preventDefault();
    if (!moveQty || Number(moveQty) <= 0) {
      toast.error('Enter a quantity greater than 0');
      return;
    }
    setSubmitting(true);
    try {
      await createMovement(id, {
        type: moveType,
        quantity: Number(moveQty),
        reason: moveReason,
      });
      toast.success('Stock updated');
      setMoveQty('');
      setMoveReason('');
      fetchAll();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Skeleton rows={8} />
      </DashboardLayout>
    );
  }

  if (!product) return null;

  const lowStock = product.quantity <= product.lowStockThreshold;

  return (
    <DashboardLayout>
      <button
        onClick={() => navigate('/products')}
        className="mb-4 flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-brand-700"
      >
        <ArrowLeft size={14} /> Back to products
      </button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card"
      >
        <div className="h-2 bg-brand-gradient" />
        <div className="flex items-start justify-between p-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <PackageCheck size={18} />
              </span>
              <div>
                <h1 className="text-xl font-bold text-slate-900">{product.name}</h1>
                <p className="text-sm text-slate-500">
                  {product.sku} · {product.category || 'Uncategorized'} · ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-slate-900">{product.quantity}</p>
            <p
              className={`text-xs font-medium ${lowStock ? 'text-red-600' : 'text-emerald-600'}`}
            >
              {lowStock ? 'Below threshold' : 'In stock'}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Record stock movement</h2>
        <form onSubmit={handleMovement} className="flex flex-wrap items-end gap-3">
          <select value={moveType} onChange={(e) => setMoveType(e.target.value)} className={selectClass}>
            <option value="in">Stock in</option>
            <option value="out">Stock out</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={moveQty}
            onChange={(e) => setMoveQty(e.target.value)}
            className={`w-28 ${selectClass}`}
          />
          <input
            type="text"
            placeholder="Reason (optional)"
            value={moveReason}
            onChange={(e) => setMoveReason(e.target.value)}
            className={`min-w-[160px] flex-1 ${selectClass}`}
          />
          <Button type="submit" loading={submitting}>
            {submitting ? 'Saving...' : 'Apply'}
          </Button>
        </form>
      </div>

      {chartData.length > 0 && (
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Recent stock movement (net units)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={{ stroke: '#e2e8f0' }} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v) => [`${v > 0 ? '+' : ''}${v} units`, 'Net change']}
                contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
              />
              <Bar dataKey="net" radius={[6, 6, 6, 6]} maxBarSize={36}>
                {chartData.map((d, i) => (
                  <Cell key={i} fill={d.type === 'in' ? '#10b981' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <h2 className="border-b border-slate-200 px-6 py-3 text-sm font-semibold text-slate-900">
          Movement history
        </h2>
        {movements.length === 0 ? (
          <div className="p-6">
            <EmptyState title="No movements recorded yet" description="Record stock in or out above to get started." />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-2">Type</th>
                <th className="px-6 py-2">Quantity</th>
                <th className="px-6 py-2">Reason</th>
                <th className="px-6 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {movements.map((m) => (
                <tr key={m._id} className="transition hover:bg-slate-50">
                  <td className="px-6 py-2">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        m.type === 'in' ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {m.type === 'in' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                      {m.type === 'in' ? 'Stock in' : 'Stock out'}
                    </span>
                  </td>
                  <td className="px-6 py-2">{m.quantity}</td>
                  <td className="px-6 py-2 text-slate-500">{m.reason || '—'}</td>
                  <td className="px-6 py-2 text-slate-500">
                    {new Date(m.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}
