import { getClassesLesson } from "./evaluation"
import {
  getFirebaseItems,
  getFirebaseItemWithCondition,
  getFirebaseItemWithID,
} from "./firebase"

/**
 * Get talent achivement and score by class ID.
 * @param {string} classID - The id of the class.
 * @param {string} author - The author of the book.
 * @returns  {{totalAttendance, totalAchivement}}
 */

export const getTalentInfoByClass = async (classID, talentId) => {
  const lessons = await getClassesLesson(classID)

  const attendances = await Promise.all(
    lessons.map(async (lesson) => {
      const result = await getFirebaseItemWithID(
        `Classes/${classID}/ClassLessons/${lesson.id}/Attendances/${talentId}`
      )
      return result
    })
  )

  const achivements = await Promise.all(
    lessons.map(async (lesson) => {
      const result = await getFirebaseItemWithID(
        `Classes/${classID}/ClassLessons/${lesson.id}/Achievements/${talentId}`
      )
      return result
    })
  )

  let totalAchivement = achivements.reduce(
    (total, achivement) => (total += achivement.score),
    0
  )

  let totalAttendance = attendances.reduce((total, attendance) => {
    if (attendance.status) total += 1
    return total
  }, 0)

  totalAchivement = totalAchivement / achivements.length
  totalAttendance = `${totalAttendance}/${attendances.length}`
  return { totalAttendance, totalAchivement }
}

export const getAllTalentsByClassID = async (classID) => {
  const response = await getFirebaseItems("Classes", classID, "ClassTalents")
  const data = response[0]?.talentIDs
  console.log(data)
  const students = await Promise.all(
    data.map((item) =>
      getFirebaseItemWithCondition("Users", ["userID", "==", item])
    )
  )
  console.log(students)
  return [
    response[0]?.id,
    students.map((item) => ({ value: item.userID, label: item.name })),
  ]
}
