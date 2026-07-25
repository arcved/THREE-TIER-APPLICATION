import { useEffect, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Download, AlertTriangle } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import ProductTable from '../../components/product/ProductTable';
import ProductForm from '../../components/product/ProductForm';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import EmptyState from '../../components/common/EmptyState';
import Skeleton from '../../components/common/Skeleton';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../../api/product.api';

const PAGE_SIZE = 10;

function exportToCsv(products) {
  const headers = ['Name', 'SKU', 'Category', 'Price', 'Quantity', 'Low stock threshold'];
  const rows = products.map((p) => [
    p.name,
    p.sku,
    p.category || '',
    p.price,
    p.quantity,
    p.lowStockThreshold,
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getProducts({
        search: search || undefined,
        category: category || undefined,
        page,
        limit: PAGE_SIZE,
      });
      setProducts(res.data.data);
      setMeta(res.data.meta);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, category, page]);

  // Reset to page 1 whenever the filters change
  useEffect(() => {
    setPage(1);
  }, [search, category]);

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, 300); // debounce search
    return () => clearTimeout(timeout);
  }, [fetchProducts]);

  // Distinct categories seen on the current page — good enough for a lightweight filter
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  const visibleProducts = useMemo(
    () => (lowStockOnly ? products.filter((p) => p.quantity <= p.lowStockThreshold) : products),
    [products, lowStockOnly]
  );

  const handleCreate = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSaving(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      setFormOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    setSaving(true);
    try {
      await deleteProduct(deletingProduct._id);
      toast.success('Product deleted');
      setDeletingProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500">Manage inventory and stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => exportToCsv(visibleProducts)}>
            <Download size={15} /> Export CSV
          </Button>
          <Button onClick={handleCreate}>
            <Plus size={15} /> New Product
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button
          onClick={() => setLowStockOnly((v) => !v)}
          className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition ${
            lowStockOnly
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <AlertTriangle size={14} /> Low stock only
        </button>
      </div>

      {loading ? (
        <Skeleton rows={6} />
      ) : visibleProducts.length === 0 ? (
        <EmptyState
          title={lowStockOnly ? 'Nothing low on stock' : 'No products yet'}
          description={
            lowStockOnly
              ? 'Every item on this page is above its threshold.'
              : 'Get started by adding your first product.'
          }
          action={!lowStockOnly && <Button onClick={handleCreate}>+ New Product</Button>}
        />
      ) : (
        <>
          <ProductTable
            products={visibleProducts}
            onEdit={handleEdit}
            onDelete={setDeletingProduct}
            onView={(p) => navigate(`/products/${p._id}`)}
          />
          <Pagination page={meta.page} totalPages={meta.totalPages} onPageChange={setPage} />
        </>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editingProduct ? 'Edit product' : 'New product'}
      >
        <ProductForm
          initialValues={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setFormOpen(false)}
          loading={saving}
        />
      </Modal>

      <ConfirmDialog
        open={!!deletingProduct}
        title="Delete product"
        message={`Are you sure you want to delete "${deletingProduct?.name}"? This cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingProduct(null)}
        loading={saving}
      />
    </DashboardLayout>
  );
}
