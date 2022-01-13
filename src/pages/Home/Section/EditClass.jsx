import React, { useEffect, useState, Fragment } from "react";
import { Navigate } from "react-router";
import Select from "react-select";
import { useAuth } from "../../../contexts/AuthContext";
import { updateClass } from "../../../lib/class";
import { getFirebaseItemsWithCondition } from "../../../lib/firebase";
import { ErrorMessage, SuccessMessage } from "../../../utils/toastify";
import { Dialog, Transition } from "@headlessui/react";
import "./index.scss";
import { getAllTalentsByClassID } from "../../../lib/home";
import { Timestamp } from "firebase/firestore";

export default function EditClass(props = {}) {
  const { open, setOpen, data } = props;
  console.log(data);
  const { currentUser, user } = useAuth();
  const [isTitleFocus, setIsTitleFocus] = useState(false);
  const [isSummaryFocus, setIsSummaryFocus] = useState(false);
  const [isNumLessonsFocus, setIsNumLessonsFocus] = useState(false);
  const [isDateBeginFocus, setIsDateBeginFocus] = useState(false);
  const [isDateEndFocus, setIsDateEndFocus] = useState(false);
  const [isTeacherFocus, setIsTeacherFocus] = useState(false);

  const [title, setTitle] = useState(data?.title);
  const [summary, setSummary] = useState(data?.summary);
  const [numLessons, setNumLessons] = useState(data?.munLessons);
  const [dateBegin, setDateBegin] = useState(data?.dateBegin);
  const [dateEnd, setDateEnd] = useState(data?.dateEnd);
  const [teacher, setTeacher] = useState(data?.teacher);
  const [classTalents, setClassTalents] = useState([]);

  const [talents, setTalents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classTalentId, setClassesTalentId] = useState("");

  React.useEffect(() => {
    if (data) {
      setTitle(data.className);
      setSummary(data.summary);
      setNumLessons(data.numLessons);
      setDateBegin(data.dateBegin);
      setDateEnd(data.dateEnd);
      setTeacher(data.teacherID);
    }
  }, [data]);
  const handleSignup = async () => {
    if (!validate()) return;
    await updateClass({
      title,
      summary,
      numLessons,
      dateBegin,
      dateEnd,
      teacher,
      talents: classTalents.map((item) => item.value),
      user,
      classID: data.id,
      talentID: classTalentId,
    })
      .then(() => {
        SuccessMessage("編集成功");
      })
      .catch((err) => {
        ErrorMessage("編集失敗");
        console.log(err);
      });
  };

  const validate = () => {
    return (
      checkTitle() &&
      checkSummary() &&
      checkNumLessons() &&
      checkDateBegin() &&
      checkDateEnd() &&
      checkTeacher() &&
      checkTalents()
    );
  };

  const checkTitle = () => {
    //check if title is empty?
    if (title === "") {
      ErrorMessage("title cannot be empty");
      return false;
    }
    return true;
  };

  const checkSummary = () => {
    //check if title is empty?
    if (summary === "") {
      ErrorMessage("title cannot be empty");
      return false;
    }
    return true;
  };

  const checkNumLessons = () => {
    //check if numLessons is empty?
    if (numLessons === "" || numLessons <= 0) {
      ErrorMessage("numLessons must be greater than 0 and cannot be empty ");
      return false;
    }
    return true;
  };

  const checkDateBegin = () => {
    //check if dateBegin is empty?
    if (dateBegin === "") {
      ErrorMessage("dateBegin cannot be empty");
      return false;
    }
    return true;
  };
  const checkDateEnd = () => {
    //check if dateEnd is empty?
    if (dateBegin === "") {
      ErrorMessage("Must enter Date Begin first");
      return false;
    } else if (dateEnd === "") {
      ErrorMessage("dateEnd cannot be empty");
      return false;
    } else if (dateEnd <= dateBegin) {
      ErrorMessage("dateEnd must be greater than dateBegin");
      return false;
    }
    return true;
  };

  const checkTeacher = () => {
    //check if teacher is empty?
    if (teacher === "") {
      ErrorMessage("teacher cannot be empty");
      return false;
    }
    return true;
  };

  const checkTalents = () => {
    //check if classTalents is empty?
    if (classTalents.length === 0) {
      ErrorMessage("classTalents cannot be empty");
      return false;
    }
    return true;
  };
  const getTalents = async () => {
    const talentsRes = await getFirebaseItemsWithCondition("Users", [
      "role",
      "==",
      2,
    ]);
    const temp = talentsRes.map((talent) => {
      return { value: talent.userID, label: talent.name };
    });
    setTalents(temp);
  };

  const getTeachers = async () => {
    const teachersRes = await getFirebaseItemsWithCondition("Users", [
      "role",
      "==",
      1,
    ]);
    const temp = teachersRes.map((teacher) => {
      return { value: teacher.userID, label: teacher.name };
    });
    setTeachers(temp);
  };

  useEffect(async () => {
    getTalents();
    getTeachers();
  }, []);

  React.useEffect(() => {
    const getAllTalents = async () => {
      if (data) {
        const [classTalentID, talents] = await getAllTalentsByClassID(data?.id);
        setClassesTalentId(classTalentID);
        setClassTalents(talents);
      }
    };
    if (data) {
      getAllTalents();
    }
  }, [data]);

  console.log(teachers);

  return (
    data && (
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          // initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <div className="flex items-end justify-center text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all">
                <div className="bg-white">
                  <div className="w-full">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg leading-6 font-medium text-gray-900 text-center font-bold"
                      >
                        プロフィール編集
                      </Dialog.Title>
                      <section className="signin flex justify-center text-center mt-10">
                        <div className="flex justify-center flex p-10 w-50 sm:mt-0 sm:ml-4">
                          {/* <div className="login-content"> */}
                          <form action="index.html">
                            <h3 className="title font-bold text-lg">
                              クラス変更
                            </h3>

                            <div
                              className={`input-div one ${
                                isTitleFocus ? "focus" : ""
                              }`}
                            >
                              <div className="i">
                                <i className="fas fa-file-alt"></i>
                              </div>
                              <div className="div ">
                                <h5 className={`${title ? "hidden" : ""}`}>
                                  クラスタイトル
                                </h5>
                                <input
                                  onChange={(e) => {
                                    setTitle(e.target.value);
                                  }}
                                  type="text"
                                  className="input"
                                  required
                                  onFocus={() => {
                                    setIsTitleFocus(true);
                                  }}
                                  onBlur={() => {
                                    setIsTitleFocus(false);
                                  }}
                                  name="title"
                                  defaultValue={data.className}
                                />
                              </div>
                            </div>

                            <div
                              className={`input-div one ${
                                isSummaryFocus ? "focus" : ""
                              }`}
                            >
                              <div className="i">
                                <i className="fas fa-align-right"></i>
                              </div>
                              <div className="div ">
                                <h5 className={`${summary ? "hidden" : ""}`}>
                                  クラス内容
                                </h5>
                                <input
                                  onChange={(e) => {
                                    setSummary(e.target.value);
                                  }}
                                  type="text"
                                  className="input"
                                  required
                                  onFocus={() => {
                                    setIsSummaryFocus(true);
                                  }}
                                  onBlur={() => {
                                    setIsSummaryFocus(false);
                                  }}
                                  name="summary"
                                  defaultValue={data?.summary}
                                />
                              </div>
                            </div>

                            <div
                              className={`input-div one ${
                                isNumLessonsFocus ? "focus" : ""
                              }`}
                            >
                              <div className="i">
                                <i className="fas fa-sort-numeric-up-alt"></i>
                              </div>
                              <div className="div ">
                                <h5 className={`${numLessons ? "hidden" : ""}`}>
                                  授業数
                                </h5>
                                <input
                                  onChange={(e) => {
                                    setNumLessons(e.target.value);
                                  }}
                                  type="number"
                                  className="input"
                                  required
                                  onFocus={() => {
                                    setIsNumLessonsFocus(true);
                                  }}
                                  onBlur={() => {
                                    setIsNumLessonsFocus(false);
                                  }}
                                  name="numLessons"
                                  defaultValue={data?.numLessons}
                                />
                              </div>
                            </div>
                            <div
                              className="text-left mt-5"
                              style={{ color: "#999" }}
                            >
                              開始日
                            </div>
                            <div
                              className={`input-div pass ${
                                isDateBeginFocus ? "focus" : ""
                              }`}
                              style={{ margin: 0 }}
                            >
                              <div className="i">
                                <i className="fas fa-calendar-alt"></i>
                              </div>
                              <div className="div ">
                                <input
                                  onChange={(e) => {
                                    setDateBegin(Timestamp.fromDate(new Date(e.target.value)));
                                  }}
                                  type="date"
                                  className="input"
                                  required
                                  onFocus={() => {
                                    setIsDateBeginFocus(true);
                                  }}
                                  onBlur={() => {
                                    setIsDateBeginFocus(false);
                                  }}
                                  name="dateBegin"
                                  defaultValue={data?.dateBegin}
                                />
                              </div>
                            </div>
                            <div
                              className="text-left mt-5"
                              style={{ color: "#999" }}
                            >
                              終了日
                            </div>
                            <div
                              className={`input-div pass ${
                                isDateEndFocus ? "focus" : ""
                              }`}
                              style={{ margin: 0 }}
                            >
                              <div className="i">
                                <i className="fas fa-calendar-alt"></i>
                              </div>
                              <div className="div ">
                                <input
                                  onChange={(e) => {
                                    setDateEnd(Timestamp.fromDate(new Date(e.target.value)));
                                  }}
                                  type="date"
                                  className="input"
                                  required
                                  onFocus={() => {
                                    setIsDateEndFocus(true);
                                  }}
                                  onBlur={() => {
                                    setIsDateEndFocus(false);
                                  }}
                                  name="dateEnd"
                                  defaultValue={data?.dateEnd}
                                />
                              </div>
                            </div>

                            <div
                              className={`input-div pass ${isTeacherFocus} ? "focus" : ""}`}
                            >
                              <div className="i">
                                <i className="fas fa-users-cog"></i>
                              </div>
                              <div className="div ">
                                　<h5 className="hidden">教師</h5>
                                <select
                                  name="teacher"
                                  id="teacher"
                                  defaultValue={data?.teacherID || "0"}
                                  onFocus={() => {
                                    setIsTeacherFocus(true);
                                  }}
                                  onBlur={() => {
                                    setIsTeacherFocus(false);
                                  }}
                                  onChange={(e) => {
                                    setTeacher(e.target.value);
                                  }}
                                >
                                  <option value="0" disabled>
                                    教師
                                  </option>
                                  {teachers.map((teacher) => (
                                    <option value={teacher.value}>
                                      {teacher.label}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div style={{width: "600px"}}>
                              <Select
                                isMulti
                                options={talents}
                                value={classTalents}
                                onChange={(options) => {
                                  setClassTalents(
                                    options.map((option) => option)
                                  );
                                }}
                              />
                            </div>
                            {/* <input
                              onClick={(e) => {
                                e.preventDefault();
                                handleSignup();
                              }}
                              type="submit"
                              className="btn"
                              value="追加"
                            /> */}
                          </form>
                          {/* </div> */}
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleSignup();
                    }}
                  >
                    編集
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setOpen(false);
                      setClassTalents([]);
                    }}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    )
  );
}
