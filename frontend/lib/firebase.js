import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getMessaging, onMessage } from 'firebase/messaging';

// Firebase Config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
export const storage = getStorage(app);

// Initialize Firebase Messaging (for notifications)
let messaging;
if (typeof window !== 'undefined') {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn('Firebase Messaging not available:', error);
  }
}

export { messaging };

// Function to handle incoming notifications
export const setupNotificationListener = (callback) => {
  if (messaging) {
    onMessage(messaging, (payload) => {
      console.log('Message received:', payload);
      callback(payload);
    });
  }
};

// Function to upload file to Firebase Storage
export const uploadFileToFirebase = async (file, path) => {
  try {
    const { ref, uploadBytes, getDownloadURL } = await import('firebase/storage');
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Function to delete file from Firebase Storage
export const deleteFileFromFirebase = async (path) => {
  try {
    const { ref, deleteObject } = await import('firebase/storage');
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    console.log('File deleted successfully');
  } catch (error) {
    console.error('Delete error:', error);
    throw error;
  }
};

export default app;
