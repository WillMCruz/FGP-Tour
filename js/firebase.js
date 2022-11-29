/********************************************** 
* Renomeie este arquivo para firebase.js!
***********************************************/

// Cole as informações do seu RealTime Database do Firebase abaixo:
const firebaseConfig = {
  apiKey: "AIzaSyDBlsycAJeH5-YYlcKCYt1whWmByXy0V3k",
  authDomain: "fgptour.firebaseapp.com",
  projectId: "fgptour",
  storageBucket: "fgptour.appspot.com",
  messagingSenderId: "442534671576",
  appId: "1:442534671576:web:f93e23711145a51406d3ad",
  measurementId: "G-EGJETNPNHT"
};


/*
* Nas regras do Realtime Database, informe:
* {
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
*/

// Inicializando o Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();
