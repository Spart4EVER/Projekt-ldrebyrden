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
                title: 'Community Basketball Game',
                category: 'sports',
                date: '2026-01-25',
                time: '18:00',
                location: 'Central Park Court',
                latitude: 55.676,
                longitude: 12.569,
                description: 'Weekly basketball game for all skill levels. Bring your friends!',
                capacity: 20,
                participants: 12,
                creator: 'Alex S.'
            },
            {
                id: 2,
                title: 'Local Music Jam Session',
                category: 'music',
                date: '2026-01-24',
                time: '19:30',
                location: 'Coffee Corner Café',
                latitude: 55.680,
                longitude: 12.575,
                description: 'Open jam session. Bring your instruments or just come to listen!',
                capacity: 30,
                participants: 8,
                creator: 'Jamie K.'
            },
            {
                id: 3,
                title: 'Pizza Night Social',
                category: 'food',
                date: '2026-01-26',
                time: '20:00',
                location: 'Downtown Pizza Place',
                latitude: 55.682,
                longitude: 12.577,
                description: 'Casual dinner gathering. Get to know new people in the area!',
                capacity: 40,
                participants: 15,
                creator: 'Maria L.'
            },
            {
                id: 4,
                title: 'Morning Hiking Adventure',
                category: 'outdoor',
                date: '2026-01-25',
                time: '08:00',
                location: 'Forest Trail North',
                latitude: 55.700,
                longitude: 12.560,
                description: 'Easy to moderate hiking trail. Meet at the parking lot. Bring water!',
                capacity: 25,
                participants: 10,
                creator: 'Chris T.'
            },
            {
                id: 5,
                title: 'Beginner Yoga Class',
                category: 'social',
                date: '2026-01-24',
                time: '17:00',
                location: 'Community Center',
                latitude: 55.675,
                longitude: 12.570,
                description: 'Relaxing yoga session perfect for beginners. Mats provided.',
                capacity: 20,
                participants: 14,
                creator: 'Sarah M.'
            },
            {
                id: 6,
                title: 'Art Workshop: Watercolor Basics',
                category: 'art',
                date: '2026-01-27',
                time: '14:00',
                location: 'Creative Studio Hub',
                latitude: 55.678,
                longitude: 12.572,
                description: 'Learn watercolor painting basics. All materials included.',
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
            creator: 'You'
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

        // Location button
        document.getElementById('getLocationBtn').addEventListener('click', () => this.getUserLocation());
        document.getElementById('getCoordinates').addEventListener('click', () => this.getUserLocation());

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
            alert('Please provide coordinates or use the location button');
            return;
        }

        this.eventManager.createEvent(eventData);
        this.renderEvents();
        
        // Show success message
        this.showSuccessMessage('Event created successfully!');

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
        
        let events = this.eventManager.getAllEvents();

        if (searchQuery) {
            events = this.eventManager.searchEvents(searchQuery);
        }

        if (category) {
            events = events.filter(e => e.category === category);
        }

        const eventsList = document.getElementById('eventsList');
        eventsList.innerHTML = '';

        if (events.length === 0) {
            eventsList.innerHTML = '<div class="loading-placeholder">No events found</div>';
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
                        <div class="event-meta-item">📅 ${this.formatDate(event.date)} at ${event.time}</div>
                        <div class="event-meta-item">📍 ${event.location}</div>
                        ${distance ? `<div class="event-distance">${distance} km away</div>` : ''}
                    </div>
                </div>
                <div class="event-footer">
                    <div class="event-participants">${event.participants}/${event.capacity} joined</div>
                    ${isJoined ? '<span class="joined-badge">✓ Joined</span>' : ''}
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
            eventsList.innerHTML = '<div class="empty-state">You haven\'t joined any events yet. <br>Check out events in the "Events" tab!</div>';
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
                        <div class="event-meta-item">📅 ${this.formatDate(event.date)} at ${event.time}</div>
                        <div class="event-meta-item">📍 ${event.location}</div>
                        ${distance ? `<div class="event-distance">${distance} km away</div>` : ''}
                    </div>
                </div>
                <div class="event-footer">
                    <div class="event-participants">${event.participants}/${event.capacity} joined</div>
                    <span class="joined-badge">✓ Joined</span>
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
                <div class="modal-meta-item">📅 <strong>Date:</strong> ${this.formatDate(event.date)}</div>
                <div class="modal-meta-item">🕐 <strong>Time:</strong> ${event.time}</div>
                <div class="modal-meta-item">📍 <strong>Location:</strong> ${event.location}</div>
                ${distance ? `<div class="modal-meta-item">🗺️ <strong>Distance:</strong> ${distance} km away</div>` : ''}
                <div class="modal-meta-item">👥 <strong>Participants:</strong> ${event.participants}/${event.capacity}</div>
                <div class="modal-meta-item">👤 <strong>Created by:</strong> ${event.creator}</div>
            </div>
            <div class="modal-actions">
                <button class="btn-primary" id="joinLeaveBtn">${isJoined ? 'Leave Event' : 'Join Event'}</button>
            </div>
        `;

        document.getElementById('modalBody').innerHTML = modalHTML;
        
        const btnJoinLeave = document.getElementById('joinLeaveBtn');
        btnJoinLeave.addEventListener('click', () => {
            if (isJoined) {
                this.eventManager.leaveEvent(event.id);
                this.showSuccessMessage('Left the event');
            } else {
                if (event.participants >= event.capacity) {
                    alert('Event is full!');
                    return;
                }
                this.eventManager.joinEvent(event.id);
                this.showSuccessMessage('Joined the event!');
            }
            this.closeModal();
            this.renderEvents();
        });

        document.getElementById('eventModal').classList.add('show');
    }

    closeModal() {
        document.getElementById('eventModal').classList.remove('show');
    }

    getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    this.eventManager.setUserLocation(latitude, longitude);

                    // If in create form, populate coordinates
                    const latInput = document.getElementById('eventLatitude');
                    const lonInput = document.getElementById('eventLongitude');
                    if (latInput && lonInput) {
                        latInput.value = latitude.toFixed(4);
                        lonInput.value = longitude.toFixed(4);
                    }

                    this.showSuccessMessage('Location updated!');
                    this.renderEvents();
                },
                (error) => {
                    alert('Could not get your location. Please enable location services.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
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
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    }

    formatCategory(category) {
        const categories = {
            sports: '⚽ Sports',
            music: '🎵 Music',
            food: '🍽️ Food & Dining',
            outdoor: '🥾 Outdoor',
            social: '👥 Social',
            education: '📚 Education',
            art: '🎨 Art & Culture',
            other: '📌 Other'
        };
        return categories[category] || category;
    }
}

// ========== Initialize App ==========
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});
