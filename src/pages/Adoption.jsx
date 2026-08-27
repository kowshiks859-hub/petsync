import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPets } from '../data/mockPets';
import { Search, PawPrint } from 'lucide-react';

const API = '';

export default function Adoption({ auth }) {
  const [searchParams] = useSearchParams();
  const initialPetName = searchParams.get('pet') || '';
  
  const [searchTerm, setSearchTerm] = useState(initialPetName);
  const [selectedPet, setSelectedPet] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [requestType, setRequestType] = useState('');
  const [requests, setRequests] = useState([]);

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
    if (initialPetName) handleSearch(initialPetName);
  }, [initialPetName]);

  const handleSearch = (term = searchTerm) => {
    const pets = getPets();
    const found = pets.find(p => p.name.toLowerCase() === term.toLowerCase());
    setSelectedPet(found || null);
  };

  const adoptionReq = selectedPet ? requests.find(r => r.pet?.id === selectedPet.id && r.type === 'Adoption') : null;
  const visitReq    = selectedPet ? requests.find(r => r.pet?.id === selectedPet.id && r.type === 'Visit')    : null;

  const initiateRequest = (type) => {
    setRequestType(type);
    setShowConfirmModal(true);
  };

  const confirmRequest = async () => {
    if (!token) return;
    try {
      await fetch(`${API}/api/requests`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pet:   { id: selectedPet.id, name: selectedPet.name, image: selectedPet.image },
          type:  requestType,
          phone: '',
        }),
      });
      setShowConfirmModal(false);
      await loadRequests();
      alert(`${requestType} request submitted successfully!`);
    } catch {
      alert('Could not submit request. Please try again.');
    }
  };

  const InfoRow = ({ icon, label, value }) => (
    <div className="flex items-center space-x-3 py-2 border-b border-gray-100 last:border-0">
      <div className="text-gray-400 w-5 text-center">{icon}</div>
      <div className="flex-1 text-sm font-semibold text-gray-500">{label}</div>
      <div className="flex-1 text-sm font-bold text-gray-900 text-right">{value}</div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-gray-50 pb-16">
      {/* Search Header */}
      <div className="bg-primary pt-6 pb-20 px-4 sm:px-6 lg:px-8 border-t-2 border-secondary relative overflow-hidden">
        <PawPrint className="absolute -top-4 right-12 w-24 h-24 text-white opacity-[0.04] rotate-12" />
        <PawPrint className="absolute bottom-4 left-8 w-20 h-20 text-white opacity-[0.04] -rotate-12" />
        <div className="max-w-[1440px] mx-auto relative z-10">
          <div className="bg-white rounded-xl shadow-sm flex items-center mt-2 p-1.5 overflow-hidden">
            <span className="text-gray-400 ml-4 font-bold text-sm whitespace-nowrap hidden sm:block">Enter the name of the pet</span>
            <input 
              type="text" 
              placeholder="Bruno" 
              className="flex-1 border-none focus:ring-0 px-4 py-2 text-gray-900 font-bold placeholder-gray-300 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button 
              onClick={() => handleSearch()}
              className="bg-secondary text-gray-900 px-8 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
        {!selectedPet ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-16 text-center">
            <Search className="mx-auto text-gray-200 mb-4" size={48} />
            <h3 className="text-lg font-bold text-gray-400">Search for a pet to view their profile</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Image & Thumbnails */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <img src={selectedPet.image} alt={selectedPet.name} className="w-full aspect-square object-cover" />
              </div>
              <div className="grid grid-cols-4 gap-2">
                 {/* Fake thumbnails for mockup */}
                 <img src={selectedPet.image} className="w-full aspect-square object-cover rounded-lg border-2 border-primary" />
                 <img src={selectedPet.image} className="w-full aspect-square object-cover rounded-lg border border-gray-200 opacity-60" />
                 <img src={selectedPet.image} className="w-full aspect-square object-cover rounded-lg border border-gray-200 opacity-60" />
                 <img src={selectedPet.image} className="w-full aspect-square object-cover rounded-lg border border-gray-200 opacity-60" />
              </div>
            </div>

            {/* Middle: Details */}
            <div className="lg:col-span-4 flex flex-col">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <span className="w-6 text-center mr-2 text-gray-400">👤</span> Name <span className="ml-auto">{selectedPet.name}</span>
                </h2>
                
                <div className="space-y-1 mb-6">
                  <InfoRow icon="🐾" label="Type" value={selectedPet.type} />
                  <InfoRow icon="⏳" label="Age" value={selectedPet.age} />
                  <InfoRow icon="⚥" label="Gender" value={selectedPet.gender} />
                  <InfoRow icon="🏠" label="Shelter" value={selectedPet.shelter} />
                  <InfoRow icon="📍" label="Location" value={selectedPet.location} />
                  <InfoRow icon="🩺" label="Medical Status" value={selectedPet.medicalStatus} />
                  <InfoRow icon="🏷️" label="Adoption Status" value={selectedPet.adoptionStatus} />
                </div>

                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center"><span className="w-6 text-center mr-2 text-gray-400">🌟</span> Personality</h4>
                  <p className="text-sm font-bold text-gray-900 ml-8">{selectedPet.personality.join(', ')}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center"><span className="w-6 text-center mr-2 text-gray-400">❤️</span> Loves</h4>
                  <p className="text-sm font-bold text-gray-900 ml-8">{selectedPet.loves.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="lg:col-span-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">Make a Request</h3>
                
                <div className="space-y-6">
                  {/* Adopt Card */}
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between shadow-sm bg-gray-50/50 relative">
                    {adoptionReq && (
                      <div className="absolute -top-3 -right-3">
                        <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold shadow-sm ${
                          adoptionReq.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          adoptionReq.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {adoptionReq.status}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-primary shrink-0">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Adopt Me</h4>
                        <p className="text-sm text-gray-500 leading-snug mt-1">Send an adoption request for {selectedPet.name}.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => initiateRequest('Adoption')}
                      disabled={selectedPet.adoptionStatus !== 'Available' || (adoptionReq && adoptionReq.status !== 'Rejected')}
                      className="w-full bg-secondary text-gray-900 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                      {adoptionReq && adoptionReq.status !== 'Rejected' ? 'Request Sent' : 'Adopt Me'}
                    </button>
                  </div>

                  {/* Visit Card */}
                  <div className="border border-gray-100 rounded-xl p-4 flex flex-col justify-between shadow-sm bg-gray-50/50 relative">
                    {visitReq && (
                      <div className="absolute -top-3 -right-3">
                        <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold shadow-sm ${
                          visitReq.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 
                          visitReq.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {visitReq.status}
                        </span>
                      </div>
                    )}
                    <div className="flex items-start space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 font-bold shrink-0">
                        A
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">Request a Visit</h4>
                        <p className="text-sm text-gray-500 leading-snug mt-1">Request a visit to meet {selectedPet.name} at the shelter.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => initiateRequest('Visit')}
                      disabled={visitReq && visitReq.status !== 'Rejected'}
                      className="w-full bg-secondary text-gray-900 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50"
                    >
                      {visitReq && visitReq.status !== 'Rejected' ? 'Request Sent' : 'Request Visit'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Request</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {requestType === 'Adoption' 
                ? `Submit an adoption request for ${selectedPet.name}?`
                : `Submit a visit request for ${selectedPet.name}?`}
            </p>
            
            <div className="flex space-x-3">
              <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 text-sm">Cancel</button>
              <button onClick={confirmRequest} className="flex-1 py-2.5 rounded-lg font-bold text-gray-900 bg-secondary hover:bg-yellow-400 text-sm shadow-sm">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
