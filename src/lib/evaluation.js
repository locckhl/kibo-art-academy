import {
  getFirebaseItems,
  getFirebaseItemWithCondition,
  updateItemFireBase,
} from "./firebase"

export const updateAchievementsItem = async (classID, LessonID, talents) => {
  console.log("updateAchievementsItem", classID, LessonID, talents)
  const updateItem = (item) => {
    return new Promise((resovle, reject) => {
      const newItem = { score: item.score, maxScore: 100 }
      updateItemFireBase(
        newItem,
        "Classes",
        classID,
        "ClassLessons",
        LessonID,
        "Achievements",
        item.id
      )
        .then((isSuccess) => resovle(isSuccess))
        .catch((error) => reject(false))
    })
  }
  let isSuccess = false

  isSuccess = await Promise.all(talents.map((item) => updateItem(item)))
    .then((values) => values.every((item) => item === true))
    .catch((isSuccess = false))
  return isSuccess
}

export const getAllTalentsByClassUID = async (classId, lessonID) => {
  let talents = []
  const getAchivement = (lessonID) => {
    return new Promise((resovle, reject) => {
      getFirebaseItems(
        "Classes",
        classId,
        "ClassLessons",
        lessonID,
        "Achievements"
      )
        .then((data) => resovle({ data: data, lessonID }))
        .catch((error) => reject(error))
    })
  }
  try {
    //Get all talents in the class
    const Lessons = await getFirebaseItems("Classes", classId, "ClassLessons")
    const data = await Promise.all(
      Lessons.map((lesson) => getAchivement(lesson.id))
    )
    const index = data.findIndex((item) => item.lessonID === lessonID)
    const LessonSelected = data[index].data

    // Get talent information by talentId
    for (let i = 0; i < LessonSelected.length; i++) {
      const studentInfo = await getFirebaseItemWithCondition("Users", [
        "userID",
        "==",
        LessonSelected[i].talentID,
      ])

      talents.push({
        ...studentInfo,
        ...LessonSelected[i],
      })
    }
  } catch (err) {
    console.log(err);
  }
  return talents
}

export const getClassesLesson = async (classId) => {
  let lessons = []
  try {
    lessons = await getFirebaseItems("Classes", classId, "ClassLessons")
    lessons = lessons.sort((a, b) => {
      return b.date.seconds - a.date.seconds
    })
  } catch (error) {
    console.log(error)
  }
  return lessons
}
