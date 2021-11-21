import { initializeApp } from "firebase/app";
import { getFirestore, getDocs, collection } from "firebase/firestore";

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


export const updateAchievementsItem = async (id, score, maxScore) => {
    try {
        console.log("updateAchievementsItem", id, score, maxScore);
      const data = db.collection("/Classes/97sxQMGJ5pQj80JnmodI/ClassLessons/yXhng4x1MPLSJj1D6z2w/Achievements").document(id).update({
        score: score,
        maxScore: maxScore
      });
      return data;
    } catch (err) {
    }
}

export const getFirebaseItems = async (table) => {
    try {
      const result = await getDocs(collection(db, table));
      result.forEach((doc) => {
        console.log(doc.data());
      });
      return result;
    } catch (err) {
      console.log(err);
    }
  }
