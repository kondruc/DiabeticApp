// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsdbsZbTxavZyymTaIAZ8juCV-GgJRxto",
  authDomain: "diabeticapp15.firebaseapp.com",
  projectId: "diabeticapp15",
  storageBucket: "diabeticapp15.appspot.com",
  messagingSenderId: "1004027810243",
  appId: "1:1004027810243:web:0246458e333acb5ac4ed76",
  measurementId: "G-NTTXKP5N63"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };
