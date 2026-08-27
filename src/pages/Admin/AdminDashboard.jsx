import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PawPrint, MessageSquare, Bell, Heart, CheckCircle } from 'lucide-react';
import { getPets, getRequests, getNotifications, markAllNotificationsRead, markNotificationRead } from '../../data/mockPets';

export default function AdminDashboard() {
  const [pets, setPets] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = () => {
      setPets(getPets());
      setRequests(getRequests());
      setNotifications(getNotifications());
    };
    loadData();
    window.addEventListener('bluecross_data_change', loadData);
    return () => window.removeEventListener('bluecross_data_change', loadData);
  }, []);

  const totalPets = pets.length;
  const petsAdopted = pets.filter(p => p.adoptionStatus === 'Adopted').length;
  
  const adoptionRequests = requests.filter(r => r.type === 'Adoption');
  const visitRequests = requests.filter(r => r.type === 'Visit');
  
  const pendingAdoptions = adoptionRequests.filter(r => r.status === 'Pending').length;
  const pendingVisits = visitRequests.filter(r => r.status === 'Pending').length;
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (n) => {
    markNotificationRead(n.id);
    if (n.link) navigate(n.link);
    setShowNotifications(false);
  };

  const StatCard = ({ icon, label, value, subtext, colorClass }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
      <div className="flex items-start mb-4 space-x-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
          {icon}
        </div>
        <div className="flex-1 mt-0.5">
          <p className="text-xs font-semibold text-gray-500 mb-1">{label}</p>
          <h3 className="text-3xl font-bold text-gray-900 leading-none">{value}</h3>
        </div>
      </div>
      <p className="text-xs font-medium text-gray-500 text-center w-full">{subtext}</p>
    </div>
  );

  const RequestList = ({ title, requests, viewAllLink }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <Link to={viewAllLink} className="text-sm font-bold text-primary hover:underline">View All</Link>
      </div>
      <div className="space-y-4 flex-1">
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No requests yet.</p>
        ) : (
          requests.map((req, i) => (
            <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-4">
                <img src={req.pet.image} alt={req.pet.name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-0.5">{req.pet.name}</h4>
                  <p className="text-[11px] text-gray-500">{req.type === 'Visit' ? 'Visit by' : 'Requested by'} {req.user}</p>
                  <p className="text-[11px] text-gray-400">
                    {new Date(req.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {req.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // Get most recent 4 requests
  const recentAdoptions = [...adoptionRequests].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 4);
  const recentVisits = [...visitRequests].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <div className="p-8 max-w-[1200px] mx-auto pb-16">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 relative">
        <div>
          <p className="text-sm font-semibold text-gray-500 mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            Blue Cross Admin <PawPrint size={20} className="ml-2 text-primary" />
          </h1>
          <p className="text-sm text-gray-500 mt-2">Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-sm font-semibold text-gray-600">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', weekday: 'short' })}</span>
          <div className="relative">
            <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2 hover:bg-gray-100 rounded-full transition-colors focus:outline-none">
              <Bell className="text-gray-600" size={20} />
              {unreadNotifs > 0 && (
                <div className="absolute top-1 right-1 w-3 h-3 bg-red-500 text-white flex items-center justify-center border-2 border-gray-50 rounded-full text-[8px] font-bold">
                  {unreadNotifs}
                </div>
              )}
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[400px]">
                <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-gray-50/50">
                  <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
                  {unreadNotifs > 0 && (
                    <button onClick={markAllNotificationsRead} className="text-[11px] font-bold text-primary hover:underline">Mark all read</button>
                  )}
                </div>
                <div className="overflow-y-auto flex-1 p-2">
                  {notifications.length === 0 ? (
                    <p className="text-center text-xs text-gray-500 py-6 italic">You're all caught up.</p>
                  ) : (
                    notifications.map(n => (
                      <div 
                        key={n.id} 
                        onClick={() => handleNotificationClick(n)}
                        className={`p-3 mb-1 rounded-lg cursor-pointer transition-colors ${n.read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50/50 hover:bg-blue-50 border border-blue-100/50'}`}
                      >
                        <p className="text-xs text-gray-900 font-medium leading-snug">{n.title}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(n.date).toLocaleString()}</p>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-gray-50 bg-gray-50/50 text-center">
                  <span className="text-[11px] font-bold text-gray-500">View all notifications</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard 
          icon={<PawPrint size={20} className="text-blue-600" />} 
          label="Total Pets" value={totalPets} subtext="In database" colorClass="bg-blue-50" 
        />
        <StatCard 
          icon={<MessageSquare size={20} className="text-green-600" />} 
          label="Adoption Requests" value={adoptionRequests.length} subtext={`${pendingAdoptions} pending`} colorClass="bg-green-50" 
        />
        <StatCard 
          icon={<Bell size={20} className="text-orange-500" />} 
          label="Visit Requests" value={visitRequests.length} subtext={`${pendingVisits} pending`} colorClass="bg-orange-50" 
        />
        <StatCard 
          icon={<Heart size={20} className="text-purple-600" />} 
          label="Pets Adopted" value={petsAdopted} subtext="Total adoptions" colorClass="bg-purple-50" 
        />
      </div>

      {/* Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RequestList title="Recent Adoption Requests" requests={recentAdoptions} viewAllLink="/admin/requests" />
        <RequestList title="Recent Visit Requests" requests={recentVisits} viewAllLink="/admin/requests" />
      </div>
    </div>
  );
}
