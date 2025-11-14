// Initialize map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
}).addTo(map);

// State variables
let isRecording = false;
let trackingWorker = null;
let currentPosition = null;
let currentMarker = null;
let trailCoordinates = [];
let trailPolyline = null;

// DOM elements
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');

// Initialize geolocation
if (!navigator.geolocation) {
    alert('Geolocation is not supported by your browser');
} else {
    // Get initial position
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            currentPosition = { lat: latitude, lng: longitude };
            map.setView([latitude, longitude], 15);
            updateCurrentPositionMarker(latitude, longitude);
        },
        (error) => {
            console.error('Error getting initial position:', error);
            status.textContent = 'Error: ' + error.message;
        }
    );

    // Watch position for updates (for current position marker)
    // Note: Trail points are handled by the Web Worker when recording
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            currentPosition = { lat: latitude, lng: longitude };
            updateCurrentPositionMarker(latitude, longitude);
            
            // Only add trail points if not using worker (fallback)
            if (isRecording && !trackingWorker) {
                addTrailPoint(latitude, longitude);
            }
        },
        (error) => {
            console.error('Error watching position:', error);
            status.textContent = 'Error: ' + error.message;
        },
        {
            enableHighAccuracy: true,
            maximumAge: 1000,
            timeout: 5000
        }
    );
}

// Update current position marker
function updateCurrentPositionMarker(lat, lng) {
    if (currentMarker) {
        currentMarker.setLatLng([lat, lng]);
    } else {
        currentMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'current-position-marker',
                html: '<div style="background-color: #2196F3; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(map);
    }
}

// Add point to trail
function addTrailPoint(lat, lng) {
    trailCoordinates.push([lat, lng]);
    
    // Update or create polyline
    if (trailPolyline) {
        trailPolyline.setLatLngs(trailCoordinates);
    } else {
        trailPolyline = L.polyline(trailCoordinates, {
            color: '#f44336',
            weight: 4,
            opacity: 0.8
        }).addTo(map);
    }
    
    // Adjust map bounds to show entire trail
    adjustMapBounds();
}

// Adjust map bounds to show entire trail with constraints
function adjustMapBounds() {
    if (trailCoordinates.length === 0) return;
    
    // Calculate bounds of all points
    const bounds = trailPolyline.getBounds();
    const northEast = bounds.getNorthEast();
    const southWest = bounds.getSouthWest();
    
    // Calculate distance in km
    const latDiff = northEast.lat - southWest.lat;
    const lngDiff = northEast.lng - southWest.lng;
    
    // Approximate km per degree (rough estimate)
    const latKm = latDiff * 111; // 1 degree latitude ≈ 111 km
    const lngKm = Math.abs(lngDiff * 111 * Math.cos((northEast.lat + southWest.lat) / 2 * Math.PI / 180));
    
    const widthKm = Math.max(latKm, lngKm);
    
    // Calculate zoom level based on desired bounds
    let targetZoom;
    
    if (widthKm < 2) {
        // Too small - zoom out to show at least 2x2 km
        targetZoom = calculateZoomForDistance(2);
    } else if (widthKm > 100) {
        // Too large - zoom in to show at most 100x100 km
        targetZoom = calculateZoomForDistance(100);
    } else {
        // Fit bounds with padding
        map.fitBounds(bounds, { padding: [50, 50] });
        return;
    }
    
    // Set zoom and center
    const center = bounds.getCenter();
    map.setView(center, targetZoom);
}

// Calculate zoom level for a given distance in km
function calculateZoomForDistance(km) {
    // Rough approximation: zoom levels correspond to different scales
    // This is a simplified calculation
    const equatorLength = 40075; // km
    const zoomLevels = {
        0.5: 15,
        1: 14,
        2: 13,
        5: 12,
        10: 11,
        20: 10,
        50: 9,
        100: 8,
        200: 7
    };
    
    // Find closest zoom level
    let closestZoom = 13;
    let minDiff = Infinity;
    
    for (const [dist, zoom] of Object.entries(zoomLevels)) {
        const diff = Math.abs(dist - km);
        if (diff < minDiff) {
            minDiff = diff;
            closestZoom = zoom;
        }
    }
    
    return closestZoom;
}

// Start recording
function startRecording() {
    if (isRecording) return;
    
    isRecording = true;
    trailCoordinates = [];
    
    // Remove existing trail if any
    if (trailPolyline) {
        map.removeLayer(trailPolyline);
        trailPolyline = null;
    }
    
    // Start web worker for background tracking
    if (typeof Worker !== 'undefined') {
        try {
            trackingWorker = new Worker('tracking-worker.js');
            
            trackingWorker.onmessage = function(e) {
                const data = e.data;
                if (data.error) {
                    console.error('Worker error:', data.error);
                    // Fallback to main thread tracking
                } else if (data.lat && data.lng) {
                    addTrailPoint(data.lat, data.lng);
                }
            };
            
            trackingWorker.onerror = function(error) {
                console.error('Worker error:', error);
                // Fallback: continue tracking in main thread
            };
            
            // Send start command to worker
            trackingWorker.postMessage({ command: 'start' });
        } catch (error) {
            console.error('Failed to create worker:', error);
            // Fallback: continue tracking in main thread
        }
    }
    
    // Update UI
    startBtn.disabled = true;
    stopBtn.disabled = false;
    status.textContent = 'Recording...';
    status.className = 'status recording';
    
    // Add current position as first point
    if (currentPosition) {
        addTrailPoint(currentPosition.lat, currentPosition.lng);
    }
}

// Stop recording
function stopRecording() {
    if (!isRecording) return;
    
    isRecording = false;
    
    // Stop and terminate worker
    if (trackingWorker) {
        trackingWorker.postMessage({ command: 'stop' });
        trackingWorker.terminate();
        trackingWorker = null;
    }
    
    // Update UI
    startBtn.disabled = false;
    stopBtn.disabled = true;
    status.textContent = `Recording stopped. ${trailCoordinates.length} points recorded.`;
    status.className = 'status ready';
    
    // Ensure trail is visible
    if (trailPolyline && trailCoordinates.length > 0) {
        adjustMapBounds();
    }
}

// Event listeners
startBtn.addEventListener('click', startRecording);
stopBtn.addEventListener('click', stopRecording);

// Handle page visibility changes (for background tracking)
document.addEventListener('visibilitychange', function() {
    if (isRecording && trackingWorker) {
        // Worker continues running even when page is in background
        console.log('Page visibility changed, worker continues');
    }
});

// Prevent accidental page close during recording
window.addEventListener('beforeunload', function(e) {
    if (isRecording) {
        e.preventDefault();
        e.returnValue = 'Recording is in progress. Are you sure you want to leave?';
        return e.returnValue;
    }
});

