// ========== Event Manager Class ==========
class EventManager {
    constructor() {
        this.events = this.loadEvents();
        this.joinedEvents = this.loadJoinedEvents();
        this.userLocation = null;
    }

    // Load events from localStorage
    loadEvents() {
        const stored = localStorage.getItem('events');
        return stored ? JSON.parse(stored) : this.getDefaultEvents();
    }

    // Load user's joined events
    loadJoinedEvents() {
        const stored = localStorage.getItem('joinedEvents');
        return stored ? JSON.parse(stored) : [];
    }

    // Save events to localStorage
    saveEvents() {
        localStorage.setItem('events', JSON.stringify(this.events));
    }

    // Save joined events to localStorage
    saveJoinedEvents() {
        localStorage.setItem('joinedEvents', JSON.stringify(this.joinedEvents));
    }

    // Get default sample events
    getDefaultEvents() {
        return [
            {
                id: 1,
                title: 'Fællesskabs-basketkamp',
                category: 'sports',
                date: '2026-01-25',
                time: '18:00',
                location: 'Central Park-banen',
                latitude: 55.676,
                longitude: 12.569,
                description: 'Ugentlig basketkamp for alle niveauer. Tag dine venner med!',
                capacity: 20,
                participants: 12,
                creator: 'Alex S.'
            },
            {
                id: 2,
                title: 'Lokal jam-session',
                category: 'music',
                date: '2026-01-24',
                time: '19:30',
                location: 'Coffee Corner Café',
                latitude: 55.680,
                longitude: 12.575,
                description: 'Åben jam-session. Tag dit instrument med – eller kom bare og lyt!',
                capacity: 30,
                participants: 8,
                creator: 'Jamie K.'
            },
            {
                id: 3,
                title: 'Pizza-aften',
                category: 'food',
                date: '2026-01-26',
                time: '20:00',
                location: 'Downtown Pizzeria',
                latitude: 55.682,
                longitude: 12.577,
                description: 'Uformel middag. Mød nye mennesker i området!',
                capacity: 40,
                participants: 15,
                creator: 'Maria L.'
            },
            {
                id: 4,
                title: 'Morgenvandring i skoven',
                category: 'outdoor',
                date: '2026-01-25',
                time: '08:00',
                location: 'Skovstien Nord',
                latitude: 55.700,
                longitude: 12.560,
                description: 'Let til moderat rute. Vi mødes ved parkeringspladsen. Husk vand!',
                capacity: 25,
                participants: 10,
                creator: 'Chris T.'
            },
            {
                id: 5,
                title: 'Yoga for begyndere',
                category: 'social',
                date: '2026-01-24',
                time: '17:00',
                location: 'Medborgerhuset',
                latitude: 55.675,
                longitude: 12.570,
                description: 'Afslappende yoga – perfekt for begyndere. Måtte er inkluderet.',
                capacity: 20,
                participants: 14,
                creator: 'Sarah M.'
            },
            {
                id: 6,
                title: 'Kunstworkshop: Akvarel for begyndere',
                category: 'art',
                date: '2026-01-27',
                time: '14:00',
                location: 'Creative Studio Hub',
                latitude: 55.678,
                longitude: 12.572,
                description: 'Lær grundlæggende akvarel. Alle materialer er inkluderet.',
                capacity: 15,
                participants: 6,
                creator: 'Emma B.'
            }
        ];
    }

    // Create a new event
    createEvent(eventData) {
        const newEvent = {
            id: Date.now(),
            ...eventData,
            participants: 1,
            creator: 'Dig'
        };
        this.events.push(newEvent);
        this.joinedEvents.push(newEvent.id);
        this.saveEvents();
        this.saveJoinedEvents();
        return newEvent;
    }

    // Get all events
    getAllEvents() {
        return this.events;
    }

    // Get event by ID
    getEventById(id) {
        return this.events.find(event => event.id === id);
    }

    // Join an event
    joinEvent(eventId) {
        if (!this.joinedEvents.includes(eventId)) {
            const event = this.getEventById(eventId);
            if (event && event.participants < event.capacity) {
                event.participants++;
                this.joinedEvents.push(eventId);
                this.saveEvents();
                this.saveJoinedEvents();
                return true;
            }
        }
        return false;
    }

