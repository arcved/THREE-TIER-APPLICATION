import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Boxes,
  Layers,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Package,
} from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import StatCard from '../../components/common/StatCard';
import Skeleton from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import { getProductStats, getRecentMovements } from '../../api/product.api';
import { Link } from 'react-router-dom';

const DONUT_COLORS = ['#7c3aed', '#4f46e5', '#2563eb', '#0ea5e9', '#06b6d4', '#10b981', '#f59e0b'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          getProductStats(),
          getRecentMovements(8),
        ]);
        setStats(statsRes.data.data);
        setActivity(activityRes.data.data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">A live overview of your inventory health</p>
      </div>

      {loading ? (
        <Skeleton rows={6} />
      ) : (
        <>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total products" value={stats.totalProducts} icon={Package} delay={0} />
            <StatCard
              label="Total units in stock"
              value={stats.totalUnits.toLocaleString()}
              icon={Layers}
              delay={0.05}
            />
            <StatCard
              label="Inventory value"
              value={`$${stats.totalValue.toFixed(2)}`}
              icon={Wallet}
              delay={0.1}
            />
            <StatCard
              label="Low stock items"
              value={stats.lowStockCount}
              tone={stats.lowStockCount > 0 ? 'danger' : 'success'}
              icon={AlertTriangle}
              delay={0.15}
            />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Bar chart — top products by inventory value */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.1 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-3"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Top products by value</h2>
                <Boxes size={16} className="text-brand-500" />
              </div>
              {stats.topProducts.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">No products yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={stats.topProducts} margin={{ left: -10, right: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#64748b' }}
                      tickLine={false}
                      axisLine={{ stroke: '#e2e8f0' }}
                      interval={0}
                      angle={-12}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} tickLine={false} axisLine={false} />
                    <Tooltip
                      cursor={{ fill: '#f5f3ff' }}
                      formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Value']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={48}>
                      {stats.topProducts.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </motion.div>

            {/* Donut chart — value by category */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2"
            >
              <h2 className="mb-4 text-sm font-semibold text-slate-900">Value by category</h2>
              {stats.byCategory.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">No categories yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={stats.byCategory.map((c) => ({ ...c, name: c._id || 'Uncategorized' }))}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                    >
                      {stats.byCategory.map((_, i) => (
                        <Cell key={i} fill={DONUT_COLORS[i % DONUT_COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => [`$${Number(v).toFixed(2)}`, 'Value']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 12 }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      wrapperStyle={{ fontSize: 11, color: '#64748b' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
            {/* Low stock alert list */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.2 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-2"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900">Needs restocking</h2>
                <AlertTriangle size={16} className="text-red-500" />
              </div>
              {stats.lowStockItems.length === 0 ? (
                <EmptyState
                  title="All good here"
                  description="No products are below their low-stock threshold."
                  icon={Boxes}
                />
              ) : (
                <ul className="space-y-2">
                  {stats.lowStockItems.map((item) => (
                    <li key={item._id}>
                      <Link
                        to={`/products/${item._id}`}
                        className="flex items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-red-50"
                      >
                        <span>
                          <span className="font-medium text-slate-800">{item.name}</span>
                          <span className="ml-2 text-xs text-slate-400">{item.sku}</span>
                        </span>
                        <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">
                          {item.quantity} / {item.lowStockThreshold}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>

            {/* Recent activity feed */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.25 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card lg:col-span-3"
            >
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Recent activity</h2>
              {activity.length === 0 ? (
                <EmptyState
                  title="No activity yet"
                  description="Stock movements will show up here as they happen."
                />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {activity.map((m) => (
                    <li key={m._id} className="flex items-center gap-3 py-2.5 text-sm">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          m.type === 'in' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {m.type === 'in' ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
                      </span>
                      <span className="flex-1 truncate">
                        <span className="font-medium text-slate-800">
                          {m.productId?.name || 'Unknown product'}
                        </span>{' '}
                        <span className="text-slate-500">
                          {m.type === 'in' ? 'restocked' : 'shipped out'}
                        </span>{' '}
                        <span className="font-semibold text-slate-800">{m.quantity}</span> units
                      </span>
                      <span className="shrink-0 text-xs text-slate-400">
                        {new Date(m.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
