import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const goTo = (p) => {
    if (p >= 1 && p <= totalPages) onPageChange(p);
  };

  return (
    <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
      <span>
        Page <span className="font-semibold text-slate-900">{page}</span> of {totalPages}
      </span>
      <div className="flex gap-2">
        <button
          onClick={() => goTo(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronLeft size={14} /> Previous
        </button>
        <button
          onClick={() => goTo(page + 1)}
          disabled={page >= totalPages}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 transition hover:border-brand-300 hover:bg-brand-50 disabled:opacity-40 disabled:hover:bg-white"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
