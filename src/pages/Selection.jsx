import { useState, useEffect } from 'react';
import { getPets } from '../data/mockPets';
import { Heart, Search, RotateCcw, ShieldCheck, MapPin, PawPrint } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const API = '';

export default function Selection({ auth }) {
  const navigate = useNavigate();
  const [pets, setPets] = useState([]);
  const [likedPets, setLikedPets] = useState([]);
  const [filters, setFilters] = useState({
    type: 'All', shelter: 'All', location: 'All', age: 'All', gender: 'All', medicalStatus: 'All', search: ''
  });

  const token = auth?.token || localStorage.getItem('token');

  useEffect(() => {
    setPets(getPets());
    // Load likes from server
    if (token) {
      fetch(`${API}/api/likes`, { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data)) setLikedPets(data); })
        .catch(() => {}); // Server not running — silently skip
    }
    window.addEventListener('bluecross_data_change', () => setPets(getPets()));
    return () => window.removeEventListener('bluecross_data_change', () => setPets(getPets()));
  }, []);

  const handleLike = async (e, petId) => {
    e.preventDefault();
    // Optimistic update
    setLikedPets(prev => prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]);
    if (token) {
      try {
        const res = await fetch(`${API}/api/likes/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ petId }),
        });
        const data = await res.json();
        if (Array.isArray(data)) setLikedPets(data);
      } catch {} // Server unreachable — keep optimistic state
    }
  };

  const resetFilters = () => {
    setFilters({ type: 'All', shelter: 'All', location: 'All', age: 'All', gender: 'All', medicalStatus: 'All', search: '' });
  };

  const filteredPets = pets.filter(pet => {
    if (filters.type !== 'All' && pet.type !== filters.type) return false;
    if (filters.shelter !== 'All' && pet.shelter !== filters.shelter) return false;
    if (filters.location !== 'All' && !pet.location.includes(filters.location)) return false;
    if (filters.gender !== 'All' && pet.gender !== filters.gender) return false;
    if (filters.medicalStatus !== 'All' && pet.medicalStatus !== filters.medicalStatus) return false;
    if (filters.search && !pet.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const getBadgeStyle = (status) => {
    switch (status) {
      case 'Available': return 'bg-secondary text-gray-900';
      case 'Reserved': return 'bg-yellow-200 text-yellow-800';
      case 'Adopted': return 'bg-gray-200 text-gray-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const FilterSelect = ({ label, value, onChange, options }) => (
    <div className="flex-1 min-w-[120px]">
      <div className="bg-white rounded-md p-2 shadow-sm border border-gray-200 h-full flex flex-col justify-center">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">{label}</label>
        <select 
          className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none cursor-pointer"
          value={value} 
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)] bg-primary pb-24 relative overflow-hidden">
      {/* Global Decorative Paws for the full blue background */}
      <PawPrint className="absolute -top-4 -left-4 w-32 h-32 text-white opacity-[0.03] rotate-12" />
      <PawPrint className="absolute top-1/4 right-8 w-24 h-24 text-white opacity-[0.03] -rotate-12" />
      <PawPrint className="absolute top-1/2 left-12 w-28 h-28 text-white opacity-[0.03] rotate-45" />
      <PawPrint className="absolute bottom-16 right-1/4 w-32 h-32 text-white opacity-[0.02] -rotate-45" />
      <PawPrint className="absolute bottom-4 left-1/3 w-20 h-20 text-white opacity-[0.02] rotate-12" />

      {/* Top Section with Filters */}
      <div className="pt-8 pb-10 px-4 sm:px-6 lg:px-8 border-t-2 border-secondary relative z-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex flex-wrap lg:flex-nowrap gap-3 items-stretch">
            <FilterSelect label="Animal Type" value={filters.type} onChange={v => setFilters({...filters, type: v})} options={[{label:'All', value:'All'}, {label:'🐶 Dog', value:'Dog'}, {label:'🐱 Cat', value:'Cat'}]} />
            <FilterSelect label="Shelter" value={filters.shelter} onChange={v => setFilters({...filters, shelter: v})} options={[{label:'All Shelters', value:'All'}, {label:'Blue Cross, Chennai', value:'Blue Cross, Chennai'}, {label:'Bengaluru', value:'Blue Cross, Bengaluru'}]} />
            <FilterSelect label="Location" value={filters.location} onChange={v => setFilters({...filters, location: v})} options={[{label:'All Locations', value:'All'}, {label:'Chennai', value:'Chennai'}, {label:'Bengaluru', value:'Bengaluru'}, {label:'Coimbatore', value:'Coimbatore'}]} />
            <FilterSelect label="Age" value={filters.age} onChange={v => setFilters({...filters, age: v})} options={[{label:'All Ages', value:'All'}, {label:'Young', value:'Young'}, {label:'Adult', value:'Adult'}]} />
            <FilterSelect label="Gender" value={filters.gender} onChange={v => setFilters({...filters, gender: v})} options={[{label:'All', value:'All'}, {label:'Male', value:'Male'}, {label:'Female', value:'Female'}]} />
            <FilterSelect label="Medical Status" value={filters.medicalStatus} onChange={v => setFilters({...filters, medicalStatus: v})} options={[{label:'All', value:'All'}, {label:'Vaccinated', value:'Vaccinated'}, {label:'Sterilized', value:'Sterilized'}]} />
            
            <div className="flex-[1.5] min-w-[200px] bg-white rounded-md p-2 shadow-sm flex flex-col justify-center relative">
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-0.5">Pet Name</label>
              <div className="flex items-center w-full">
                <input 
                  type="text" 
                  placeholder="Search name..." 
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 focus:outline-none placeholder-gray-400"
                  value={filters.search} 
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                <Search size={16} className="text-gray-400 ml-2" />
              </div>
            </div>

            <button 
              onClick={resetFilters}
              className="flex items-center justify-center space-x-1.5 text-xs text-white hover:text-secondary transition-colors px-3 font-medium min-w-[100px]"
            >
              <RotateCcw size={14} />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredPets.map(pet => (
            <Link to={`/adoption?pet=${pet.name}`} key={pet.id} className="bg-white rounded-xl shadow-lg overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              {/* Image Area */}
              <div className="relative h-[280px] overflow-hidden shrink-0">
                <img 
                  src={pet.image} 
                  alt={pet.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-xs font-bold shadow-md ${getBadgeStyle(pet.adoptionStatus)}`}>
                  {pet.adoptionStatus}
                </div>
                <button 
                  onClick={(e) => handleLike(e, pet.id)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-md hover:scale-110 transition-transform"
                >
                  <Heart size={20} className={likedPets.includes(pet.id) ? 'fill-red-500 text-red-500' : 'text-gray-400 stroke-[2.5]'} />
                </button>
              </div>
              
              {/* Content Area */}
              <div className="p-5 flex flex-col flex-1 bg-white">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{pet.name}</h3>
                <p className="text-sm text-gray-500 font-medium mb-5">
                  {pet.age} • {pet.gender} • {pet.location}
                </p>
                
                <div className="space-y-2.5 mt-auto text-sm text-gray-600 font-medium">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck size={18} className="text-gray-400" />
                    <span>{pet.medicalStatus}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin size={18} className="text-gray-400" />
                    <span>{pet.shelter}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PawPrint size={18} className="text-gray-400" />
                    <span>{pet.type}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
