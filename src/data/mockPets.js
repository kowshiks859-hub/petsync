export const initialPets = [
  {
    id: "pet-001",
    name: "Bruno",
    type: "Dog",
    breed: "Golden Retriever",
    age: "2 Yrs",
    gender: "Male",
    location: "Chennai",
    shelter: "Blue Cross, Chennai",
    medicalStatus: "Vaccinated",
    adoptionStatus: "Available",
    personality: ["Playful", "Friendly", "Calm"],
    loves: ["People", "Walks", "Toys"],
    lookingFor: "A patient family",
    rescuedDate: "June 2026",
    image: "/dogs/ezgif-frame-001.png",
    story: "Bruno is a playful and friendly boy who loves people and outdoor walks. He gets along well with other dogs and is looking for a loving forever home."
  },
  {
    id: "pet-002",
    name: "Max",
    type: "Dog",
    breed: "Beagle",
    age: "1.5 Yrs",
    gender: "Male",
    location: "Bengaluru",
    shelter: "Blue Cross, Bengaluru",
    medicalStatus: "Vaccinated",
    adoptionStatus: "Available",
    personality: ["Active", "Loyal", "Smart"],
    loves: ["Running", "Treats"],
    lookingFor: "An active companion",
    rescuedDate: "July 2026",
    image: "/dogs/ezgif-frame-050.png",
    story: "Max is energetic and very loyal. He learns tricks quickly and needs someone who can keep up with his active lifestyle."
  },
  {
    id: "pet-003",
    name: "Luna",
    type: "Dog",
    breed: "Labrador",
    age: "3 Yrs",
    gender: "Female",
    location: "Coimbatore",
    shelter: "Blue Cross, Coimbatore",
    medicalStatus: "Sterilized",
    adoptionStatus: "Reserved",
    personality: ["Gentle", "Calm"],
    loves: ["Naps", "Belly rubs"],
    lookingFor: "A quiet home",
    rescuedDate: "May 2026",
    image: "/dogs/ezgif-frame-100.png",
    story: "Luna is a gentle soul who loves to nap in the sun. She's perfect for a family looking for a calm and affectionate companion."
  }
];

export const notifyDataChange = () => {
  window.dispatchEvent(new Event('bluecross_data_change'));
};

// --- PETS ---
export const getPets = () => {
  const saved = localStorage.getItem('bluecross_pets');
  if (saved) return JSON.parse(saved);
  localStorage.setItem('bluecross_pets', JSON.stringify(initialPets));
  return initialPets;
};

export const savePets = (pets) => {
  localStorage.setItem('bluecross_pets', JSON.stringify(pets));
  notifyDataChange();
};

export const addPet = (pet) => {
  const pets = getPets();
  savePets([...pets, { ...pet, id: `pet-${Date.now()}`, rescuedDate: new Date().toLocaleDateString() }]);
};

export const updatePet = (updatedPet) => {
  const pets = getPets();
  savePets(pets.map(p => p.id === updatedPet.id ? updatedPet : p));
};

export const deletePet = (petId) => {
  const pets = getPets();
  savePets(pets.filter(p => p.id !== petId));
};

// --- LIKES ---
export const getLikedPets = () => {
  const saved = localStorage.getItem('bluecross_liked_pets');
  return saved ? JSON.parse(saved) : [];
};

export const toggleLikePet = (petId) => {
  const liked = getLikedPets();
  let updated;
  if (liked.includes(petId)) {
    updated = liked.filter(id => id !== petId);
  } else {
    updated = [...liked, petId];
  }
  localStorage.setItem('bluecross_liked_pets', JSON.stringify(updated));
  notifyDataChange();
  return updated;
};

// --- REQUESTS ---
export const getRequests = () => {
  const saved = localStorage.getItem('bluecross_requests');
  return saved ? JSON.parse(saved) : [];
};

export const addRequest = (request) => {
  const requests = getRequests();
  const newRequest = {
    ...request,
    id: `req-${Date.now()}`,
    date: new Date().toISOString(),
    status: 'Pending'
  };
  localStorage.setItem('bluecross_requests', JSON.stringify([...requests, newRequest]));
  
  // Auto-generate notification for admin
  addNotification({
    title: `New ${request.type.toLowerCase()} request for ${request.pet.name} by ${request.user}`,
    type: 'request',
    link: '/admin/requests'
  });
  
  notifyDataChange();
  return newRequest;
};

export const updateRequestStatus = (requestId, status) => {
  const requests = getRequests();
  const req = requests.find(r => r.id === requestId);
  if (!req) return;
  
  const updated = requests.map(r => r.id === requestId ? { ...r, status } : r);
  localStorage.setItem('bluecross_requests', JSON.stringify(updated));
  
  // If adoption approved, update pet status to Adopted
  if (req.type === 'Adoption' && status === 'Approved') {
    const pets = getPets();
    const petToUpdate = pets.find(p => p.id === req.pet.id);
    if (petToUpdate) {
      updatePet({ ...petToUpdate, adoptionStatus: 'Adopted' });
    }
  }

  // Generate notification for user (simulation)
  addNotification({
    title: `Your ${req.type.toLowerCase()} request for ${req.pet.name} was ${status.toLowerCase()}`,
    type: 'status',
  });
  
  notifyDataChange();
  return updated;
};

// --- NOTIFICATIONS ---
export const getNotifications = () => {
  const saved = localStorage.getItem('bluecross_notifications');
  return saved ? JSON.parse(saved) : [];
};

export const addNotification = (notification) => {
  const notifications = getNotifications();
  const newNotif = {
    ...notification,
    id: `notif-${Date.now()}`,
    date: new Date().toISOString(),
    read: false
  };
  localStorage.setItem('bluecross_notifications', JSON.stringify([newNotif, ...notifications]));
  notifyDataChange();
};

export const markNotificationRead = (id) => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('bluecross_notifications', JSON.stringify(updated));
  notifyDataChange();
};

export const markAllNotificationsRead = () => {
  const notifications = getNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  localStorage.setItem('bluecross_notifications', JSON.stringify(updated));
  notifyDataChange();
};
