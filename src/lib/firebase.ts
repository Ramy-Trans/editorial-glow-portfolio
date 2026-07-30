import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDtHKTSs_70J8aNzYbJxh-he93aV0nWMMY",
  authDomain: "editorial-glow-portfolio.firebaseapp.com",
  projectId: "editorial-glow-portfolio",
  storageBucket: "editorial-glow-portfolio.firebasestorage.app",
  messagingSenderId: "997906803281",
  appId: "1:997906803281:web:b81862a26791cd8d606670",
  measurementId: "G-M488PB83F5",
};

export const app = initializeApp(firebaseConfig);

// Analytics is only supported in browser environments
export const analytics = isSupported().then((yes) =>
  yes ? getAnalytics(app) : null
);
