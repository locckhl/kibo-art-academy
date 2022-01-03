import { collection, doc, setDoc } from "@firebase/firestore";
import { db } from "./firebase";

export const createClass = async ({
  title,
  summary,
  numLessons,
  dateBegin,
  dateEnd,
  teacher,
  talents,
}) => {
  await setDoc(doc(collection(db, "Classes")), {
    className: title,
    numLessons: numLessons,
    dateBegin: dateBegin,
    dateEnd: dateEnd,
    numTalents: talents.length,
    summary: summary,
    teacherId: teacher,
    talents,
  })
    .then(async (data) => {
      // await setDoc(doc(collection(db, `Classes/${data.id}/ClassTalents`)), {
      //     talentIDs:talents
      // })
      // collection().
    })
    .catch((err) => {
      throw err;
    });
};
