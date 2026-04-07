# Background Tracking Behavior

## Current Implementation

The tracker uses `navigator.geolocation.watchPosition()` in the main browser thread. Here's when it works and when it doesn't:

## ✅ When Tracking WILL Continue

### 1. **Browser Tab in Background (Another Tab Open)**
- ✅ **Works**: Tracking continues when you switch to another browser tab
- ⚠️ **But**: Updates may be throttled (less frequent) to save battery
- ⚠️ **But**: Some browsers may pause after a few minutes of inactivity
- **Best for**: Short periods (5-30 minutes)

### 2. **Browser Minimized (App Still Open)**
- ✅ **Works**: If browser app is minimized but still running
- ⚠️ **But**: Mobile OS may suspend the browser after a while
- **Best for**: Brief periods (1-10 minutes)

### 3. **Phone Screen Dims (But Not Locked)**
- ✅ **Works**: If screen dims but phone isn't locked
- ⚠️ **But**: Battery saving modes may throttle updates
- **Best for**: Short tracking sessions

## ❌ When Tracking WILL STOP

### 1. **Phone Screen Locked/Off**
- ❌ **Stops**: Most mobile browsers pause JavaScript when screen locks
- **iOS Safari**: Very restrictive - pauses almost immediately
- **Android Chrome**: May continue briefly but stops after a few minutes
- **Why**: Battery saving and security restrictions

### 2. **Browser App Closed**
- ❌ **Stops**: If you close the browser app completely
- **Why**: JavaScript execution stops when app closes

### 3. **Browser Tab Closed**
- ❌ **Stops**: If you close the tracker tab
- **Why**: Page unloads and JavaScript stops

### 4. **System Low Battery Mode**
- ❌ **May Stop**: Many phones pause background activity in low battery mode
- **Why**: Battery conservation

## Browser-Specific Behavior

### Android Chrome
- ✅ Background tab: Works for ~10-30 minutes, then throttled
- ⚠️ Screen locked: May work briefly, then stops
- ⚠️ Battery saver: Stops immediately

### iOS Safari
- ⚠️ Background tab: Works for ~1-5 minutes, then pauses
- ❌ Screen locked: Stops almost immediately
- ❌ Background: Very restrictive due to iOS policies

### Firefox Mobile
- ✅ Background tab: Works longer than Safari
- ⚠️ Screen locked: May work briefly
- Similar to Chrome behavior

## Practical Recommendations

### For Your Use Case (1+ Hour Tracking)

**Current Setup Limitations:**
- ❌ **Won't work reliably** when phone screen is off for extended periods
- ⚠️ **May work** if browser tab stays open and phone doesn't lock
- ⚠️ **Unreliable** for hour-long sessions with screen off

**Best Practices:**
1. **Keep browser tab open** - Don't close it
2. **Prevent screen lock** - Set phone to stay awake (if possible)
3. **Keep phone plugged in** - Prevents battery saver mode
4. **Use Android Chrome** - More lenient than iOS Safari
5. **Test first** - Try a short session to see how your phone behaves

## What Would Be Needed for True Background Tracking

### Option 1: Progressive Web App (PWA) with Background Sync
- Requires Service Worker
- Still limited by browser policies
- May work better but not guaranteed

### Option 2: Native Mobile App
- Full access to background location APIs
- Can request "Always" location permission
- Works when screen is off
- Requires app development (React Native, Flutter, etc.)

### Option 3: Hybrid Approach
- Use Web App for short sessions
- Use native app for extended tracking
- Best of both worlds

## Testing Your Setup

To see how your phone behaves:

1. **Start recording**
2. **Lock your phone** - Wait 1 minute, unlock, check point count
3. **Switch to another tab** - Wait 1 minute, switch back, check point count
4. **Minimize browser** - Wait 1 minute, open browser, check point count

This will tell you what works on your specific device/browser combination.

## Current Status Indicator

The app shows:
- `Recording... (X points)` - When tab is active
- `Recording in background... (X points)` - When tab is hidden

Check the point count when you return to see if tracking continued.

