// PWA utility functions

export function isInstallable(): Promise<boolean> {
  return new Promise((resolve) => {
    let deferredPrompt: any;
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      resolve(true);
    });

    // Timeout after 3 seconds if no prompt event
    setTimeout(() => {
      if (!deferredPrompt) {
        resolve(false);
      }
    }, 3000);
  });
}

export async function installApp(): Promise<boolean> {
  return new Promise((resolve) => {
    let deferredPrompt: any;
    
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          resolve(true);
        } else {
          resolve(false);
        }
        deferredPrompt = null;
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      });
    } else {
      resolve(false);
    }
  });
}

export function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}

export function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return Promise.resolve('denied');
  }
  
  return Notification.requestPermission();
}

export function sendNotification(title: string, options?: NotificationOptions): Notification | null {
  if ('Notification' in window && Notification.permission === 'granted') {
    return new Notification(title, {
      icon: '/manifest-icon-192.png',
      badge: '/manifest-icon-192.png',
      ...options
    });
  }
  return null;
}
