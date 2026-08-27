import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, PawPrint, FileText, Home, BarChart2, Settings, User, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getRequests } from '../data/mockPets';

export default function AdminLayout({ logout }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const loadData = () => setRequests(getRequests());
    loadData();
    window.addEventListener('bluecross_data_change', loadData);
    return () => window.removeEventListener('bluecross_data_change', loadData);
  }, []);

  const NavItem = ({ to, icon: Icon, label, badge, isLogout }) => {
    if (isLogout) {
      return (
        <button onClick={logout} className="w-full flex items-center space-x-3 px-6 py-3 text-sm font-medium text-gray-300 hover:text-white transition-colors mt-auto mb-6">
          <Icon size={18} />
          <span>{label}</span>
        </button>
      );
    }

    return (
      <NavLink
        to={to}
        className={({ isActive }) => 
          `flex items-center justify-between px-6 py-3.5 text-sm font-medium transition-colors ${
            isActive 
              ? 'bg-primary-dark border-l-4 border-secondary text-white' 
              : 'text-gray-300 hover:bg-primary-dark/50 hover:text-white border-l-4 border-transparent'
          }`
        }
      >
        <div className="flex items-center space-x-3">
          <Icon size={18} />
          <span>{label}</span>
        </div>
        {badge && (
          <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] font-bold text-white leading-none pb-[1px]">
            {badge}
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-primary flex flex-col shrink-0 relative overflow-hidden h-screen sticky top-0">
        {/* Decorative paws in sidebar */}
        <PawPrint className="absolute bottom-16 -left-4 w-24 h-24 text-white opacity-[0.03] rotate-12" />
        <PawPrint className="absolute bottom-40 right-2 w-16 h-16 text-white opacity-[0.03] -rotate-12" />
        
        {/* Logo */}
        <div className="h-[72px] flex items-center px-6 border-b border-primary-light">
          <div className="flex items-center space-x-3">
            <div 
              className="w-8 h-8 rounded-full bg-white shrink-0 overflow-hidden" 
              style={{
                backgroundImage: "url('/logo.png')",
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            />
            <span className="font-bold text-white leading-tight">
              Blue Cross<br/>of India
            </span>
          </div>
        </div>

        {/* Menu Label */}
        <div className="px-6 py-5">
          <span className="text-[10px] font-bold text-gray-300 uppercase tracking-wider">Admin Panel</span>
        </div>

        {/* Navigation */}
        <div className="flex-1 flex flex-col pb-6">
          <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/admin/pets" icon={PawPrint} label="Pet Management" />
          <NavItem to="/admin/requests" icon={FileText} label="Requests" badge={requests.filter(r => r.status === 'Pending').length || null} />
          
          <div className="mt-auto pt-6">
            <NavItem isLogout={true} icon={LogOut} label="Logout" />
          </div>
        </div>

      </div>

      {/* Main Content */}
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
