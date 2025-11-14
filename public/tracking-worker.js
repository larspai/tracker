// Web Worker for background GPS tracking
// This runs independently of the main thread

let watchId = null;
let lastPosition = null;
const INTERVAL_MS = 1000; // 1 second interval

// Start tracking
function startTracking() {
    if (!navigator.geolocation) {
        self.postMessage({ error: 'Geolocation not supported' });
        return;
    }
    
    const options = {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 5000
    };
    
    // Use watchPosition for continuous updates
    watchId = navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const timestamp = Date.now();
            
            // Only send if position changed significantly or enough time passed
            if (!lastPosition || 
                distanceBetween(lastPosition.lat, lastPosition.lng, latitude, longitude) > 5 || // 5 meters
                timestamp - lastPosition.timestamp >= INTERVAL_MS) {
                
                lastPosition = {
                    lat: latitude,
                    lng: longitude,
                    timestamp: timestamp
                };
                
                self.postMessage({
                    lat: latitude,
                    lng: longitude,
                    timestamp: timestamp
                });
            }
        },
        (error) => {
            self.postMessage({ error: error.message });
        },
        options
    );
}

// Stop tracking
function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
}

// Calculate distance between two coordinates in meters (Haversine formula)
function distanceBetween(lat1, lng1, lat2, lng2) {
    const R = 6371000; // Earth radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Handle messages from main thread
self.onmessage = function(e) {
    const { command } = e.data;
    
    if (command === 'start') {
        startTracking();
    } else if (command === 'stop') {
        stopTracking();
    }
};

