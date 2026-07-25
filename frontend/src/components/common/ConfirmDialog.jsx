import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}>
      <div className="mb-5 flex gap-3">
        <span className="mt-0.5 h-fit shrink-0 rounded-full bg-red-100 p-2 text-red-600">
          <AlertTriangle size={16} />
        </span>
        <p className="text-sm text-slate-600">{message}</p>
      </div>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} loading={loading}>
          {loading ? 'Deleting...' : 'Delete'}
        </Button>
      </div>
    </Modal>
  );
}
