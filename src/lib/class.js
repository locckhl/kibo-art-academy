import { collection, doc, setDoc } from "@firebase/firestore";
import { auth, db, getFirebaseItemWithCondition } from "./firebase";

export const createClass = async ({
  title,
  summary,
  numLessons,
  dateBegin,
  dateEnd,
  teacher,
  talents,
  user
}) => {
  await setDoc(doc(collection(db, "Classes")), {
    className: title,
    numLessons: numLessons,
    dateBegin: dateBegin,
    dateEnd: dateEnd,
    numTalents: talents.length,
    summary: summary,
    teacherID: teacher,
  })
    .then(async (data) => {
      const createdClass = await getFirebaseItemWithCondition("Classes", [
        "className",
        "==",
        title,
      ]);
      await setDoc(
        doc(collection(db, `Classes/${createdClass.id}/ClassTalents`)),
        {
          talentIDs: talents,
        }
      );

      await auth.updateCurrentUser(user);
      window.location.href = "/";
    })
    .catch((err) => {
      throw err;
    });
};
