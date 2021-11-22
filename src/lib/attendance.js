import {
  getFirebaseItems,
  getFirebaseItemWithCondition,
  updateItemFireBase,
} from "./firebase"

export const getAllTalentsByClassUID = async (classId, lessonID) => {
  let students = []
  const getAttendance = (lessonID) => {
    return new Promise((resovle, reject) => {
      getFirebaseItems(
        "Classes",
        classId,
        "ClassLessons",
        lessonID,
        "Attendances"
      )
        .then((data) => resovle({ data: data, lessonID }))
        .catch((error) => reject(error))
    })
  }
  const ratio = (Lessons, talentID) => {
    let count = 0
    Lessons.filter((item) => {
      const index = item.data.findIndex((item) => item.talentID === talentID)
      if (item.data[index].status) {
        count++
      }
    })
    return { checked: count, totalLessons: Lessons.length }
  }

  try {
    //Get all talents in the class
    const Lessons = await getFirebaseItems("Classes", classId, "ClassLessons")
    console.log(Lessons)
    const data = await Promise.all(
      Lessons.map((lesson) => getAttendance(lesson.id))
    )
    console.log(data)
    const index = data.findIndex((item) => item.lessonID === lessonID)
    const LessonSelected = data[index].data

    // Get talent information by talentId
    for (let i = 0; i < LessonSelected.length; i++) {
      const studentInfo = await getFirebaseItemWithCondition("Users", [
        "userID",
        "==",
        LessonSelected[i].talentID,
      ])

      students.push({
        ...studentInfo,
        ...LessonSelected[i],
        ...ratio(data, LessonSelected[i].talentID),
      })
    }
  } catch (error) {
    console.log(error)
  }
  console.log(students)
  return students
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

export const Save = async (classID, LessonID, talents) => {
  const updateItem = (item) => {
    return new Promise((resovle, reject) => {
      const newItem = { status: item.status, talentID: item.talentID }
      updateItemFireBase(
        newItem,
        "Classes",
        classID,
        "ClassLessons",
        LessonID,
        "Attendances",
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
