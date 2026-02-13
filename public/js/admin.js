const API_URL = 'http://localhost:5000/api';
let allPets = [];
let currentEditId = null;
let uploadedImageUrl = null;

// -------------------- AUTH --------------------
window.logout = function() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};

function checkAuth() {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  if (!token || !user) {
    window.location.href = '/';
    return null;
  }

  if (user.role !== 'admin') {
    alert('Access denied. Admin privileges required.');
    window.location.href = '/client';
    return null;
  }

  document.getElementById('adminUsername').textContent = `Welcome, ${user.username}`;
  return token;
}

// -------------------- IMAGE UPLOAD --------------------
window.handleImageUpload = async function(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Please select an image file');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Image size must be less than 5MB');
    return;
  }

  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('petImage', file);

  const preview = document.getElementById('imagePreview');
  preview.style.display = 'block';
  document.getElementById('previewImg').src = '';
  document.getElementById('previewImg').alt = 'Uploading...';

  try {
    const response = await fetch(`${API_URL}/pets/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });

    const result = await response.json();

    if (result.success) {
      uploadedImageUrl = result.imageUrl;
      document.getElementById('petImageFile').value = '';

      const img = document.getElementById('previewImg');
      img.src = uploadedImageUrl;
      img.alt = 'Uploaded image preview';

      alert('Image uploaded successfully!');
    } else {
      alert(result.message || 'Upload failed');
      preview.style.display = 'none';
    }
  } catch (err) {
    console.error(err);
    alert('Error uploading image');
    preview.style.display = 'none';
  }
};

// -------------------- FETCH & DISPLAY PETS --------------------
async function fetchPets() {
  try {
    const response = await fetch(`${API_URL}/pets`);
    const result = await response.json();
    if (result.success) {
      allPets = result.data;
      displayPets(allPets);
    } else {
      console.error('Failed to fetch pets', result.message);
      alert('Failed to load pets');
    }
  } catch (error) {
    console.error('Error fetching pets:', error);
    alert('Failed to load pets');
  }
}


function displayPets(pets) {
  const grid = document.getElementById('petsGrid');
  if (!pets || pets.length === 0) {
    grid.innerHTML = '<div class="no-pets"><p>No pets found. Add your first pet!</p></div>';
    return;
  }

  grid.innerHTML = pets.map(pet => `
    <div class="pet-card">
      <img src="${pet.image}" alt="${pet.name}" class="pet-card-image" 
           onerror="this.src='https://via.placeholder.com/300x300?text=Pet+Image'">
      <div class="pet-card-content">
        <div class="pet-card-header">
          <h3>${pet.name}</h3>
          <span class="pet-badge badge-${pet.status.toLowerCase()}">${pet.status}</span>
        </div>
        <div class="pet-card-info">
          <p><strong>Type:</strong> ${pet.type}</p>
          <p><strong>Breed:</strong> ${pet.breed}</p>
          <p><strong>Age:</strong> ${pet.age} years</p>
          <p><strong>Gender:</strong> ${pet.gender}</p>
          <p><strong>Size:</strong> ${pet.size}</p>
          <p><strong>Vaccinated:</strong> ${pet.vaccinated ? 'Yes' : 'No'}</p>
        </div>
        <div class="pet-card-actions">
          <button class="btn btn-edit" onclick="editPet('${pet._id}')">Edit</button>
          <button class="btn btn-delete" onclick="deletePet('${pet._id}')">Delete</button>
        </div>
      </div>
      <div class="pet-card-hover">
        <p><strong>Description:</strong> ${pet.description}</p>
        <div class="contact-info">
          <p>📧 ${pet.contactEmail}</p>
          ${pet.contactPhone ? `<p>📞 ${pet.contactPhone}</p>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// -------------------- FILTERS --------------------
window.applyFilters = function() {
  const typeFilter = document.getElementById('typeFilter').value;
  const breedFilter = document.getElementById('breedFilter').value.toLowerCase();
  const statusFilter = document.getElementById('statusFilter').value;

  let filteredPets = allPets;

  if (typeFilter !== 'all') filteredPets = filteredPets.filter(p => p.type === typeFilter);
  if (breedFilter) filteredPets = filteredPets.filter(p => p.breed.toLowerCase().includes(breedFilter));
  if (statusFilter) filteredPets = filteredPets.filter(p => p.status === statusFilter);

  displayPets(filteredPets);
};

// -------------------- MODAL --------------------
window.openAddModal = function() {
  currentEditId = null;
  uploadedImageUrl = null;
  document.getElementById('modalTitle').textContent = 'Add New Pet';
  document.getElementById('petForm').reset();
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('petModal').style.display = 'block';
};

window.closeModal = function() {
  document.getElementById('petModal').style.display = 'none';
  currentEditId = null;
  uploadedImageUrl = null;
  document.getElementById('imagePreview').style.display = 'none';
};

// -------------------- ADD / EDIT PET --------------------
document.getElementById('petForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login again');
    window.location.href = '/';
    return;
  }

  let imageUrl = uploadedImageUrl || 'https://via.placeholder.com/300x300?text=Pet+Image';

  const petData = {
    name: document.getElementById('petName').value,
    type: document.getElementById('petType').value,
    breed: document.getElementById('petBreed').value,
    age: parseInt(document.getElementById('petAge').value),
    gender: document.getElementById('petGender').value,
    size: document.getElementById('petSize').value,
    color: document.getElementById('petColor').value,
    status: document.getElementById('petStatus').value,
    description: document.getElementById('petDescription').value,
    image: imageUrl,
    contactEmail: document.getElementById('petContactEmail').value,
    contactPhone: document.getElementById('petContactPhone').value,
    vaccinated: document.getElementById('petVaccinated').checked
  };

  try {
    const url = currentEditId ? `${API_URL}/pets/${currentEditId}` : `${API_URL}/pets`;
    const method = currentEditId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(petData)
    });

    const result = await res.json();

    if (result.success) {
      alert(currentEditId ? 'Pet updated successfully!' : 'Pet added successfully!');
      closeModal();
      fetchPets();
    } else {
      alert(result.message || 'Operation failed');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred. Please try again.');
  }
});

// -------------------- DELETE PET --------------------
window.deletePet = async function(id) {
  if (!confirm('Are you sure you want to delete this pet?')) return;
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login again');
    window.location.href = '/';
    return;
  }

  try {
    const res = await fetch(`${API_URL}/pets/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const result = await res.json();

    if (result.success) {
      alert('Pet deleted successfully!');
      fetchPets();
    } else {
      alert(result.message || 'Delete failed');
    }
  } catch (err) {
    console.error(err);
    alert('An error occurred. Please try again.');
  }
};

// -------------------- EDIT PET --------------------
window.editPet = function(id) {
  const pet = allPets.find(p => p._id === id);
  if (!pet) return;

  currentEditId = id;
  uploadedImageUrl = pet.image;

  document.getElementById('modalTitle').textContent = 'Edit Pet';
  document.getElementById('petForm').reset();
  document.getElementById('petName').value = pet.name;
  document.getElementById('petType').value = pet.type;
  document.getElementById('petBreed').value = pet.breed;
  document.getElementById('petAge').value = pet.age;
  document.getElementById('petGender').value = pet.gender;
  document.getElementById('petSize').value = pet.size;
  document.getElementById('petColor').value = pet.color;
  document.getElementById('petStatus').value = pet.status;
  document.getElementById('petDescription').value = pet.description;
  document.getElementById('petContactEmail').value = pet.contactEmail;
  document.getElementById('petContactPhone').value = pet.contactPhone || '';
  document.getElementById('petVaccinated').checked = pet.vaccinated;

  if (pet.image) {
    document.getElementById('imagePreview').style.display = 'block';
    document.getElementById('previewImg').src = pet.image;
  }

  document.getElementById('petModal').style.display = 'block';
};

// -------------------- INIT --------------------
window.onclick = function(event) {
  const modal = document.getElementById('petModal');
  if (event.target === modal) closeModal();
};

window.addEventListener('DOMContentLoaded', () => {
  const token = checkAuth();
  if (token) fetchPets();

  // Image input listener
  const fileInput = document.getElementById('petImageFile');
  if (fileInput) fileInput.addEventListener('change', handleImageUpload);
});
