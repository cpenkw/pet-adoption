const API_URL = 'http://localhost:5000/api';
let allPets = [];
let currentEditId = null;

// Check authentication
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

    // Display username
    document.getElementById('adminUsername').textContent = `Welcome, ${user.username}`;

    return token;
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Fetch all pets
async function fetchPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        const data = await response.json();

        if (data.success) {
            allPets = data.data;
            displayPets(allPets);
        }
    } catch (error) {
        console.error('Error fetching pets:', error);
        alert('Failed to load pets');
    }
}

// Display pets
function displayPets(pets) {
    const grid = document.getElementById('petsGrid');

    if (pets.length === 0) {
        grid.innerHTML = '<div class="no-pets"><p>No pets found. Add your first pet!</p></div>';
        return;
    }

    grid.innerHTML = pets.map(pet => `
        <div class="pet-card">
            <img src="${pet.image}" alt="${pet.name}" class="pet-card-image" onerror="this.src='https://via.placeholder.com/300x300?text=Pet+Image'">
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

// Apply filters
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const breedFilter = document.getElementById('breedFilter').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;

    let filteredPets = allPets;

    if (typeFilter !== 'all') {
        filteredPets = filteredPets.filter(pet => pet.type === typeFilter);
    }

    if (breedFilter) {
        filteredPets = filteredPets.filter(pet =>
            pet.breed.toLowerCase().includes(breedFilter)
        );
    }

    if (statusFilter) {
        filteredPets = filteredPets.filter(pet => pet.status === statusFilter);
    }

    displayPets(filteredPets);
}

// Open add modal
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Pet';
    document.getElementById('petForm').reset();
    document.getElementById('petId').value = '';
    document.getElementById('petModal').style.display = 'block';
}

// Edit pet
function editPet(id) {
    const pet = allPets.find(p => p._id === id);
    if (!pet) return;

    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Pet';
    document.getElementById('petId').value = pet._id;
    document.getElementById('petName').value = pet.name;
    document.getElementById('petType').value = pet.type;
    document.getElementById('petBreed').value = pet.breed;
    document.getElementById('petAge').value = pet.age;
    document.getElementById('petGender').value = pet.gender;
    document.getElementById('petSize').value = pet.size;
    document.getElementById('petColor').value = pet.color;
    document.getElementById('petStatus').value = pet.status;
    document.getElementById('petDescription').value = pet.description;
    document.getElementById('petImage').value = pet.image;
    document.getElementById('petContactEmail').value = pet.contactEmail;
    document.getElementById('petContactPhone').value = pet.contactPhone || '';
    document.getElementById('petVaccinated').checked = pet.vaccinated;

    document.getElementById('petModal').style.display = 'block';
}

// Close modal
function closeModal() {
    document.getElementById('petModal').style.display = 'none';
    currentEditId = null;
}

// Handle form submission
document.getElementById('petForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login again');
        window.location.href = '/';
        return;
    }

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
        image: document.getElementById('petImage').value || 'https://via.placeholder.com/300x300?text=Pet+Image',
        contactEmail: document.getElementById('petContactEmail').value,
        contactPhone: document.getElementById('petContactPhone').value,
        vaccinated: document.getElementById('petVaccinated').checked
    };

    try {
        let url = `${API_URL}/pets`;
        let method = 'POST';

        if (currentEditId) {
            url = `${API_URL}/pets/${currentEditId}`;
            method = 'PUT';
        }

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(petData)
        });

        const data = await response.json();

        if (data.success) {
            alert(currentEditId ? 'Pet updated successfully!' : 'Pet added successfully!');
            closeModal();
            fetchPets();
        } else {
            alert(data.message || 'Operation failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

// Delete pet
async function deletePet(id) {
    if (!confirm('Are you sure you want to delete this pet?')) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Please login again');
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pets/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (data.success) {
            alert('Pet deleted successfully!');
            fetchPets();
        } else {
            alert(data.message || 'Delete failed');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('petModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    const token = checkAuth();
    if (token) {
        fetchPets();
    }
});