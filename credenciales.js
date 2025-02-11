// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDx3J4zG-2FBYW_9P8YVVGIcpggJQmvTx0",
  authDomain: "milogintest-8caf6.firebaseapp.com",
  projectId: "milogintest-8caf6",
  storageBucket: "milogintest-8caf6.firebasestorage.app",
  messagingSenderId: "416381995959",
  appId: "1:416381995959:web:0405137a384d0fcd2bf632"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase;