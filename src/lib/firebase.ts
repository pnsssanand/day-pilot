import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBSoiLwagIZUsAdsojygN5wrJmAfg82CQ8",
  authDomain: "day-pilot-c2e6a.firebaseapp.com",
  projectId: "day-pilot-c2e6a",
  storageBucket: "day-pilot-c2e6a.firebasestorage.app",
  messagingSenderId: "907815037664",
  appId: "1:907815037664:web:9b7d60ddcc6c082369fe85",
  measurementId: "G-5YET0MQPSK"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
