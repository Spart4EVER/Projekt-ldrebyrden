# Local Events App

A modern web application to discover, create, and join local events in your area.

## Features

- **Discover Events**: Browse events in your local area with search and category filtering
- **Create Events**: Create new events with location, time, category, and description
- **Join Events**: Join events you're interested in and track your attendance
- **Geolocation**: Find events near you using GPS coordinates
- **Event Details**: View full event information and participant counts
- **Local Storage**: Events are saved locally in your browser
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Getting Started

1. Open `app/index.html` in your web browser
2. Explore the "Events" tab to see available local events
3. Use "Find Near Me" to see nearby events (requires location permission)
4. Create a new event in the "Create Event" tab
5. Track your joined events in the "My Events" tab

## Usage

### Viewing Events
- Browse all events in the Events tab
- Search for events by title or description
- Filter by category (Sports, Music, Food, Outdoor, Social, Education, Art)
- See distance to events if you share your location

### Creating Events
1. Go to "Create Event" tab
2. Fill in event details (title, date, time, location)
3. Use "Get My Location" button to auto-fill coordinates
4. Add a description and maximum participant count
5. Click "Create Event" to publish

### Joining Events
1. Click on any event card to view details
2. Click "Join Event" to register
3. See your joined events in the "My Events" tab
4. Click to leave an event if needed

## Technical Details

### Architecture
- **EventManager Class**: Handles all event logic and data persistence
- **UIController Class**: Manages user interface and interactions
- **Local Storage**: Events persist in browser's localStorage

### Data Storage
- Events are stored in `events` key in localStorage
- Joined events are tracked in `joinedEvents` key
- Data persists between browser sessions

### Features
- Real-time search and filtering
- Distance calculation using Haversine formula
- Participant tracking with capacity limits
- Category-based organization
- Default sample events for demonstration

## Browser Compatibility

- Chrome/Edge: ✓ Full support
- Firefox: ✓ Full support
- Safari: ✓ Full support
- Mobile browsers: ✓ Full support

## Technologies Used

- HTML5
- CSS3 (with Flexbox and Grid)
- Vanilla JavaScript (ES6+)
- Browser APIs (localStorage, Geolocation)

## Future Enhancements

- Event filtering by distance radius
- User authentication and profiles
- Event comments and ratings
- Push notifications for upcoming events
- Event calendar view
- Export events to calendar
- Share events on social media
- Backend server for centralized event management
- Admin controls and event moderation

## Notes

- All events are stored locally in your browser
- Clearing browser data will reset the app
- Geolocation requires user permission
- Distance calculation uses straight-line distance (not actual travel distance)
