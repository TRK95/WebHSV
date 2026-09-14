// import { configDev } from './config'
// import firebase from "firebase";
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.13.1/firebase-messaging.js');

const config = {
  apiKey: "AIzaSyC4zsqO93M4kL8ks_hMjeBty-MoQBJ4_38",
  authDomain: "test-event-game.firebaseapp.com",
  databaseURL: "https://test-event-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-event-game",
  storageBucket: "test-event-game.appspot.com",
  messagingSenderId: "722720962982",
  appId: "1:722720962982:web:5d68bc3efa9bb7ed1c3767",
  measurementId: "G-7WH2PE10SP"
};

if (!firebase.apps.length) {
  console.log('FireBase Dev service worker');
  firebase.initializeApp(config);
}
const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function (payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: 'https://storage.googleapis.com/comaiphuong-edu-media/images/296811730-1608028836898-logo2.png'
  };

  return self.registration.showNotification(notificationTitle,
    notificationOptions);
});

self.addEventListener('notificationclick', event => {
  console.log(event)
  return event;
});
