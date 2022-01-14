import { collection, doc, setDoc } from "@firebase/firestore";
import { db, getFirebaseItemWithCondition } from "./firebase";

export const createLesson = async ({
  title,
  dateFormatted,
  classUID,
  talentIds,
}) => {
  await setDoc(doc(collection(db, "Classes", classUID, "ClassLessons")), {
    name: title,
    date: dateFormatted,
  })
    .then(async (data) => {
      const createdLesson = await getFirebaseItemWithCondition(
        `Classes/${classUID}/ClassLessons`,
        ["name", "==", title]
      );

      const setAchievements = talentIds.map(async (talentId) => {
        const talent = await getFirebaseItemWithCondition("Users", [
          "userID",
          "==",
          talentId,
        ]);

        await setDoc(
          doc(
            db,
            `Classes/${classUID}/ClassLessons/${createdLesson.id}/Achievements`,
            talent.email
          ),
          {
            score: 0,
            talentID: talentId,
          }
        );
      });

      Promise.all(setAchievements);

      const setAttendances = talentIds.map(async (talentId) => {
        const talent = await getFirebaseItemWithCondition("Users", [
          "userID",
          "==",
          talentId,
        ]);
        await setDoc(
          doc(
            db,
            `Classes/${classUID}/ClassLessons/${createdLesson.id}/Attendances`,
            talent.email
          ),
          {
            status: false,
            talentID: talentId,
          }
        );
      });

      Promise.all(setAttendances);
    })
    .catch((err) => {
      throw err;
    });
};
