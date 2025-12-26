// PWA Installation Helper
class PWAHelper {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    // Check if app is already installed
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      console.log('PWA is running as standalone app');
    }

    // Listen for install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('Install prompt available');
    });

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      this.isInstalled = true;
      this.deferredPrompt = null;
      console.log('PWA was installed');
    });
  }

  // Check if install prompt is available
  canInstall() {
    return this.deferredPrompt !== null && !this.isInstalled;
  }

  // Trigger install prompt
  async install() {
    if (!this.deferredPrompt) {
      return false;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    this.deferredPrompt = null;
    return outcome === 'accepted';
  }

  // Check if running on iOS
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  // Show iOS install instructions
  showIOSInstallPrompt() {
    const message = `To install AchieveIt on iOS:
1. Tap the Share button
2. Scroll and tap "Add to Home Screen"
3. Tap "Add"`;
    alert(message);
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }

  // Send notification
  sendNotification(title, options = {}) {
    if (Notification.permission === 'granted') {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SHOW_NOTIFICATION',
          title,
          options: {
            icon: '/icons/android-chrome-192x192.png',
            badge: '/icons/favicon-32x32.png',
            ...options,
          },
        });
      } else {
        new Notification(title, {
          icon: '/icons/android-chrome-192x192.png',
          ...options,
        });
      }
    }
  }

  // Check if online
  isOnline() {
    return navigator.onLine;
  }

  // Listen for online/offline changes
  onOnlineStatusChange(callback) {
    window.addEventListener('online', () => callback(true));
    window.addEventListener('offline', () => callback(false));
  }
}

export default new PWAHelper();