    // Leave an event
    leaveEvent(eventId) {
        const index = this.joinedEvents.indexOf(eventId);
        if (index > -1) {
            const event = this.getEventById(eventId);
            if (event) {
                event.participants = Math.max(0, event.participants - 1);
            }
            this.joinedEvents.splice(index, 1);
            this.saveEvents();
            this.saveJoinedEvents();
            return true;
        }
        return false;
    }

    // Get user's joined events
    getJoinedEvents() {
        return this.events.filter(event => this.joinedEvents.includes(event.id));
    }

    // Check if user has joined an event
    hasJoined(eventId) {
        return this.joinedEvents.includes(eventId);
    }

    // Search events by title
    searchEvents(query) {
        return this.events.filter(event =>
            event.title.toLowerCase().includes(query.toLowerCase()) ||
            event.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    // Filter events by category
    filterByCategory(category) {
        if (!category) return this.events;
        return this.events.filter(event => event.category === category);
    }

    // Calculate distance between two coordinates (Haversine formula)
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Get events near user location
    getNearbyEvents(maxDistance = 10) {
        if (!this.userLocation) return this.events;
        
        return this.events
            .map(event => ({
                ...event,
                distance: this.calculateDistance(
                    this.userLocation.latitude,
                    this.userLocation.longitude,
                    event.latitude,
                    event.longitude
                )
            }))
            .filter(event => event.distance <= maxDistance)
            .sort((a, b) => a.distance - b.distance);
    }

    // Set user location
    setUserLocation(latitude, longitude) {
        this.userLocation = { latitude, longitude };
    }
}

// ========== UI Controller ==========
class UIController {
    constructor() {
        this.eventManager = new EventManager();
        this.nearbyMode = false; // when true, only show events near user
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderEvents();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab, btn));
        });

        // Create event form
        document.getElementById('createEventForm').addEventListener('submit', (e) => this.handleCreateEvent(e));

        // Location buttons
        // "Find i nærheden" – brug position til at filtrere events
        document.getElementById('getLocationBtn').addEventListener('click', () => this.getUserLocation(true));
        // "Brug min placering" i formularen – kun til at udfylde felter
        document.getElementById('getCoordinates').addEventListener('click', () => this.getUserLocation(false));

        // Search and filter
        document.getElementById('searchInput').addEventListener('input', () => this.renderEvents());
        document.getElementById('categoryFilter').addEventListener('change', () => this.renderEvents());

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('eventModal');
            if (e.target === modal) this.closeModal();
        });
    }

    switchTab(tabName, button) {
        // Hide all tabs
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        document.getElementById(tabName).classList.add('active');
        if (button) {
            button.classList.add('active');
        }

        // Render appropriate content
        if (tabName === 'events') {
            this.renderEvents();
        } else if (tabName === 'joined') {
            this.renderJoinedEvents();
        }
    }

    handleCreateEvent(e) {
        e.preventDefault();

        const eventData = {
            title: document.getElementById('eventTitle').value,
            category: document.getElementById('eventCategory').value,
            date: document.getElementById('eventDate').value,
            time: document.getElementById('eventTime').value,
            location: document.getElementById('eventLocation').value,
            latitude: parseFloat(document.getElementById('eventLatitude').value),
            longitude: parseFloat(document.getElementById('eventLongitude').value),
            description: document.getElementById('eventDescription').value,
            capacity: parseInt(document.getElementById('eventCapacity').value)
        };

        if (!eventData.latitude || !eventData.longitude) {
            alert('Angiv koordinater eller brug knappen til placering');
            return;
        }

        this.eventManager.createEvent(eventData);
        this.renderEvents();
        
        // Show success message
        this.showSuccessMessage('Event oprettet!');

        // Reset form
        document.getElementById('createEventForm').reset();

        // Switch to events tab
        setTimeout(() => {
            document.querySelector('[data-tab="events"]').click();
        }, 500);
    }

    renderEvents() {
        const searchQuery = document.getElementById('searchInput').value;
        const category = document.getElementById('categoryFilter').value;
        
        let events = this.nearbyMode && this.eventManager.userLocation
            ? this.eventManager.getNearbyEvents()
            : this.eventManager.getAllEvents();

        if (searchQuery) {
            events = this.eventManager.searchEvents(searchQuery);
        }

        if (category) {
            events = events.filter(e => e.category === category);
        }

        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';

        if (events.length === 0) {
            eventsList.innerHTML = '<div class="loading-placeholder">Ingen events fundet</div>';
            return;
        }

        events.forEach(event => {
            const isJoined = this.eventManager.hasJoined(event.id);
            const distance = this.eventManager.userLocation ? 
                this.eventManager.calculateDistance(
                    this.eventManager.userLocation.latitude,
                    this.eventManager.userLocation.longitude,
                    event.latitude,
                    event.longitude
                ).toFixed(1) : null;

            const card = document.createElement('div');
            card.className = `event-card ${isJoined ? 'joined' : ''}`;
            card.innerHTML = `
                <div class="event-card-content">
                    <span class="event-category">${this.formatCategory(event.category)}</span>
                    <h3>${event.title}</h3>
                    <p>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                    <div class="event-meta">
                        <div class="event-meta-item">📅 ${this.formatDate(event.date)} kl. ${event.time}</div>
                        <div class="event-meta-item">📍 ${event.location}</div>
                        ${distance ? `<div class="event-distance">${distance} km væk</div>` : ''}
                    </div>
                </div>
                <div class="event-footer">
                    <div class="event-participants">${event.participants}/${event.capacity} tilmeldt</div>
                    ${isJoined ? '<span class="joined-badge">✓ Tilmeldt</span>' : ''}
                </div>
            `;

            card.addEventListener('click', () => this.showEventDetail(event));
            eventsList.appendChild(card);
        });
    }

    renderJoinedEvents() {
        const joinedEvents = this.eventManager.getJoinedEvents();
        const eventsList = document.getElementById('joinedEventsList');
        eventsList.innerHTML = '';

        if (joinedEvents.length === 0) {
            eventsList.innerHTML = '<div class="empty-state">Du har ikke tilmeldt dig nogen events endnu. <br>Se events under fanen "Events"!</div>';
            return;
        }

        joinedEvents.forEach(event => {
            const distance = this.eventManager.userLocation ?
                this.eventManager.calculateDistance(
                    this.eventManager.userLocation.latitude,
                    this.eventManager.userLocation.longitude,
                    event.latitude,
                    event.longitude
                ).toFixed(1) : null;

            const card = document.createElement('div');
            card.className = 'event-card joined';
            card.innerHTML = `
                <div class="event-card-content">
                    <span class="event-category">${this.formatCategory(event.category)}</span>
                    <h3>${event.title}</h3>
                    <p>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                    <div class="event-meta">
                        <div class="event-meta-item">📅 ${this.formatDate(event.date)} kl. ${event.time}</div>
                        <div class="event-meta-item">📍 ${event.location}</div>
                        ${distance ? `<div class="event-distance">${distance} km væk</div>` : ''}
                    </div>
                </div>
                <div class="event-footer">
                    <div class="event-participants">${event.participants}/${event.capacity} tilmeldt</div>
                    <span class="joined-badge">✓ Tilmeldt</span>
                </div>
            `;

            card.addEventListener('click', () => this.showEventDetail(event));
            eventsList.appendChild(card);
        });
    }

    showEventDetail(event) {
        const isJoined = this.eventManager.hasJoined(event.id);
        const distance = this.eventManager.userLocation ?
            this.eventManager.calculateDistance(
                this.eventManager.userLocation.latitude,
                this.eventManager.userLocation.longitude,
                event.latitude,
                event.longitude
            ).toFixed(1) : null;

        let modalHTML = `
            <div class="modal-header">
                <h2>${event.title}</h2>
                <span class="modal-category">${this.formatCategory(event.category)}</span>
            </div>
            <p>${event.description}</p>
            <div class="modal-meta">
                <div class="modal-meta-item">📅 <strong>Dato:</strong> ${this.formatDate(event.date)}</div>
                <div class="modal-meta-item">🕐 <strong>Tidspunkt:</strong> ${event.time}</div>
                <div class="modal-meta-item">📍 <strong>Sted:</strong> ${event.location}</div>
                ${distance ? `<div class="modal-meta-item">🗺️ <strong>Afstand:</strong> ${distance} km væk</div>` : ''}
                <div class="modal-meta-item">👥 <strong>Deltagere:</strong> ${event.participants}/${event.capacity}</div>
                <div class="modal-meta-item">👤 <strong>Oprettet af:</strong> ${event.creator}</div>
                ${event.latitude && event.longitude ? `<div class="modal-meta-item"><a href="https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}" target="_blank" rel="noopener noreferrer">Åbn i Google Maps</a></div>` : ''}
            </div>
            <div class="modal-actions">
                <button class="btn-primary" id="joinLeaveBtn">${isJoined ? 'Forlad event' : 'Tilmeld event'}</button>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = modalHTML;
        
        const btnJoinLeave = document.getElementById('joinLeaveBtn');
        btnJoinLeave.addEventListener('click', () => {
            if (isJoined) {
                this.eventManager.leaveEvent(event.id);
                this.showSuccessMessage('Du har forladt eventet');
            } else {
                if (event.participants >= event.capacity) {
                    alert('Eventet er fyldt!');
                    return;
                }
                this.eventManager.joinEvent(event.id);
                this.showSuccessMessage('Du er tilmeldt!');
            }
            this.closeModal();
            this.renderEvents();
        });

        document.getElementById('eventModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('eventModal').classList.remove('show');
    }

    getUserLocation(useNearbyFilter = false) {
        // Hvis nearbyMode allerede er aktiv, så slå det fra (vis alle events)
        if (useNearbyFilter && this.nearbyMode) {
            this.nearbyMode = false;
            this.updateNearbyButton();
            this.showSuccessMessage('Viser alle events');
            this.renderEvents();
            return;
        }

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.eventManager.setUserLocation(latitude, longitude);

                    if (useNearbyFilter) {
                        // Bruges fra "Find i nærheden"-knappen
                        this.nearbyMode = true;
                        this.updateNearbyButton();
                        this.showSuccessMessage('Viser events i nærheden af dig (ca. 10 km)');
                    } else {
                        // Bruges fra formularen til at udfylde felter
                        this.nearbyMode = false;
                        const latInput = document.getElementById('eventLatitude');
                        const lonInput = document.getElementById('eventLongitude');
                        if (latInput && lonInput) {
                            latInput.value = latitude.toFixed(4);
                            lonInput.value = longitude.toFixed(4);
                        }
                        this.showSuccessMessage('Placering opdateret i formularen!');
                    }

                    this.renderEvents();
                },
                (error) => {
                    alert('Kunne ikke hente din placering. Slå placeringstjenester til i browseren.');
                }
            );
        } else {
            alert('Placering understøttes ikke af din browser.');
        }
    }

    updateNearbyButton() {
        const btn = document.getElementById('getLocationBtn');
        if (btn) {
            if (this.nearbyMode) {
                btn.textContent = '❌ Vis alle events';
                btn.classList.add('btn-secondary');
                btn.classList.remove('btn-primary');
            } else {
                btn.textContent = '📍 Find i nærheden';
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            }
        }
    }

    showSuccessMessage(message) {
        // Create temporary success message
        const msg = document.createElement('div');
        msg.className = 'success-message';
        msg.textContent = message;
        
        const container = document.querySelector('.container');
        container.insertBefore(msg, container.firstChild);

        setTimeout(() => {
            msg.remove();
        }, 3000);
    }

    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('da-DK', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    formatCategory(category) {
        const categories = {
            sports: '⚽ Sport',
            music: '🎵 Musik',
            food: '🍽️ Mad & drikke',
            outdoor: '🥾 Udendørs',
            social: '👥 Socialt',
            education: '📚 Uddannelse',
            art: '🎨 Kunst & kultur',
            other: '📌 Andet'
        };
        return categories[category] || category;
    }
}

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});
