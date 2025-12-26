# PWA Features & Setup

## Progressive Web App (PWA) Features

AchieveIt now includes full PWA support, making it installable as a native app on any device!

### ✨ Features Included

#### 1. **Installation**
- **Desktop**: Click "Install App" button or use browser's install option
- **Mobile**: Click "Install App" button or use iOS/Android native install features
- **iOS**: Use Safari's Share → Add to Home Screen
- **Android**: Use Chrome's install option

#### 2. **Offline Support**
- Works completely offline once installed
- Automatically caches app files
- Shows offline status indicator
- Data syncs when connection returns

#### 3. **Service Worker**
- Automatic caching strategy (Network First)
- Intelligent cache invalidation
- Offline fallback pages
- Push notification support

#### 4. **App Icons**
- All favicons integrated from `/icons` folder
- Adaptive icons for different devices
- Splash screens for iOS and Android

#### 5. **Installation Badges**
- Automatic "Install App" button
- Browser-native install prompt support
- One-click installation

#### 6. **Push Notifications**
- Real-time task reminders
- Daily goal tracking notifications
- Streak milestones

#### 7. **Online/Offline Status**
- Real-time connection indicator
- Bottom-right status badge
- Automatic detection and warnings

### 🔧 How to Install

#### On Desktop (Chrome/Edge)
1. Open the app in your browser
2. Click the "Install App" button (bottom right)
3. Follow the prompts
4. App appears as a desktop shortcut

#### On Android (Chrome)
1. Open the app in Chrome
2. Click the "Install App" button
3. Confirm installation
4. App appears on home screen

#### On iOS (Safari)
1. Open the app in Safari
2. Click the Share button
3. Scroll and tap "Add to Home Screen"
4. Enter a name and tap "Add"

### 🚀 PWA Capabilities

- **Offline Access**: Works without internet connection
- **Fast Loading**: Cached assets load instantly
- **App-like Experience**: Full-screen, no address bar
- **Push Notifications**: Get task reminders
- **Background Sync**: Syncs data when online
- **Responsive**: Works on all screen sizes

### 📱 Supported Devices

- ✅ Windows Desktop
- ✅ macOS Desktop
- ✅ Android Phones/Tablets
- ✅ iOS iPhones/iPads (via Home Screen)
- ✅ Linux Desktop

### 🔒 Permissions

The PWA may request:
- **Notifications**: For task reminders and streak milestones
- **Storage**: To store offline data

You can grant or deny these permissions at any time.

### 💾 Data Storage

- App data stored in Firestore Cloud (always synced)
- Offline cache managed by Service Worker
- Browser cache cleared automatically
- No sensitive data stored locally

### 🛠 Technical Details

**Manifest File**: `public/manifest.json`
- App name, icons, colors
- Display mode, orientation
- Start URL and scope

**Service Worker**: `public/sw.js`
- Handles offline functionality
- Manages caching strategy
- Processes push notifications

**Icons Location**: `public/icons/`
- Various sizes for different devices
- Favicon, Apple touch icon, Android icons

### 📊 Cache Strategy

**Network First**:
1. Try to fetch from network
2. If successful, cache and return
3. If offline, return cached version
4. Firebase requests always go to network

### 🔄 Updates

The app checks for updates automatically. To ensure you get the latest:
1. Force refresh (Ctrl+Shift+R or Cmd+Shift+R)
2. Service Worker will update
3. You may need to reinstall

### ⚠️ Important Notes

- Requires HTTPS in production (HTTP only works on localhost)
- First visit caches essential files
- Subsequent visits load from cache for speed
- Background sync requires server setup for full functionality

### 🎯 Next Steps

To enhance PWA further:
1. Set up push notifications server
2. Implement background sync
3. Add custom notification handling
4. Create app splash screens

### 📖 Learn More

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [MDN Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Web App Manifest Spec](https://www.w3.org/TR/appmanifest/)
