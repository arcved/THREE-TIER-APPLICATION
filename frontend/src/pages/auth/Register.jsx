import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Boxes, Mail, Lock, User } from 'lucide-react';
import { registerUser } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

const inputClass =
  'w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-100';

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await registerUser(data);
      login(res.data.data.token, res.data.data.user);
      toast.success('Account created');
      navigate('/products');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-gradient-soft p-4">
      <motion.form
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
            <Boxes size={22} />
          </span>
          <h1 className="text-xl font-bold text-slate-900">Create account</h1>
          <p className="text-sm text-slate-500">Start managing your inventory today</p>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
        <div className="relative mb-1">
          <User size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className={inputClass} {...register('name', { required: 'Name is required' })} />
        </div>
        {errors.name && <p className="mb-2 text-xs text-red-600">{errors.name.message}</p>}

        <label className="mb-1 mt-3 block text-sm font-medium text-slate-700">Email</label>
        <div className="relative mb-1">
          <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="email"
            className={inputClass}
            {...register('email', { required: 'Email is required' })}
          />
        </div>
        {errors.email && <p className="mb-2 text-xs text-red-600">{errors.email.message}</p>}

        <label className="mb-1 mt-3 block text-sm font-medium text-slate-700">Password</label>
        <div className="relative mb-1">
          <Lock size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="password"
            className={inputClass}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'At least 8 characters' },
            })}
          />
        </div>
        {errors.password && <p className="mb-2 text-xs text-red-600">{errors.password.message}</p>}

        <Button type="submit" className="mt-4 w-full" loading={loading}>
          {loading ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
