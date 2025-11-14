# Serving the GPS Tracker Statically

This application can be served as static files - no Node.js server required!

## Quick Start Options

### Option 1: Simple HTTP Server (Recommended)

**Python:**
```bash
cd public
python3 -m http.server 8000
```
Then open: `http://localhost:8000`

**PHP:**
```bash
cd public
php -S localhost:8000
```

**Node.js (one-liner):**
```bash
cd public
npx http-server -p 8000
```

### Option 2: Open Directly (Limited)

You can try opening `public/index.html` directly in your browser, but:
- ⚠️ Web Workers may not work with `file://` protocol
- ⚠️ Some browsers restrict Geolocation API on `file://`
- ✅ Works best with a local HTTP server

### Option 3: Deploy to Static Hosting

**GitHub Pages:**
1. Push `public/` folder to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Access via `https://yourusername.github.io/repo-name`

**Netlify/Vercel:**
1. Drag and drop the `public/` folder
2. Or connect your Git repository
3. Deploy automatically

## Why Use a Server?

Even though it's static, a local HTTP server is recommended because:
- ✅ Web Workers work reliably
- ✅ Geolocation API works without restrictions
- ✅ No CORS issues
- ✅ Better for mobile device access (use your computer's IP address)

## Mobile Access

When running a local server, access from your phone:
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
2. On your phone, open: `http://YOUR_IP:8000`
   - Example: `http://192.168.1.100:8000`

## File Structure for Static Serving

```
Tracker/
└── public/          ← Serve this folder
    ├── index.html
    ├── app.js
    ├── styles.css
    └── tracking-worker.js
```

You can copy just the `public/` folder anywhere and serve it!

