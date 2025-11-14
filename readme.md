# GPS Tracker

A mobile-friendly GPS tracking application that records your route and displays it on an interactive map.

## Features

- 📍 Real-time position tracking on an interactive map
- 🎯 Start/Stop recording with 1-second interval GPS updates
- 🗺️ Route visualization with trail overlay
- 🔄 Background tracking using Web Workers (continues when phone screen is off)
- 📱 Mobile-optimized interface
- 🎚️ Smart map bounds (2x2 km minimum, 100x100 km maximum)

## Requirements

- **Option 1 (Node.js):** Node.js 14+ (if using npm server)
- **Option 2 (Static):** Any simple HTTP server (Python, PHP, or even `npx http-server`)
- Modern mobile browser with Geolocation API support
- GPS-enabled device

## Installation

### Option 1: Using Node.js Server (Current Setup)

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

3. Open in your mobile browser:
   - Navigate to `http://your-ip-address:3000`
   - Or use `http://localhost:3000` if testing on the same machine

### Option 2: Static File Serving (No Node.js Required!)

Since this is a pure client-side application, you can serve it statically:

**Python:**
```bash
cd public
python3 -m http.server 8000
```

**PHP:**
```bash
cd public
php -S localhost:8000
```

**Node.js one-liner:**
```bash
cd public
npx http-server -p 8000
```

Then open `http://localhost:8000` in your browser.

**Note:** A local HTTP server is recommended (even a simple one) because:
- Web Workers work more reliably
- Geolocation API has fewer restrictions
- Better for mobile device access

See `SERVING.md` for more details on static serving options.

## Usage

1. **Allow location permissions** when prompted by your browser
2. **Start Recording** - Begin tracking your position
3. **Move around** - Your current position is shown as a blue marker
4. **Stop Recording** - End tracking and view your complete route as a red trail
5. The map automatically adjusts to show your entire route within the specified bounds

## Technical Details

- Uses Leaflet.js for map rendering
- OpenStreetMap tiles (free, no API key required)
- Web Worker for background GPS tracking
- Geolocation API with high accuracy mode
- Responsive design optimized for mobile devices

## Notes

- **Background tracking**: The Web Worker continues running when the browser tab is in the background, but browser policies may limit this behavior
- **Battery usage**: Continuous GPS tracking consumes battery - use responsibly
- **Privacy**: All tracking data stays in your browser - nothing is sent to any server
- **Map bounds**: The map automatically zooms to show your entire trail, constrained between 2x2 km and 100x100 km

## Browser Compatibility

- Chrome/Edge (Android): ✅ Full support
- Safari (iOS): ✅ Full support (may have background limitations)
- Firefox Mobile: ✅ Full support
- Samsung Internet: ✅ Full support

## License

ISC
