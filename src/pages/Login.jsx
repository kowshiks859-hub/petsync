import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, User, Lock, Eye, EyeOff } from 'lucide-react';

const API = '';

export default function Login({ login }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass,  setShowPass]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('Please enter your username and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res  = await fetch(`${API}/api/login`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Incorrect username or password.');
        return;
      }

      // Store token and call app-level login
      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.fullName);
      login(data.user.role, data.user.fullName, data.token, data.user);

      if (data.user.role === 'bluecross') navigate('/admin/dashboard');
      else navigate('/selection');
    } catch {
      setError('Cannot connect to the auth server. Make sure you ran: npm run dev:full');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Decorative paws */}
      <PawPrint className="absolute top-10 left-10 w-44 h-44 text-primary opacity-[0.04] rotate-12 pointer-events-none" />
      <PawPrint className="absolute bottom-14 right-14 w-36 h-36 text-primary opacity-[0.04] -rotate-12 pointer-events-none" />
      <PawPrint className="absolute top-1/3 right-1/4 w-24 h-24 text-primary opacity-[0.03] rotate-45 pointer-events-none" />

      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-md relative z-10 border border-gray-100">
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-5 shadow-md overflow-hidden border-4 border-secondary"
            style={{ backgroundImage:"url('/logo.png')", backgroundSize:'cover', backgroundPosition:'center' }}
          />
          <h2 className="text-2xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="text-gray-500 mt-1 text-sm font-medium">Login to continue your pet adoption journey.</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                autoComplete="username"
                placeholder="your_username"
                value={username}
                onChange={e => { setUsername(e.target.value); setError(''); }}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-gray-400"
                autoFocus
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide">Password</label>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full border border-gray-200 rounded-lg pl-10 pr-10 py-3 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 placeholder-gray-400"
              />
              <button type="button" onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 rounded-lg font-extrabold text-sm hover:bg-blue-800 transition-colors shadow-sm border-b-2 border-blue-900 disabled:opacity-60 mt-2"
          >
            {loading ? 'Logging in…' : 'Login'}
          </button>
        </form>

        {/* Register link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-bold hover:underline">
            Create Account
          </Link>
        </p>

        {/* Admin note */}
        <p className="text-center text-xs text-gray-400 mt-3">
          Blue Cross Staff: use your admin credentials
        </p>

        <div className="mt-8 text-center text-[11px] text-gray-400">
          Blue Cross of India • Dedicated to the voiceless since 1964
        </div>
      </div>
    </div>
  );
}
