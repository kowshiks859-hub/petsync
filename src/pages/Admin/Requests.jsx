import { useState, useEffect } from 'react';

const API = '';

export default function Requests({ auth }) {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('Adoption');

  const token = auth?.token || localStorage.getItem('token');

  const loadRequests = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API}/api/requests`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (Array.isArray(data)) setRequests(data);
    } catch {}
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleStatus = async (id, status) => {
    if (!token) return;
    try {
      await fetch(`${API}/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      await loadRequests();
    } catch {}
  };

  const currentRequests    = requests.filter(r => r.type === activeTab);
  const pendingAdoption    = requests.filter(r => r.type === 'Adoption' && r.status === 'Pending').length;
  const pendingVisit       = requests.filter(r => r.type === 'Visit'    && r.status === 'Pending').length;
  const thisMonthApproved  = requests.filter(r => r.status === 'Approved').length;
  const thisMonthRejected  = requests.filter(r => r.status === 'Rejected').length;

  return (
    <div className="p-8 max-w-[1200px] mx-auto pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Requests Management</h1>
        <p className="text-sm text-gray-500 font-medium">Review and manage adoption & visit requests.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('Adoption')}
          className={`px-6 py-3 border-b-2 text-sm font-bold flex items-center space-x-2 ${activeTab === 'Adoption' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <span>Adoption Requests</span>
          <span className="w-5 h-5 rounded-full bg-secondary text-gray-900 flex items-center justify-center text-[10px] leading-none pb-[1px]">{pendingAdoption}</span>
        </button>
        <button 
          onClick={() => setActiveTab('Visit')}
          className={`px-6 py-3 border-b-2 text-sm font-bold flex items-center space-x-2 ${activeTab === 'Visit' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <span>Visit Requests</span>
          <span className="w-5 h-5 rounded-full bg-secondary text-gray-900 flex items-center justify-center text-[10px] leading-none pb-[1px]">{pendingVisit}</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Pet</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Requested by</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentRequests.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500 italic">No {activeTab.toLowerCase()} requests yet.</td>
                </tr>
              )}
              {currentRequests.map(req => (
                <tr key={req.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={req.pet.image} alt={req.pet.name} className="w-10 h-10 rounded-md object-cover border border-gray-200 bg-gray-50" />
                      <p className="font-bold text-gray-900 text-sm leading-tight">{req.pet.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900 text-sm">{req.user}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{req.phone || 'No phone'}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{req.type}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-700">{new Date(req.date).toLocaleDateString()}</p>
                    <p className="text-[11px] text-gray-500 font-medium">{new Date(req.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold ${
                      req.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                      req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-2">
                      {req.status === 'Pending' ? (
                        <>
                          <button onClick={() => handleStatus(req.id, 'Approved')} className="px-4 py-1.5 border border-green-500 text-green-600 rounded-md text-[11px] font-bold hover:bg-green-50 transition-colors">
                            Approve
                          </button>
                          <button onClick={() => handleStatus(req.id, 'Rejected')} className="px-4 py-1.5 border border-red-500 text-red-600 rounded-md text-[11px] font-bold hover:bg-red-50 transition-colors">
                            Reject
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium italic pr-4">Processed</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Activity Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-6">Activity Timeline</h3>
          
          <div className="space-y-6">
            {requests.slice(0, 5).map(r => (
              <div key={r.id} className="flex space-x-3">
                <div className={`mt-1 w-3 h-3 rounded-full border-2 shrink-0 ${r.type === 'Adoption' ? 'border-secondary' : 'border-blue-500'}`} />
                <div>
                  <p className="text-sm text-gray-800 font-medium leading-snug">New {r.type.toLowerCase()} request for {r.pet.name} by {r.user}</p>
                  <p className="text-[11px] text-gray-400 mt-1">{new Date(r.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {requests.length === 0 && <p className="text-sm text-gray-500 italic">No recent activity.</p>}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-bold text-gray-900 mb-6">Quick Stats</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-600">Pending Adoption Requests</span>
              <span className="font-bold text-gray-900">{pendingAdoption}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-600">Pending Visit Requests</span>
              <span className="font-bold text-gray-900">{pendingVisit}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-600">Total Approved</span>
              <span className="font-bold text-gray-900">{thisMonthApproved}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-600">Total Rejected</span>
              <span className="font-bold text-gray-900">{thisMonthRejected}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
