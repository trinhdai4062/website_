// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging.js');

const firebaseConfig = {
  apiKey: "AIzaSyCqr87rhfWaItve3pZw5K5OEvf3XOMUn5A",
  authDomain: "bigshose-f8122.firebaseapp.com",
  databaseURL: "https://bigshose-f8122-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "bigshose-f8122",
  storageBucket: "bigshose-f8122.appspot.com",
  messagingSenderId: "588910598000",
  appId: "1:588910598000:web:4fc6abf6e1f171c1f761b5"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
