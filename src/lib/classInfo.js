import { collection, doc, setDoc, getDocs } from "@firebase/firestore"
import { db } from "./firebase"
import { getFirebaseItemWithCondition } from "./firebase"

export const createLesson = async ({
  title,
  dateFormatted,
  classUID,
  talentIds
}) => {
  await setDoc(doc(collection(db, "Classes", classUID, "ClassLessons")), {
    name: title,
    date: dateFormatted,
  })
    .then(async (data) => {
      const createdLesson = await getFirebaseItemWithCondition(`Classes/${classUID}/ClassLessons`, [
        "name",
        "==",
        title,
      ])

      await setDoc(doc(db, `Classes/${classUID}/ClassLessons/${createdLesson.id}/Achievements`, "mail"),{talentIds});
      // await setDoc(
      //   doc(collection(db, `Classes/${classUID}/ClassLessons/${createdLesson.id}/Achievements`)),
      //   {
      //     talentIDs: talentIds,
      //   }
      // )
      console.log(talentIds,"talentIds");
      await setDoc(
        doc(collection(db, `Classes/${classUID}/ClassLessons/${createdLesson.id}/Attendances`)),
        {
          talentIDs: talentIds,
        }
      )

      // window.location.href = `/classDetail/${ classUID }`
    })
    .catch((err) => {
      throw err
    })
}
