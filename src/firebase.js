// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCqr87rhfWaItve3pZw5K5OEvf3XOMUn5A",
  authDomain: "bigshose-f8122.firebaseapp.com",
  databaseURL: "https://bigshose-f8122-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bigshose-f8122",
  storageBucket: "bigshose-f8122.appspot.com",
  messagingSenderId: "588910598000",
  appId: "1:588910598000:web:4fc6abf6e1f171c1f761b5",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { app, messaging };



