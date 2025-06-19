document.addEventListener('DOMContentLoaded', () => {
    const guestList = document.getElementById('guestList');
    const totalPlaces = document.getElementById('totalPlaces');
    const totalReservations = document.getElementById('totalReservations');

    // Mettre à jour les statistiques
    const updateStats = async () => {
        try {
            const response = await fetch('/api/event/stats');
            const stats = await response.json();
            totalPlaces.textContent = stats.totalPlaces;
            totalReservations.textContent = `${stats.reservations}/${stats.totalPlaces}`;
        } catch (error) {
            console.error('Erreur lors de la récupération des statistiques:', error);
        }
    };

    // Afficher la liste des invités
    const loadGuests = async () => {
        try {
            const response = await fetch('/api/guests');
            const guests = await response.json();

            guestList.innerHTML = guests.map(guest => `
                <tr>
                    <td>${guest.name}</td>
                    <td>${guest.email}</td>
                    <td>${guest.phone || '-'}</td>
                    <td>${guest.confirmed ? 'Confirmé' : 'En attente'}</td>
                    <td class="actions">
                        ${!guest.confirmed ?
                            `<button class="confirm-btn" onclick="confirmGuest(${guest.id})">Confirmer</button>` :
                            ''
                        }
                        <button class="delete-btn" onclick="deleteGuest(${guest.id})">Supprimer</button>
                    </td>
                </tr>
            `).join('');

        } catch (error) {
            console.error('Erreur lors du chargement des invités:', error);
        }
    };

    // Confirmer une réservation
    window.confirmGuest = async (id) => {
        try {
            const response = await fetch(`/api/guests/${id}/confirm`, {
                method: 'PUT'
            });
            if (response.ok) {
                await loadGuests();
                await updateStats();
            }
        } catch (error) {
            console.error('Erreur lors de la confirmation:', error);
        }
    };

    // Supprimer une réservation
    window.deleteGuest = async (id) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            return;
        }

        try {
            const response = await fetch(`/api/guests/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                await loadGuests();
                await updateStats();
            }
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
        }
    };

    // Initialiser le dashboard
    updateStats();
    loadGuests();
});

async function loadDashboardData() {
    try {
        const token = localStorage.getItem('authToken');
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Charger les statistiques
        const statsResponse = await fetch('/api/event/admin/stats', { headers });
        if (statsResponse.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/admin/login.html';
            return;
        }
        const stats = await statsResponse.json();
        document.getElementById('totalPlaces').textContent = stats.totalPlaces;
        document.getElementById('totalReservations').textContent =
            `${stats.reservations}/${stats.totalPlaces}`;

        // Charger la liste des invités
        const guestsResponse = await fetch('/api/guests/admin', { headers });
        const guests = await guestsResponse.json();
        displayGuests(guests);
    } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
    }
}

// Confirmer un invité
async function confirmGuest(id) {
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/guests/admin/${id}/confirm`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            loadDashboardData();
        }
    } catch (error) {
        console.error('Erreur lors de la confirmation:', error);
    }
}

// Supprimer un invité
async function deleteGuest(id) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
        return;
    }
    try {
        const token = localStorage.getItem('authToken');
        const response = await fetch(`/api/guests/admin/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            loadDashboardData();
        }
    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
    }
}
