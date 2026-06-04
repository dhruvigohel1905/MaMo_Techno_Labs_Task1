import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { register, clearError } from '../../store/slices/authSlice';
import { HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const RegisterPage = () => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((s) => s.auth);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirmPassword: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (form.password !== form.confirmPassword) { setLocalError('Passwords do not match'); return; }
    dispatch(register({ firstName: form.firstName, lastName: form.lastName, email: form.email, password: form.password, role: form.role }));
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/25">E</div>
          <h1 className="font-display text-2xl font-bold">Create Account</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Join EventHub and start exploring events</p>
        </div>
        <div className="card !p-8">
          {(error || localError) && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-400 text-sm" onClick={() => { dispatch(clearError()); setLocalError(''); }}>{localError || error}</div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">First Name</label>
                <input type="text" name="firstName" value={form.firstName} onChange={handleChange} className="input-field" placeholder="John" required id="reg-fn" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange} className="input-field" placeholder="Doe" required id="reg-ln" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required id="reg-email" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} className="input-field !pr-11" placeholder="Min 6 characters" required id="reg-pass" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
                  {showPass ? <HiOutlineEyeOff className="w-5 h-5" /> : <HiOutlineEye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} className="input-field" placeholder="Confirm password" required id="reg-cpass" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">I am registering as a...</label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer border ${form.role === 'user' ? 'border-primary-500 bg-primary-500/10' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'} rounded-xl p-3 flex items-center justify-center transition-all`}>
                  <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} className="hidden" />
                  <span className={`text-sm font-medium ${form.role === 'user' ? 'text-primary-600 dark:text-primary-400' : 'text-[var(--text-secondary)]'}`}>Participant</span>
                </label>
                <label className={`cursor-pointer border ${form.role === 'organizer' ? 'border-primary-500 bg-primary-500/10' : 'border-[var(--border-color)] bg-[var(--bg-secondary)]'} rounded-xl p-3 flex items-center justify-center transition-all`}>
                  <input type="radio" name="role" value="organizer" checked={form.role === 'organizer'} onChange={handleChange} className="hidden" />
                  <span className={`text-sm font-medium ${form.role === 'organizer' ? 'text-primary-600 dark:text-primary-400' : 'text-[var(--text-secondary)]'}`}>Organizer</span>
                </label>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn-primary w-full !py-3 mt-2" id="reg-submit">
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--text-secondary)]">
            Already have an account? <Link to="/login" className="text-primary-500 font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
