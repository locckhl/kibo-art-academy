import React from "react";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import {
  updateAchievementsItem,
  getClassesLesson,
  getAllTalentsByClassUID
} from "./../../lib/evaluation";
import { getFirebaseItems } from "../../lib/firebase";
import { SuccessMessage, ErrorMessage } from "../../utils/toastify";

export default function Evaluation() {
  const { classId } = useParams();
  const [state, setState] = useState({
    isEdit: false,
    dataClasses: [],
    currentClass: [],
    classLessons: [],
    currentClassLesson: [],
    classTalents: [],
    classUID: classId,
    isLoading: false,
  });

  const formatTime = (stringSeconds) => {
    const date = new Date(parseInt(stringSeconds) * 1000)
    return `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
  }

  useEffect(() => {
    //get all lessons
    const getAllLessons = async () => {
      await getClassesLesson(state.classUID).then((res) => {
        console.log("res", res);
        setState({
          ...state,
          classLessons: res,
          currentClassLesson: res[0],
        });
      });
    }
    getAllLessons()
  }, []);

  useEffect(() => {
    //get all talents
    const getAllTalents = async () => {
      await getAllTalentsByClassUID(state.classUID, state.currentClassLesson?.id).then((res) => {
        setState({
          ...state,
          classTalents: res,
        });
      });
    }
    if (state.classLessons.length > 0) {
      getAllTalents()
    }
  }, [state.classUID, state.currentClassLesson]);

  useEffect(() => {
    const getAllClasses = async () => {
      await getFirebaseItems("Classes").then((res) => {
        setState({
          ...state,
          dataClasses: res,
        });
      });
    }
    getAllClasses()
  }, [])

  const handleEdit = () => {
    setState({
      ...state,
      isEdit: true,
    });
  };

  const handleEditScore = (key, talentID, value) => {
    const data = state.classTalents;
    let index = data.findIndex((item) => item.talentID === talentID);
    data[index].score = parseInt(value);
    setState({
      ...state,
      classTalents: data,
    });
  };

  const save = async () => {
    state.isLoading = true;
    const isSuccess = await updateAchievementsItem(state.classUID, state.classLessons[0]?.id, state.classTalents);
    if (isSuccess) {
      SuccessMessage("Success")
    } else {
      ErrorMessage("Error")
    }
    state.isLoading = false;
  };

  const changeClassId = (classId) => {
    setState({
      ...state,
      classUID: classId,
    });
  }

  const setLesson = (value) => {
    console.log("value", value)
    setState({
      ...state,
      currentClassLesson: state.classLessons[value],
    })
  }

  const { classUID, classLessons, classTalents, dataClasses } = state;

  return (
    <div className="container mt-20 px-20 flex flex-col">
      <div className="class-top mb-10 flex">
        <div className="class-date">
          <label for="dates">日付け：</label>
          <select name="dates" id="" onChange={(envet) => setLesson(envet.target.value)}>
            {classLessons.map((item, index) => {
              return <option value={index} selected={`${index === classLessons[0] ? "selected" : ""}`}>{formatTime(item.date.seconds)}</option>
            })}
          </select>
        </div>
        <div className="class-function flex-1 flex justify-center text-3xl">
          評価
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
                          点数
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {classTalents.length !== 0 &&
                        classTalents.map((value, key) => (
                          <tr key={key}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {key + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {value.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                <input
                                  style={{ 'width': "8%", 'padding-left': "0px" }}
                                  type="number"
                                  disabled={!state.isEdit}
                                  defaultValue={`${value.score}`}
                                  onChange={(e) =>
                                    handleEditScore(
                                      key,
                                      value.talentID,
                                      e.target.value
                                    )
                                  }
                                />
                                <input
                                  style={{ width: "20%" }}
                                  type="text"
                                  disabled={true}
                                  defaultValue={`/100`}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="class-action my-10 flex justify-around">
            <div>
              <button className=" btn " onClick={save}>
                更新保存
              </button>
            </div>
            <div>
              <button className=" btn " onClick={handleEdit}>
                修正
              </button>
            </div>
          </div>
        </div>
        <div className="mx-10 class-right flex-auto">
          {/* <div className="flex justify-end"> */}
          <ClassInfo classInfo={dataClasses[dataClasses.findIndex(item => item.id === classUID)]} classes={dataClasses} changeClassId={changeClassId} />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
}
