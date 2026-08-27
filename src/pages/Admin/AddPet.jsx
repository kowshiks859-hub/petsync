import { useState, useEffect } from 'react';
import { UploadCloud, Plus, X } from 'lucide-react';
import { getPets, savePets, updatePet } from '../../data/mockPets';
import { useNavigate, Link, useParams } from 'react-router-dom';

export default function AddPet() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: 'Bruno', type: 'Dog', breed: 'Golden Retriever', age: '2 Years', 
    gender: 'Male', weight: '25', shelter: 'Blue Cross, Chennai', location: 'Chennai, Tamil Nadu', 
    medicalStatus: 'Vaccinated', adoptionStatus: 'Available', personality: 'Playful, Friendly, Calm', 
    loves: 'People, Walks, Toys', lookingFor: '', story: 'Bruno is a playful and friendly boy who loves people and outdoor walks. He gets along well with other dogs and is looking for a loving forever home.', 
    image: '/dogs/ezgif-frame-001.png'
  });

  useEffect(() => {
    if (id) {
      const petToEdit = getPets().find(p => p.id === id);
      if (petToEdit) {
        setFormData({
          ...petToEdit,
          personality: Array.isArray(petToEdit.personality) ? petToEdit.personality.join(', ') : petToEdit.personality,
          loves: Array.isArray(petToEdit.loves) ? petToEdit.loves.join(', ') : petToEdit.loves,
        });
      }
    } else {
      setFormData({
        name: '', type: 'Dog', breed: '', age: '', 
        gender: 'Male', weight: '', shelter: 'Blue Cross, Chennai', location: 'Chennai, Tamil Nadu', 
        medicalStatus: 'Vaccinated', adoptionStatus: 'Available', personality: '', 
        loves: '', lookingFor: '', story: '', 
        image: '/dogs/ezgif-frame-001.png'
      });
    }
  }, [id]);

  const handleSavePet = (e) => {
    e.preventDefault();
    const formattedData = {
      ...formData,
      personality: formData.personality.split(',').map(s => s.trim()).filter(Boolean),
      loves: formData.loves.split(',').map(s => s.trim()).filter(Boolean),
    };

    if (id) {
      updatePet({ ...formattedData, id });
    } else {
      const pets = getPets();
      const updatedPets = [...pets, { ...formattedData, id: `pet-${Date.now()}`, rescuedDate: new Date().toLocaleDateString() }];
      savePets(updatedPets);
    }
    navigate('/admin/pets');
  };

  const InputLabel = ({ children, required }) => (
    <label className="block text-[11px] font-bold text-gray-900 mb-1.5">
      {children} {required && <span className="text-red-500">*</span>}
    </label>
  );

  return (
    <form onSubmit={handleSavePet} className="p-8 max-w-[1200px] mx-auto pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1.5">{id ? 'Edit Pet' : 'Add New Pet'}</h1>
        <p className="text-sm text-gray-500 font-medium">
          {id ? 'Update the details for this pet.' : 'Fill in the details to add a new pet for adoption.'}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column - Photos */}
          <div className="lg:col-span-4">
            <InputLabel>Pet Photos</InputLabel>
            <p className="text-[11px] text-gray-500 mb-3">Upload clear photos of the pet.</p>
            
            <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 mb-4 hover:bg-gray-50 cursor-pointer transition-colors">
              <UploadCloud size={32} className="text-primary mb-3" />
              <p className="text-sm font-bold text-primary mb-1">Click to upload</p>
              <p className="text-[11px] text-gray-500">PNG, JPG up to 5MB</p>
            </div>

            <div className="flex space-x-3 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-16 h-16 rounded-md border border-gray-200 overflow-hidden shrink-0 relative group">
                  <img src="/dogs/ezgif-frame-001.png" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center cursor-pointer">
                    <X size={16} className="text-white" />
                  </div>
                </div>
              ))}
              <button type="button" className="w-16 h-16 rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary shrink-0 transition-colors">
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Right Column - Basic Info Form */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <InputLabel required>Pet Name</InputLabel>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <InputLabel required>Animal Type</InputLabel>
                <select required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary">
                  <option>Dog</option><option>Cat</option>
                </select>
              </div>
              
              <div>
                <InputLabel>Breed</InputLabel>
                <input value={formData.breed} onChange={e => setFormData({...formData, breed: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <InputLabel required>Age</InputLabel>
                <input required value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <InputLabel required>Gender</InputLabel>
                <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary">
                  <option>Male</option><option>Female</option>
                </select>
              </div>
              <div>
                <InputLabel>Weight (kg)</InputLabel>
                <input value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <InputLabel required>Shelter</InputLabel>
                <input required value={formData.shelter} onChange={e => setFormData({...formData, shelter: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
              </div>
              <div>
                <InputLabel required>Location</InputLabel>
                <input required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
              </div>
              
              <div>
                <InputLabel required>Medical Status</InputLabel>
                <select required value={formData.medicalStatus} onChange={e => setFormData({...formData, medicalStatus: e.target.value})} className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary">
                  <option>Vaccinated</option><option>Sterilized</option><option>Under Treatment</option>
                </select>
              </div>
              <div>
                <InputLabel required>Adoption Status</InputLabel>
                <select required value={formData.adoptionStatus} onChange={e => setFormData({...formData, adoptionStatus: e.target.value})} className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary">
                  <option>Available</option><option>Reserved</option><option>Adopted</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Full Width Info */}
        <div className="mt-8 pt-8 border-t border-gray-100 space-y-6">
          <div>
            <InputLabel>Personality (Comma separated)</InputLabel>
            <input value={formData.personality} onChange={e => setFormData({...formData, personality: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
          </div>

          <div>
            <InputLabel>Loves (Comma separated)</InputLabel>
            <input value={formData.loves} onChange={e => setFormData({...formData, loves: e.target.value})} type="text" className="w-full border border-gray-200 rounded-md p-2.5 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary" />
          </div>

          <div>
            <InputLabel>Story / Description</InputLabel>
            <textarea 
              rows="4" 
              className="w-full border border-gray-200 rounded-md p-3 text-sm font-medium text-gray-800 focus:outline-none focus:border-primary resize-none mt-1"
              value={formData.story}
              onChange={e => setFormData({...formData, story: e.target.value})}
            ></textarea>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
          <Link to="/admin/pets" className="px-6 py-2.5 rounded-md font-bold text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            Cancel
          </Link>
          <button type="submit" className="bg-secondary text-gray-900 px-8 py-2.5 rounded-md font-bold text-sm hover:bg-yellow-400 transition-colors shadow-sm">
            Save Pet
          </button>
        </div>

      </div>
    </form>
  );
}
