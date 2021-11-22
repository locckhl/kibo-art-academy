import {getDocs, collection } from "firebase/firestore";
import {db} from "./firebase";

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
