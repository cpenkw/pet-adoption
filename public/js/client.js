const API_URL = 'http://localhost:5000/api';
let allPets = [];

// Проверка авторизации
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token || !user) {
        window.location.href = '/';
        return null;
    }

    document.getElementById('clientUsername').textContent = `Welcome, ${user.username}`;
    return token;
}

// Логаут
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
}

// Получаем все доступные питомцы
async function fetchPets() {
    try {
        const response = await fetch(`${API_URL}/pets`);
        const result = await response.json();

        if (result.success) {
            allPets = result.data;   // ✅ БЕРЁМ ИМЕННО data
            displayPets(allPets);
        } else {
            showNoPets();
        }

    } catch (error) {
        console.error('Error fetching pets:', error);
        showNoPets();
    }
}


// Отображение питомцев на странице
function displayPets(pets) {
    const grid = document.getElementById('petsGrid');
    const noPetsDiv = document.getElementById('noPets');

    if (!pets || pets.length === 0) {
        grid.innerHTML = '';
        noPetsDiv.style.display = 'block';
        return;
    }

    noPetsDiv.style.display = 'none';

    grid.innerHTML = pets.map(pet => {
        const imgSrc = pet.image || 'https://via.placeholder.com/300x300?text=Pet+Image';
        return `
        <div class="pet-card">
            <img src="${imgSrc}" alt="${pet.name}" class="pet-card-image" onerror="this.src='https://via.placeholder.com/300x300?text=Pet+Image'">
            <div class="pet-card-content">
                <div class="pet-card-header">
                    <h3>${pet.name}</h3>
                    <span class="pet-badge badge-available">${pet.status}</span>
                </div>
                <div class="pet-card-info">
                    <p><strong>Type:</strong> ${pet.type}</p>
                    <p><strong>Breed:</strong> ${pet.breed}</p>
                    <p><strong>Age:</strong> ${pet.age} years</p>
                    <p><strong>Gender:</strong> ${pet.gender}</p>
                    <p><strong>Size:</strong> ${pet.size}</p>
                    <p><strong>Color:</strong> ${pet.color || 'Mixed'}</p>
                    <p><strong>Vaccinated:</strong> ${pet.vaccinated ? '✅ Yes' : '❌ No'}</p>
                </div>
            </div>
            <div class="pet-card-hover">
                <p><strong>About ${pet.name}:</strong></p>
                <p>${pet.description}</p>
                <div class="contact-info">
                    <p><strong>📧 Contact:</strong></p>
                    <p>${pet.contactEmail}</p>
                    ${pet.contactPhone ? `<p>📞 ${pet.contactPhone}</p>` : ''}
                    <p style="margin-top: 0.5rem; font-size: 0.85rem;">Reach out to adopt ${pet.name}!</p>
                </div>
            </div>
        </div>`;
    }).join('');
}

// Применяем фильтры по типу и породе
function applyFilters() {
    const typeFilter = document.getElementById('typeFilter').value;
    const breedFilter = document.getElementById('breedFilter').value.toLowerCase();

    let filtered = allPets;

    if (typeFilter !== 'all') {
        filtered = filtered.filter(pet => pet.type === typeFilter);
    }

    if (breedFilter) {
        filtered = filtered.filter(pet =>
            pet.breed.toLowerCase().includes(breedFilter)
        );
    }

    displayPets(filtered);
}

// Сброс фильтров
function resetFilters() {
    document.getElementById('typeFilter').value = 'all';
    document.getElementById('breedFilter').value = '';
    displayPets(allPets);
}

// Показываем сообщение, если питомцев нет
function showNoPets() {
    const grid = document.getElementById('petsGrid');
    const noPetsDiv = document.getElementById('noPets');
    grid.innerHTML = '';
    noPetsDiv.style.display = 'block';
}

// Запуск при загрузке страницы
window.addEventListener('DOMContentLoaded', () => {
    const token = checkAuth();
    if (token) fetchPets();

    // События фильтров
    document.getElementById('typeFilter').addEventListener('change', applyFilters);
    document.getElementById('breedFilter').addEventListener('keyup', applyFilters);

    document.querySelector('button.btn-secondary').addEventListener('click', logout);
});
