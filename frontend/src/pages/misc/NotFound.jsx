import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageX } from 'lucide-react';
import Button from '../../components/common/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-gradient-soft p-4 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl bg-white p-10 shadow-2xl"
      >
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <PackageX size={26} />
        </span>
        <p className="text-6xl font-bold text-brand-100">404</p>
        <h1 className="mt-2 text-lg font-semibold text-slate-900">Page not found</h1>
        <p className="mt-1 text-sm text-slate-500">
          The page you're looking for doesn't exist or has moved.
        </p>
        <Link to="/products" className="mt-6 inline-block">
          <Button>Back to products</Button>
        </Link>
      </motion.div>
    </div>
  );
}
