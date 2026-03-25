import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9nNxeIBeTBLfVTOXTFfNAUr8uhFaaT0g",
  authDomain: "farmerbridge-new.firebaseapp.com",
  databaseURL: "https://farmerbridge-new-default-rtdb.firebaseio.com",
  projectId: "farmerbridge-new",
  storageBucket: "farmerbridge-new.firebasestorage.app",
  messagingSenderId: "1026435323302",
  appId: "1:1026435323302:web:ed0dc52409a3d0e8dceb67"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
export default app;
