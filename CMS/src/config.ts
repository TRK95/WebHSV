import firebase from "firebase";

// const config = {
//     apiKey: "AIzaSyBw3V_ce9rVdvKpTbIm5Q80-vLdIviufps",
//     authDomain: "chat-app-b3980.firebaseapp.com",
//     databaseURL: "https://chat-app-b3980-default-rtdb.asia-southeast1.firebasedatabase.app",
//     projectId: "chat-app-b3980",
//     storageBucket: "chat-app-b3980.appspot.com",
//     messagingSenderId: "388060804602",
//     appId: "1:388060804602:web:4b88bd28d7943f710e6043",
//     measurementId: "G-SDSEBRS891"
// };

export const configProduct = {
  apiKey: "AIzaSyD4aInaz8GsUKabvtZqxqPUCq0ntHppwMk",
  authDomain: "comaiphuong-edu.firebaseapp.com",
  // databaseURL: "https://comaiphuong-edu.firebaseio.com",
  databaseURL: "https://comaiphuong-edu-2022.asia-southeast1.firebasedatabase.app",
  projectId: "comaiphuong-edu",
  storageBucket: "comaiphuong-edu.appspot.com",
  messagingSenderId: "29310437060",
  appId: "1:29310437060:web:ebb80d0ec3e99912c52b91",
  measurementId: "G-67S6D596QE"
};

export const configDev = {
  apiKey: "AIzaSyC4zsqO93M4kL8ks_hMjeBty-MoQBJ4_38",
  authDomain: "test-event-game.firebaseapp.com",
  databaseURL: "https://test-event-game-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "test-event-game",
  storageBucket: "test-event-game.appspot.com",
  messagingSenderId: "722720962982",
  appId: "1:722720962982:web:5d68bc3efa9bb7ed1c3767",
  measurementId: "G-7WH2PE10SP"
};

// export const configDev = {
//   apiKey: "AIzaSyCKA_kPJxInL8CsE7v3AMJSpvlBu2BNOJY",
//   authDomain: "ielts-fighters.firebaseapp.com",
//   databaseURL: "https://ielts-fighters.firebaseio.com",
//   projectId: "ielts-fighters",
//   storageBucket: "ielts-fighters.appspot.com",
//   messagingSenderId: "805244299358",
//   appId: "1:805244299358:web:ae563060ff1a35ce1d2ccf",
//   measurementId: "G-EXLTR8R697"
// };

// if (!firebase.apps.length) {
//   console.log('bbb: ');
//   firebase.initializeApp(configDev);
// }
// export const realtimeDB = firebase.database();

export default firebase;