import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Menu, LogOut, Camera, UserCog, X, Check, ChevronDown } from 'lucide-react';

const API = '';

export default function Navbar({ auth, logout }) {
  const location                    = useLocation();
  const [dropdownOpen, setDropdown] = useState(false);
  const [editMode, setEditMode]     = useState(null); // null | 'name' | 'picture'
  const [newName, setNewName]       = useState('');
  const [avatarSrc, setAvatarSrc]   = useState(null);
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');
  const dropdownRef                 = useRef(null);
  const fileInputRef                = useRef(null);

  const token = auth?.token || localStorage.getItem('token');

  // Load saved avatar from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('userAvatar');
    if (saved) setAvatarSrc(saved);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdown(false);
        setEditMode(null);
        setSaveMsg('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDropdown(false);
    setEditMode(null);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;

  // ── Helpers ──────────────────────────────────────────────────────────────
  const displayName = auth?.userName || auth?.user?.fullName || 'User';
  const isAdmin     = auth?.role === 'bluecross';

  const getInitials = (name) =>
    name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const avatarContent = avatarSrc ? (
    <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
  ) : isAdmin ? (
    <img src="/logo.png" alt="Blue Cross" className="w-full h-full object-cover" />
  ) : (
    <span className="text-xs font-extrabold text-white select-none">
      {getInitials(displayName)}
    </span>
  );

  // ── Save name ────────────────────────────────────────────────────────────
  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/profile`, {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ fullName: newName.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        // Update token + localStorage
        if (data.token) {
          localStorage.setItem('token', data.token);
          // Patch auth in localStorage so name persists on refresh
          const saved = JSON.parse(localStorage.getItem('auth') || '{}');
          saved.userName = newName.trim();
          if (saved.user) saved.user.fullName = newName.trim();
          saved.token = data.token;
          localStorage.setItem('auth', JSON.stringify(saved));
          localStorage.setItem('userName', newName.trim());
        }
        setSaveMsg('Name updated!');
        setTimeout(() => { setSaveMsg(''); setEditMode(null); window.location.reload(); }, 800);
      } else {
        setSaveMsg(data.error || 'Failed to save.');
      }
    } catch {
      setSaveMsg('Server not reachable.');
    } finally {
      setSaving(false);
    }
  };

  // ── Save avatar ──────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      setAvatarSrc(dataUrl);
      localStorage.setItem('userAvatar', dataUrl);
      setSaveMsg('Profile picture updated!');
      setTimeout(() => { setSaveMsg(''); setEditMode(null); }, 1200);
    };
    reader.readAsDataURL(file);
  };

  // ── NavLink ──────────────────────────────────────────────────────────────
  const NavLink = ({ to, label }) => (
    <Link
      to={to}
      className={`relative px-4 py-6 text-sm font-semibold transition-colors ${
        isActive(to) ? 'text-secondary' : 'text-blue-100 hover:text-white'
      }`}
    >
      {label}
      {isActive(to) && (
        <div className="absolute bottom-0 left-2 right-2 h-1.5 bg-secondary rounded-t-md shadow-sm" />
      )}
    </Link>
  );

  // ── Avatar button ─────────────────────────────────────────────────────────
  const AvatarButton = () => (
    <button
      onClick={() => { setDropdown(d => !d); setEditMode(null); setSaveMsg(''); }}
      className="flex items-center space-x-1.5 group focus:outline-none"
      aria-label="Open profile menu"
    >
      <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden shrink-0 border-2 transition-all ${
        dropdownOpen ? 'border-secondary scale-105' : 'border-white/30 group-hover:border-secondary/70'
      } ${isAdmin ? 'bg-white' : 'bg-blue-600'}`}>
        {avatarContent}
      </div>
      <ChevronDown
        size={14}
        className={`text-white/70 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-secondary' : ''}`}
      />
    </button>
  );

  // ── Dropdown ──────────────────────────────────────────────────────────────
  const Dropdown = () => (
    <div
      className="absolute right-0 top-[calc(100%+8px)] w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 z-[999] overflow-hidden animate-[fadeIn_0.15s_ease]"
      style={{ animation: 'fadeDropdown 0.15s ease' }}
    >
      {/* Profile header */}
      <div className="bg-primary px-5 py-4 flex items-center space-x-3">
        <div className={`w-11 h-11 rounded-full shrink-0 overflow-hidden border-2 border-secondary flex items-center justify-center ${isAdmin ? 'bg-white' : 'bg-blue-500'}`}>
          {avatarContent}
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm truncate">
            {isAdmin ? 'Blue Cross of India' : displayName}
          </p>
          <p className="text-blue-200 text-xs font-medium">
            {isAdmin ? 'Admin Account' : `@${auth?.user?.username || 'user'}`}
          </p>
        </div>
      </div>

      {/* ── Edit Name ── */}
      {editMode === 'name' && !isAdmin && (
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">New Display Name</p>
          <input
            type="text"
            value={newName}
            onChange={e => { setNewName(e.target.value); setSaveMsg(''); }}
            placeholder={displayName}
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            onKeyDown={e => e.key === 'Enter' && handleSaveName()}
          />
          {saveMsg && <p className={`text-xs mt-1.5 font-medium ${saveMsg.includes('!') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</p>}
          <div className="flex gap-2 mt-3">
            <button onClick={handleSaveName} disabled={saving || !newName.trim()}
              className="flex-1 bg-primary text-white py-2 rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-1">
              <Check size={12} /> {saving ? 'Saving…' : 'Save'}
            </button>
            <button onClick={() => { setEditMode(null); setSaveMsg(''); }}
              className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Edit Picture ── */}
      {editMode === 'picture' && !isAdmin && (
        <div className="px-4 py-4 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Profile Picture</p>
          {avatarSrc && (
            <div className="flex justify-center mb-3">
              <img src={avatarSrc} alt="Preview" className="w-16 h-16 rounded-full object-cover border-2 border-secondary" />
            </div>
          )}
          {saveMsg && <p className="text-xs text-green-600 font-medium text-center mb-2">{saveMsg}</p>}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-secondary text-gray-900 py-2.5 rounded-lg text-xs font-extrabold hover:bg-yellow-400 transition-colors border-b-2 border-yellow-500 flex items-center justify-center gap-2"
          >
            <Camera size={14} /> Choose Photo
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button onClick={() => { setEditMode(null); setSaveMsg(''); }}
            className="w-full mt-2 text-gray-400 py-1.5 text-xs font-medium hover:text-gray-600 transition-colors">
            Cancel
          </button>
        </div>
      )}

      {/* ── Menu items ── */}
      {!editMode && (
        <div className="py-2">
          {!isAdmin && (
            <>
              <button
                onClick={() => { setEditMode('picture'); setNewName(''); setSaveMsg(''); }}
                className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors text-left"
              >
                <Camera size={16} className="text-gray-400 shrink-0" />
                <span>Change Profile Picture</span>
              </button>
              <button
                onClick={() => { setEditMode('name'); setNewName(displayName); setSaveMsg(''); }}
                className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors text-left"
              >
                <UserCog size={16} className="text-gray-400 shrink-0" />
                <span>Change Display Name</span>
              </button>
              <div className="mx-4 my-1 h-px bg-gray-100" />
            </>
          )}
          <button
            onClick={() => { setDropdown(false); logout(); }}
            className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-red-500 font-bold hover:bg-red-50 transition-colors text-left"
          >
            <LogOut size={16} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <nav className="bg-primary text-white sticky top-0 z-50 border-b-2 border-secondary">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-[72px]">

          {/* Logo + nav links */}
          <div className="flex items-center h-full">
            <div className="flex items-center pr-6 border-r border-white/20 h-10">
              <Link to="/" className="flex items-center space-x-3">
                <div
                  className="w-10 h-10 rounded-full bg-white shrink-0 overflow-hidden"
                  style={{ backgroundImage:"url('/logo.png')", backgroundSize:'cover', backgroundPosition:'center' }}
                />
                <span className="font-bold text-lg leading-tight tracking-wide">
                  Blue Cross<br/>of India
                </span>
              </Link>
            </div>

            <div className="hidden md:flex items-center h-full pl-6 space-x-2">
              <NavLink to="/" label="Home" />
              {auth.isAuthenticated && auth.role === 'user' && (
                <>
                  <NavLink to="/selection" label="Selection" />
                  <NavLink to="/match"     label="AI Match" />
                  <NavLink to="/adoption"  label="Adoption" />
                </>
              )}
              {auth.isAuthenticated && auth.role === 'bluecross' && (
                <NavLink to="/admin/pets" label="Pet Management" />
              )}
              {auth.isAuthenticated && (
                <NavLink to="/settings" label="Settings ⚙" />
              )}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {!auth.isAuthenticated ? (
              <Link to="/login" className="text-sm font-semibold hover:text-blue-200 transition-colors">
                Login
              </Link>
            ) : (
              <div className="flex items-center space-x-3">
                {auth.role === 'user' && (
                  <Link to="/selection" className="text-white/70 hover:text-secondary transition-colors" title="Liked Pets">
                    <Heart size={20} strokeWidth={2} />
                  </Link>
                )}

                {/* Profile avatar + dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <AvatarButton />
                  {dropdownOpen && <Dropdown />}
                </div>
              </div>
            )}

            <button className="md:hidden text-white" aria-label="Mobile menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
