'use client';

import { useEffect, useState } from 'react';
import { setupNotificationListener } from '@/lib/firebase';

export default function NotificationListener() {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Setup listener for incoming notifications
    const unsubscribe = setupNotificationListener((payload) => {
      console.log('Notification received:', payload);
      
      // Show notification
      if (payload.notification) {
        setNotification({
          title: payload.notification.title,
          body: payload.notification.body,
          icon: payload.notification.icon,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => setNotification(null), 5000);
      }

      // Browser notification (if permitted)
      if (Notification.permission === 'granted' && payload.notification) {
        new Notification(payload.notification.title, {
          body: payload.notification.body,
          icon: payload.notification.icon,
        });
      }
    });

    return () => unsubscribe?.();
  }, []);

  if (!notification) return null;

  return (
    <div className="fixed top-4 right-4 bg-gradient-to-r from-pink-500 to-blue-500 text-white p-4 rounded-lg shadow-lg max-w-sm animate-slide-in-right">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{notification.title}</h3>
          <p className="text-sm mt-1">{notification.body}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-white hover:text-gray-200 ml-4"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
