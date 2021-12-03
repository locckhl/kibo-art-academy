import React from "react";
import { useParams } from "react-router";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
import { getAllTalentsByClassUID, getClassesLesson, Save } from "../../lib/attendance";
import { SuccessMessage, ErrorMessage } from "../../utils/toastify";
import { getFirebaseItemsWithCondition } from "../../lib/firebase";

/**
 * 
 * @param {string} date 
 */
const formatTime = (stringSeconds) => {
  const date = new Date(parseInt(stringSeconds)*1000)
  return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`
}

export default function Attendance({user}) {
  const {classId} = useParams();
  const [talents, setTalents] = React.useState([])
  const [classUID, setClassesUID] = React.useState(classId)
  const [lessonList, setLessonList] = React.useState([])
  const [lesson, setLesson] = React.useState(-1)
  const [loading, setLoadding] = React.useState(false)
  const [classesCollection, setClassCollection] = React.useState([])
  const [disable, setDisable] = React.useState(false)

  React.useEffect(() => {
    const getAllLessons = async () => {
      await getClassesLesson(classUID)
      .then(lessons => { console.log(lessons); setLessonList(lessons); setLesson(0)})
    }
    getAllLessons()
  }, [classUID]);

  React.useEffect(()=>{
    const getAllStudent = async() => {
      console.log(classUID, lessonList[lesson]?.id)
      await getAllTalentsByClassUID(classUID, lessonList[lesson]?.id).then(talents => { setTalents(() => [...talents]);})
    }
    if (lesson > -1) {
      getAllStudent();
    }
  }, [classUID, lessonList, lesson])

  React.useEffect(() => {
    const getAllClasses = async() => {
      await getFirebaseItemsWithCondition("Classes", ["teacherID", "==", user?.uid]).then(classes => setClassCollection(classes))
    }
    getAllClasses()
  }, [])

  const handleClick = (index) => {
    if(talents[index].status) {
      talents[index].checked --
    }else{
      talents[index].checked ++
    }
    talents[index].status = !talents[index].status;
    
    setTalents([...talents])
  }

  const handleSubmit = async () => {
     if(!disable){
      setLoadding(true)
      const isSuccess = await Save(classUID,lessonList[lesson].id,talents)
      if (isSuccess) {
        SuccessMessage("Success")
      } else {
        ErrorMessage("Error")
      }
      setLoadding(false)
     }else{
      ErrorMessage("Error")
     }
  }

  const changeClassId = (classId) => {
    setClassesUID(classId);
    setLesson(-1);
  }
  React.useEffect(() => {
    if (lesson > -1 && lessonList.length > 0) {
      const lessonSeccond = lessonList[lesson].date.seconds
      const timeNow = Date.now()/1000
      setDisable(() => (timeNow - lessonSeccond) > 7*24*60*60)
    }
  }, [lessonList, lesson])
  return (
    <div className="container mt-40 px-20 flex flex-col">
      <div className="class-top mb-10 flex">
        <div className="class-date">
          <label for="dates">日付け：</label>
          <select name="dates" id="" onChange={(envet) => setLesson(envet.target.value)}>
            {lessonList.map((item, index) => {
              return <option value={index} selected={`${index === lesson? "selected":""}`}>{formatTime(item.date.seconds)}</option>
            })}
          </select>
        </div>
        <div className="class-function flex-1 flex justify-center text-3xl">
            出欠
        </div>
      </div>
      <div className="class-center flex">
        <div className="class-left flex flex-col flex-auto">
          <div className="class-table">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          番号
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          名前
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          出席率
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                        >
                          出席
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {talents.map((talent, index) => (
                        <tr key={talent.userID}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {index + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {talent.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {Math.round(talent.checked/talent.totalLessons * 100)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <input type="checkbox" className="mx-auto block" checked={talent.status} disabled={disable} onChange={()=> handleClick(index)}/>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="class-action mx-auto my-10">
            <button className="btn" onClick={() => handleSubmit()} disabled={loading || disable}>
              <i className={`fas fa-circle-notch fa-spin `} style={{display:!loading?"none":"block"}}></i>
              {"更新保存"}</button>
          </div>
        </div>
        <div className="mx-10 class-right flex-auto">
          {/* <div className="flex jutify-end"> */}
          <ClassInfo classInfo={classesCollection[classesCollection.findIndex(item => item.id === classUID)]} classes={classesCollection} changeClassId={changeClassId}/>

          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
