import React from "react";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

import {
  updateAchievementsItem,
  getClassesLesson,
  getAllTalentsByClassUID,
} from "./../../lib/evaluation";
import { SuccessMessage, ErrorMessage } from "../../utils/toastify";
import Skeleton from "react-loading-skeleton";
import { useNavigate } from "react-router";
import { useQuery } from "react-query";
import { getClasses } from "../../lib/class";

export default function Evaluation() {
  const { currentUser } = useAuth();
  const { data: classes, isLoading } = useQuery(
    ['getClasses', { currentUser:currentUser }],
    getClasses,
    {
      enabled: !!currentUser
    }
  );
  const { classId } = useParams();
  const [state, setState] = useState({
    isEdit: false,
    isLoading: false,
  });
  const [classUID, setClassesUID] = React.useState(classId);
  const [lessonList, setLessonList] = React.useState([]);
  const [lesson, setLesson] = React.useState(-1);
  const [talents, setTalents] = React.useState(null);
  const [isFinalScoreMode, setIsFinalScoreMode] = React.useState(false);
  const naviagate = useNavigate();

  const formatTime = (stringSeconds) => {
    const date = new Date(parseInt(stringSeconds) * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const getAllLessons = async () => {
      await getClassesLesson(classUID).then((lessons) => {
        setLessonList(lessons);
        setLesson(0);
      });
    };
    getAllLessons();
  }, [classUID]);

  useEffect(() => {
    setTalents(null);
    const getAllStudent = async () => {
      await getAllTalentsByClassUID(classUID, lessonList[lesson]?.id).then(
        (talents) => {
          setTalents(() => [...talents]);
        }
      );
    };
    if (lesson > -1) {
      getAllStudent();
    }
  }, [classUID, lessonList, lesson]);

  const handleEdit = () => {
    setState({
      ...state,
      isEdit: true,
    });
  };

  const handleEditScore = (key, value) => {
    const data = [...talents];
    data[key].score = parseInt(value);
    setTalents(data);
  };

  const checkValid = () => {
    // Check if at least 1 input is wrong then return false
    return talents.every((talent) => {
      if (talent.score > 100 || talent.score < 0 || isNaN(talent.score)) {
        ErrorMessage("スコアは0〜100の間でなければなりません");
        return false;
      }
      return true;
    });
  };

  const save = async () => {
    if (!checkValid()) return;

    const lessonSeccond = lessonList[lesson].date.seconds;
    const timeNow = Date.now() / 1000;
    if (timeNow - lessonSeccond > 14 * 24 * 60 * 60) {
      ErrorMessage("2週間を超えたため、編集できない");
      return;
    }

    state.isLoading = true;
    const isSuccess = await updateAchievementsItem(
      classUID,
      lessonList[lesson].id,
      talents
    );
    if (isSuccess) {
      setState({
        ...state,
        isEdit: false,
        isLoading: false,
      });
      SuccessMessage("Success");
    } else {
      ErrorMessage("Error");
    }
    state.isLoading = false;
  };

  const changeClassId = (classId) => {
    setClassesUID(classId);
  };

  // const showLessonScore = () => {
  //   setTalents(null);
  //   setIsFinalScoreMode(false);
  //   const getAllStudent = async () => {
  //     await getAllTalentsByClassUID(classUID, lessonList[lesson]?.id).then(
  //       (talents) => {
  //         setTalents(() => [...talents]);
  //       }
  //     );
  //   };
  //   if (lesson > -1) {
  //     getAllStudent();
  //   }
  // };
  const handleChangeLesson = (value) => {
    if (parseInt(value) === lessonList.length) {
      setLesson(value);
      showFinalScore();
    } else {
      setIsFinalScoreMode(false);
      setLesson(value);
    }
  };

  async function showFinalScore() {
    setIsFinalScoreMode(true);
    let allClasses = [];
    let sumScore = new Array(talents.length).fill(0);
    setTalents(null);
    await lessonList.forEach((value) => {
      getAllTalentsByClassUID(classUID, value.id).then((talents) => {
        allClasses.push(talents);
        for (let i = 0; i < talents.length; i++) {
          sumScore[i] = sumScore[i] + talents[i].score;
          const data = [...talents];
          data[i].score = parseInt(sumScore[i] / lessonList.length);
          setTalents(data);
        }
      });
    });
  }

  if ( isLoading) return <Skeleton count={20} />;

  return (
    <section className="container px-20 flex flex-col">
      <div className="class-top mb-10 relative">
        <div className="class-date absolute">
          <label for="dates">日付け：</label>
          <select
            name="dates"
            id=""
            onChange={(event) => handleChangeLesson(event.target.value)}
            defaultValue={lesson}
          >
            {lessonList.map((item, index) => {
              return (
                <option key={item.id} value={index}>
                  {formatTime(item.date.seconds)}
                </option>
              );
            })}
            {currentUser &&
            currentUser.role === 1 &&
            currentUser.userID ===
              classes[classes.findIndex((item) => item.id === classUID)]
                .teacherID ? (
              <option key={lessonList.length} value={lessonList.length}>
                {"最終成績"}
              </option>
            ) : (
              ""
            )}
          </select>
        </div>
        {/* {currentUser &&
        currentUser.role === 1 &&
        currentUser.userID ===
          classes[classes.findIndex((item) => item.id === classUID)]
            .teacherID ? (
          <div
            className="text-sm font-medium text-gray-900 flex flex-col"
            style={{ width: "70%" }}
          >
            <div className="class-action mx-auto ">
              <button
                className="btn"
                onClick={() => {
                  !isFinalScoreMode ? showFinalScore() : showLessonScore();
                }}
              >
                {!isFinalScoreMode ? "最終成績" : "レッスンに応じた成績"}
              </button>
            </div>
          </div>
        ) : (
          ""
        )} */}
        <div className="class-function flex-1 flex justify-center text-3xl">
          評価
        </div>
      </div>
      <div className="class-center flex flex-col md:flex-row">
        <div className="class-left flex flex-col flex-auto">
          <div className="class-table">
            {talents ? (
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
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
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-center"
                          >
                            点数/100
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {talents.length !== 0 &&
                          talents.map((value, key) => (
                            <tr
                              key={key}
                              className="cursor-pointer"
                              onClick={(e) => {
                                naviagate(`/profile/${value.userID}`);
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 text-center">
                                  {key + 1}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {value.name}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 text-center">
                                  <input
                                    style={{
                                      width: "3.5em",
                                      paddingLeft: "1em",
                                      textAlign: "center",
                                    }}
                                    type="number"
                                    max={100}
                                    size="5"
                                    disabled={!state.isEdit}
                                    value={value.score}
                                    onChange={(e) =>
                                      handleEditScore(key, e.target.value)
                                    }
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
            ) : (
              <Skeleton count={10} />
            )}
          </div>
          <div className="class-action my-10 flex justify-around">
            {currentUser &&
            currentUser.role === 1 &&
            currentUser.userID ===
              classes[classes.findIndex((item) => item.id === classUID)]
                .teacherID ? (
              <React.Fragment>
                <div>
                  <button
                    className=" btn "
                    onClick={save}
                    style={isFinalScoreMode ? { display: "none" } : {}}
                  >
                    更新保存
                  </button>
                </div>
                <div>
                  <button
                    className=" btn "
                    onClick={handleEdit}
                    style={isFinalScoreMode ? { display: "none" } : {}}
                  >
                    修正
                  </button>
                </div>
              </React.Fragment>
            ) : (
              ""
            )}
          </div>
        </div>
        <div className="mx-10 class-right flex-auto w-80 flex-grow-0">
          {/* <div className="flex justify-end"> */}
          <ClassInfo
            classInfo={
              classes[classes.findIndex((item) => item.id === classUID)]
            }
            classes={classes}
            changeClassId={changeClassId}
          />
          {/* </div> */}
        </div>
      </div>
    </section>
  );
}
