import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsqAL18hjTKzpYNPW3q6lSKaejYO1TuDc",
  authDomain: "kibo-art-academy.firebaseapp.com",
  projectId: "kibo-art-academy",
  storageBucket: "kibo-art-academy.appspot.com",
  messagingSenderId: "182717419459",
  appId: "1:182717419459:web:c9090ca49ad66aa7c8b776"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Test function for reading data
export const getFirebaseItems = async (table) => {
  try {
    const result = await getDocs(collection(db, table));
    result.forEach((doc) => {
      console.log(doc.data());
    });
  } catch (err) {
    console.log(err);
  }
}
