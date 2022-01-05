import React, { useEffect, useState } from "react";
import { Navigate } from "react-router";
import Select from "react-select";
import bg from "../../assets/images/bg.svg";
import wave from "../../assets/images/wave.png";
import { useAuth } from "../../contexts/AuthContext";
import { createClass } from "../../lib/class";
import {
  getFirebaseItemsWithCondition
} from "../../lib/firebase";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import "./index.scss";

export default function AddClass() {
  console.log("SignUp");
  const { currentUser, user } = useAuth();
  const [isTitleFocus, setIsTitleFocus] = useState(false);
  const [isSummaryFocus, setIsSummaryFocus] = useState(false);
  const [isNumLessonsFocus, setIsNumLessonsFocus] = useState(false);
  const [isDateBeginFocus, setIsDateBeginFocus] = useState(false);
  const [isDateEndFocus, setIsDateEndFocus] = useState(false);
  const [isTeacherFocus, setIsTeacherFocus] = useState(false);

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [numLessons, setNumLessons] = useState("");
  const [dateBegin, setDateBegin] = useState("");
  const [dateEnd, setDateEnd] = useState("");
  const [teacher, setTeacher] = useState("");
  const [classTalents, setClassTalents] = useState("");
  
  const [talents, setTalents] = useState("");
  const [teachers, setTeachers] = useState("");

  const handleSignup = async () => {
    if (!checkTitle()) {
      return;
    }
    if (!checkSummary()) {
      return;
    }
    if (!checkNumLessons()) {
      return;
    }
    if (!checkDateBegin()) {
      return;
    }
    if (!checkDateEnd()) {
      return;
    }
    if (!checkTeacher()) {
      return;
    }
    if (!checkTalents()) {
      return;
    }

    await createClass({
      title,
      summary,
      numLessons,
      dateBegin,
      dateEnd,
      teacher,
      talents:classTalents,
      user
    }).then(()=>{

        SuccessMessage("追加成功");
    }
    )
    .catch((err)=>{
        ErrorMessage("追加失敗");
        console.log(err);
    })

    
    ;
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
    if (numLessons === "") {
      ErrorMessage("numLessons cannot be empty");
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
    if (dateEnd === "") {
      ErrorMessage("dateEnd cannot be empty");
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

  if (currentUser.role !== 0) return <Navigate to="/" />;

  return (
    talents &&
    teachers && (
      <section className="signin">
        {<img className="wave" src={wave} alt="background" />}
        <div className="container">
          <div className="img">{<img src={bg} alt="background" />}</div>
          <div className="login-content">
            <form action="index.html">
              <h2 className="title">クラス追加</h2>

              <div className={`input-div one ${isTitleFocus ? "focus" : ""}`}>
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div ">
                  <h5 className={`${title ? "hidden" : ""}`}>クラスタイトル</h5>
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
                  />
                </div>
              </div>

              <div className={`input-div one ${isSummaryFocus ? "focus" : ""}`}>
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div ">
                  <h5 className={`${summary ? "hidden" : ""}`}>クラス内容</h5>
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
                  />
                </div>
              </div>

              <div
                className={`input-div one ${isNumLessonsFocus ? "focus" : ""}`}
              >
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div ">
                  <h5 className={`${numLessons ? "hidden" : ""}`}>授業数</h5>
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
                  />
                </div>
              </div>

              <div
                className={`input-div pass ${isDateBeginFocus ? "focus" : ""}`}
              >
                <div className="i">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="div ">
                  <h5 className={`${dateBegin ? "hidden" : ""}`}>開始日</h5>
                  <input
                    onChange={(e) => {
                      setDateBegin(e.target.value);
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
                  />
                </div>
              </div>

              <div
                className={`input-div pass ${isDateEndFocus ? "focus" : ""}`}
              >
                <div className="i">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="div ">
                  <h5 className={`${dateEnd ? "hidden" : ""}`}>終了日</h5>
                  <input
                    onChange={(e) => {
                      setDateEnd(e.target.value);
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
                  />
                </div>
              </div>

              <div
                className={`input-div pass ${isTeacherFocus} ? "focus" : ""}`}
              >
                <div className="i">
                  <i class="fas fa-users-cog"></i>
                </div>
                <div className="div ">
                  　<h5 className="hidden">教師</h5>
                  <select
                    name="teacher"
                    id="teacher"
                    defaultValue={"0"}
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
                      <option value={teacher.value}>{teacher.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Select
                isMulti
                options={talents}
                onChange={(options) => {
                  setClassTalents(options.map((option) => option.value));
                }}
              />
              <input
                onClick={(e) => {
                  e.preventDefault();
                  handleSignup();
                }}
                type="submit"
                className="btn"
                value="追加"
              />
            </form>
          </div>
        </div>
      </section>
    )
  );
}
