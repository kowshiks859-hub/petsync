import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, User, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

const API = '';

export default function Register({ login }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', username: '', password: '', confirmPassword: '' });
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error,  setError]  = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key, val) => { setForm(f => ({ ...f, [key]: val })); setError(''); };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Client-side quick checks
    if (!form.fullName.trim())    { setError('Please enter your full name.'); return; }
    if (!form.username.trim())    { setError('Please choose a username.'); return; }
    if (form.username.trim().length < 3) { setError('Username must be at least 3 characters.'); return; }
    if (!form.password)           { setError('Please enter a password.'); return; }
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    try {
      const res  = await fetch(`${API}/api/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed. Please try again.');
        return;
      }

      // Auto-login after registration
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.fullName);
      login(data.user.role, data.user.fullName, data.token, data.user);
      navigate('/selection');
    } catch {
      setError('Cannot connect to the auth server. Make sure you ran: npm run dev:full');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Decorative paws */}
      <PawPrint className="absolute top-10 right-10 w-40 h-40 text-primary opacity-[0.04] -rotate-12 pointer-events-none" />
      <PawPrint className="absolute bottom-10 left-10 w-32 h-32 text-primary opacity-[0.04] rotate-12 pointer-events-none" />

      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md relative z-10 border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-5 shadow-md overflow-hidden border-4 border-secondary"
            style={{ backgroundImage:"url('/logo.png')", backgroundSize:'cover', backgroundPosition:'center' }}
          />
          <h2 className="text-2xl font-extrabold text-gray-900">Create Your Account</h2>
          <p className="text-gray-500 mt-1 text-sm font-medium">Join Blue Cross and find your perfect pet.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Full Name</label>
            <div className="relative">
              <UserPlus size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Kowshik Kumar"
                value={form.fullName}
                onChange={e => update('fullName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. kowshik_123"
                value={form.username}
                onChange={e => update('username', e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-gray-400"
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1 ml-1">Letters, numbers and underscores only. Min 3 characters.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="At least 6 characters"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={e => update('confirmPassword', e.target.value)}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowConfirm(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-gray-900 py-3.5 rounded-lg font-extrabold text-sm hover:bg-yellow-400 transition-colors shadow-sm border-b-2 border-yellow-500 disabled:opacity-60 mt-2"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-bold hover:underline">
            Login
          </Link>
        </p>

        <div className="mt-8 text-center text-[11px] text-gray-400">
          Blue Cross of India • Dedicated to the voiceless since 1964
        </div>
      </div>
    </div>
  );
}
