// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB78z4pX_qvzIBZ5fmrBezxiLFAj_XleBU",
  authDomain: "project05-c69a4.firebaseapp.com",
  projectId: "project05-c69a4",
  storageBucket: "project05-c69a4.appspot.com",
  messagingSenderId: "823053978252",
  appId: "1:823053978252:web:b4bae313864941c602c9a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)