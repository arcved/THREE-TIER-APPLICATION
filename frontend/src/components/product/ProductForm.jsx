import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import Button from '../common/Button';

const inputClass =
  'w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-slate-50 disabled:text-slate-400';
const labelClass = 'mb-1 block text-sm font-medium text-slate-700';

export default function ProductForm({ initialValues, onSubmit, onCancel, loading }) {
  const isEdit = !!initialValues;
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: initialValues || {
      name: '',
      sku: '',
      category: '',
      price: '',
      quantity: 0,
      lowStockThreshold: 10,
    },
  });

  useEffect(() => {
    if (initialValues) reset(initialValues);
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className={labelClass}>Name</label>
        <input className={inputClass} {...register('name', { required: 'Name is required' })} />
        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label className={labelClass}>SKU</label>
        <input
          className={inputClass}
          disabled={isEdit}
          {...register('sku', { required: 'SKU is required' })}
        />
        {errors.sku && <p className="mt-1 text-xs text-red-600">{errors.sku.message}</p>}
      </div>

      <div>
        <label className={labelClass}>Category</label>
        <input className={inputClass} {...register('category')} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Price</label>
          <input
            type="number"
            step="0.01"
            className={inputClass}
            {...register('price', { required: 'Price is required', min: 0 })}
          />
        </div>

        {!isEdit && (
          <div>
            <label className={labelClass}>Initial qty</label>
            <input type="number" className={inputClass} {...register('quantity', { min: 0 })} />
          </div>
        )}
      </div>

      <div>
        <label className={labelClass}>Low stock threshold</label>
        <input type="number" className={inputClass} {...register('lowStockThreshold', { min: 0 })} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {loading ? 'Saving...' : isEdit ? 'Save changes' : 'Create product'}
        </Button>
      </div>
    </form>
  );
}
