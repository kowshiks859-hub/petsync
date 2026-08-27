import { useState, useEffect } from 'react';
import { getPets, deletePet } from '../../data/mockPets';
import { Plus, Search, Filter, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function PetManagement() {
  const [pets, setPets] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadData = () => setPets(getPets());
    loadData();
    window.addEventListener('bluecross_data_change', loadData);
    return () => window.removeEventListener('bluecross_data_change', loadData);
  }, []);

  const handleDelete = (id) => {
    if(window.confirm('Are you sure you want to delete this pet?')) {
      deletePet(id);
    }
  };

  const FilterSelect = ({ label, value }) => (
    <div className="flex-1 min-w-[120px]">
      <label className="block text-[11px] font-bold text-gray-500 mb-1.5">{label}</label>
      <select className="w-full border border-gray-200 rounded-md py-2 px-3 text-sm font-semibold text-gray-800 focus:outline-none focus:border-primary bg-white">
        <option>{value}</option>
      </select>
    </div>
  );

  return (
    <div className="p-8 max-w-[1200px] mx-auto pb-16">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Pet Management</h1>
          <p className="text-sm text-gray-500 font-medium">Add, edit and manage all pets available for adoption.</p>
        </div>
        <Link 
          to="/admin/pets/add" 
          className="bg-secondary text-gray-900 px-5 py-2.5 rounded-md font-bold text-sm flex items-center space-x-1.5 hover:bg-yellow-400 transition-colors shadow-sm"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Add New Pet</span>
        </Link>
      </div>

      {/* Filters Box */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
        <div className="flex flex-wrap gap-4 mb-4">
          <FilterSelect label="Animal Type" value="All" />
          <FilterSelect label="Shelter" value="All Shelters" />
          <FilterSelect label="Location" value="All Locations" />
          <FilterSelect label="Age" value="All Ages" />
          <FilterSelect label="Gender" value="All" />
          <FilterSelect label="Medical Status" value="All" />
        </div>
        
        <div className="flex items-center justify-end space-x-3">
          <div className="relative w-64">
            <input 
              type="text" 
              placeholder="Search pet name..." 
              className="w-full border border-gray-200 rounded-md py-2 pl-3 pr-10 text-sm font-medium focus:outline-none focus:border-primary placeholder-gray-400"
            />
            <Search className="absolute right-3 top-2.5 text-gray-400" size={16} />
          </div>
          <button className="flex items-center space-x-2 border border-gray-200 px-4 py-2 rounded-md text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Filter size={14} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Pet</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Age</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Gender</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Medical Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pets.map((pet, idx) => (
                <tr key={pet.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <img src={pet.image} alt={pet.name} className="w-10 h-10 rounded-md object-cover border border-gray-200" />
                      <div>
                        <p className="font-bold text-gray-900 text-sm leading-tight">{pet.name}</p>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">ID: P00{idx + 1}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{pet.type}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{pet.age}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{pet.gender}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{pet.location.split(',')[0]}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-700">{pet.medicalStatus}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-sm text-[11px] font-bold ${
                      pet.adoptionStatus === 'Available' ? 'bg-green-50 text-green-700' :
                      pet.adoptionStatus === 'Reserved' ? 'bg-orange-50 text-orange-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {pet.adoptionStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end space-x-3">
                      <button onClick={() => navigate('/admin/pets/edit/' + pet.id)} className="text-primary hover:text-primary-dark">
                        <Edit size={16} strokeWidth={2.5} />
                      </button>
                      <button onClick={() => handleDelete(pet.id)} className="text-red-500 hover:text-red-600">
                        <Trash2 size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 font-medium">Showing {pets.length === 0 ? 0 : 1} to {pets.length} of {pets.length} pets</p>
        <div className="flex space-x-1">
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 bg-white">&lt;</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md bg-primary text-white font-bold text-sm">1</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium bg-white">2</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium bg-white">3</button>
          <span className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm">...</span>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium bg-white">26</button>
          <button className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 bg-white">&gt;</button>
        </div>
      </div>
    </div>
  );
}
