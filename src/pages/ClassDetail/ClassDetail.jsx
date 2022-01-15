import React, { useEffect, useState } from "react";
import ClassInfo from "../../components/ClassInfo/ClassInfo";
import { db } from "../../lib/firebase";
import { useParams } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
//firebase imports
import { collection, getDocs } from "@firebase/firestore";
import { useQuery } from "react-query";
import { getClasses } from "../../lib/class";
import Skeleton from "react-loading-skeleton";
import AddLesson from "../../components/AddLesson/AddLesson";
import { getClassesLesson } from "./../../lib/evaluation";

export default function ClassDetail() {
  const { classId } = useParams();
  const [classUID, setClassesUID] = useState(classId);
  const [lessonsInfo, setLessonsInfo] = useState(null);
  const [talentLessons, setTalentLessons] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isTalent, setIsTalent] = useState(false);
  const [editClass, setEditClass] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  const { currentUser } = useAuth();
  const {
    data: classes,
    isLoading,
    refetch,
  } = useQuery(["getClasses", { currentUser: currentUser }], getClasses, {
    enabled: !!currentUser,
    refetchOnWindowFocus: false,
  });
  /**
   *
   * @param {string} date
   */
  const formatTime = (stringSeconds) => {
    const date = new Date(parseInt(stringSeconds) * 1000);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  const changeClassId = (classId) => {
    setClassesUID(classId);
    getClassInfo(classId);
  };

  const getTalentScore = async (lesson, classId) => {
    await getDocs(
      collection(
        db,
        "Classes",
        classId,
        "ClassLessons",
        lesson.id,
        "Achievements"
      )
    ).then((talents) => {
      const talentData = talents.docs.map((talent) => talent.data());
      let index = talentData.findIndex(
        (item) => item.talentID === currentUser.userID
      );
      lesson.score = talentData[index].score;
    });
  };

  const getTalentAttendance = async (lesson, classId) => {
    await getDocs(
      collection(
        db,
        "Classes",
        classId,
        "ClassLessons",
        lesson.id,
        "Attendances"
      )
    ).then((talents) => {
      const talentData = talents.docs.map((talent) => talent.data());
      let index = talentData.findIndex(
        (item) => item.talentID === currentUser.userID
      );
      lesson.attendance = talentData[index].status;
    });
  };

  const getClassInfo = async (classId) => {
    const getAllLessons = async () => {
      await getClassesLesson(classUID).then((lessons) => {
        setLessonsInfo(lessons);
      });
    };
    getAllLessons();
    if (lessonsInfo && isTalent) {
      const _talentLessons = lessonsInfo;
      const getTalentInfoByLessonPromise = _talentLessons.map(
        async (lesson) => {
          await getTalentScore(lesson, classId);
          await getTalentAttendance(lesson, classId);
        }
      );

      await Promise.all(getTalentInfoByLessonPromise);
      setTalentLessons(_talentLessons);
    }
  };

  useEffect(() => {
    getClassInfo(classUID);
  }, [classes, classUID]);

  //check role
  useEffect(() => {
    setIsTeacher(false);
    setIsTalent(false);
    if (parseInt(currentUser.role) === 1) {
      setIsTeacher(true);
    } else if (parseInt(currentUser.role) === 2) {
      setIsTalent(true);
    }
  }, [currentUser]);

  if (isLoading || !talentLessons) return <Skeleton count={20} />;

  return (
    <section className="container px-20 flex flex-col">
      <div className="class-top mb-10 flex">
        <div className="class-function flex-1 flex justify-center text-3xl">
          クラス情報
        </div>
      </div>
      <div className="class-center flex flex-col md:flex-row">
        <div className="class-left flex flex-col flex-auto">
          <div className="class-table relative">
            <div className="absolute bottom-full mb-8">
              {isTeacher && (
                <button
                  className="btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowModal(true);
                  }}
                >
                  新しい授業
                </button>
              )}
            </div>
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-md font-medium text-black-500 uppercase tracking-wider"
                        >
                          番号
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-md font-medium text-black-500 uppercase tracking-wider"
                        >
                          授業名
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-md font-medium text-black-500 uppercase tracking-wider"
                        >
                          日付
                        </th>
                        {isTalent && (
                          <th
                            style={{
                              textAlign: "center",
                            }}
                            scope="col"
                            className="px-6 py-3 text-left text-md font-medium text-black-500 uppercase tracking-wider"
                          >
                            出席情報
                          </th>
                        )}
                        {isTalent && (
                          <th
                            style={{
                              textAlign: "center",
                            }}
                            scope="col"
                            className="px-6 py-3 text-left text-md font-medium text-black-500 uppercase tracking-wider"
                          >
                            成績
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {talentLessons &&
                        talentLessons.map((item, idx) => (
                          <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {idx + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">
                                {item.name}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {formatTime(item.date.seconds)}
                              </div>
                            </td>
                            {isTalent && (
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <input
                                  type="checkbox"
                                  className="mx-auto block"
                                  checked={item.attendance}
                                  disabled={true}
                                />
                              </td>
                            )}
                            {isTalent && (
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
                                    disabled={true}
                                    value={item.score}
                                  />
                                </div>
                              </td>
                            )}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mx-8 class-right flex-auto w-80 flex-grow-0">
          <div className="flex justify-end">
            <ClassInfo
              classInfo={
                classes[classes.findIndex((item) => item.id === classUID)]
              }
              classes={classes}
              changeClassId={changeClassId}
            />
          </div>
        </div>
        <AddLesson
          data={editClass}
          open={showModal}
          setOpen={setShowModal}
          refetch={refetch}
        />
      </div>
    </section>
  );
}
