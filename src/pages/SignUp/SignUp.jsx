import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { auth, db, getFirebaseItems } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router";
import Select from "react-select";
import { getClassesLesson } from "../../lib/attendance";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";

export default function SignUp() {
  console.log("SignUp");
  const { currentUser, user } = useAuth();
  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isMailFocus, setIsMailFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [isRoleFocus, setIsRoleFocus] = useState(false);
  const [isClassFocus, setIsClassFocus] = useState(false);
  const [classes, setClasses] = useState([]);
  // const [isConfirmPassFocus, setIsConfirmPassFocus] = useState(false);

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  //  classes of talent after create account
  const [newClasses, setNewClasses] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!checkUserNameValidation()) {
      return;
    }
    if (!checkRoleValidation()) {
      return;
    }
    if (!checkPassValidation()) {
      return;
    }
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (data) => {
        // Add user to collection users
        await setDoc(doc(db, "Users", email), {
          email: email,
          name: userName,
          role: role,
          userID: data.user.uid,
        });

        //If users is talent add talent to classes
        if (parseInt(role) === 2 && newClasses.length !== 0) {
          // Each class add talent
          const promises = newClasses.map(async (classu) => {
            const lessons = await getClassesLesson(classu);

            const talentIDs = await getFirebaseItems(
              "Classes",
              classu,
              "ClassTalents"
            );
            const ref = doc(
              db,
              `/Classes/${classu}/ClassTalents/${talentIDs[0].id}`
            );

            await updateDoc(ref, {
              talentIDs: arrayUnion(data.user.uid),
            });

            // Update number of talents in class

            const classRef = doc(db, `/Classes/${classu}`);
            const oldClass = await (await getDoc(classRef)).data();
            const numTalents = oldClass.numTalents;

            await updateDoc(classRef, {
              numTalents: parseInt(numTalents) + 1,
            });

            // Each class lesson add achivements
            const promises2 = lessons.map(async (lesson) => {
              await setDoc(
                doc(
                  db,
                  `/Classes/${classu}/ClassLessons/${lesson.id}/Achievements`,
                  email
                ),
                {
                  score: 0,
                  talentID: data.user.uid,
                }
              );
            });

            // Each class lesson add  attendance
            const promises3 = lessons.map(async (lesson) => {
              await setDoc(
                doc(
                  db,
                  `/Classes/${classu}/ClassLessons/${lesson.id}/Attendances`,
                  email
                ),
                {
                  status: false,
                  talentID: data.user.uid,
                }
              );
            });

            await Promise.all(promises2);
            await Promise.all(promises3);
          });

          await Promise.all(promises);
        }

        SuccessMessage("登録成功");

        await auth.updateCurrentUser(user);
        // setTimeout(function () {
        window.location.href = "/";
        // }, 1000);
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            ErrorMessage("すでに使用中のメール");
            break;
          case "auth/missing-email":
            ErrorMessage("メールがありません");
            break;
          case "auth/invalid-email":
            ErrorMessage("無効なメール");
            break;
          case "auth/weak-password":
            ErrorMessage("弱いパスワード");
            break;
          default:
            ErrorMessage(err);
            console.log(JSON.stringify(err, null, 2));
        }
      });
  };

  //confirm password for future feature?
  // const checkConfirmPassValidation = (e) => {
  //   const confirmPassword = e.target.value;
  //   if (password !== confirmPassword) {
  //     ErrorMessage("Confirm Password should be match with password");
  //   } else {
  //     SuccessMessage("Matched");
  //     setConfirmPassword(confirmPassword);
  //   }
  // };

  //valid password
  const checkPassValidation = () => {
    if (password.length < 8 || password.length > 20) {
      ErrorMessage(
        "パスワードは8文字以上20文字未満である必要があります"
      );
      return false;
    }
    return true;
  };

  //valid special characters in username
  const checkUserNameValidation = () => {
    const special = ["<", ">", "/", "|", ":", "*", "?", '"', "\\"];
    //remove extra spaces in userName
    setUserName((oldUsername) => oldUsername.replace(/\s+/g, " ").trim());
    //check if userName is empty?
    if (userName === "") {
      ErrorMessage("ユーザーネームを空にすることはできません");
      return false;
    }
    for (let i = 0; i < special.length; i++) {
      if (userName.includes(special[i])) {
        ErrorMessage("特殊文字は使用できません");
        return false;
      }
    }
    return true;
  };

  const checkRoleValidation = () => {
    if (role === "") {
      ErrorMessage("ロール(役割)を空にすることはできません");
      return false;
    }
    return true;
  };

  //Select Role - Select onchange
  const handleRole = (e) => {
    setRole(parseInt(e.target.value));
  };

  const getClasses = async () => {
    const classesRes = await getFirebaseItems("Classes");
    const temp = classesRes.map((classu) => {
      return { value: classu.id, label: classu.className };
    });
    setClasses(temp);
  };

  useEffect(async () => {
    getClasses();
  }, []);

  if (currentUser.role !== 0) return <Navigate to="/" />;

  return (
    <section className="signin">
      {<img className="wave" src={wave} alt="background" />}
      <div className="container">
        <div className="img">{<img src={bg} alt="background" />}</div>
        <div className="login-content">
          <form action="index.html">
            <h2 className="title">アカウント追加</h2>
            <div className={`input-div one ${isUsrFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div ">
                <h5 className={`${userName ? "hidden" : ""}`}>
                  ユーザーネーム
                </h5>
                <input
                  onChange={(e) => {
                    setUserName(e.target.value);
                  }}
                  type="text"
                  className="input"
                  required
                  onFocus={() => {
                    setIsUsrFocus(true);
                  }}
                  onBlur={() => {
                    setIsUsrFocus(false);
                  }}
                  name="name"
                />
              </div>
            </div>
            <div className={`input-div pass ${isRoleFocus ? "focus" : ""}`}>
              <div className="i">
                <i class="fas fa-users-cog"></i>
              </div>
              <div className="div ">
                　<h5 className="hidden">役割</h5>
                <select
                  name="role"
                  id="role"
                  defaultValue={"0"}
                  onFocus={() => {
                    setIsRoleFocus(true);
                  }}
                  onBlur={() => {
                    setIsRoleFocus(false);
                  }}
                  onChange={handleRole}
                >
                  <option value="0" disabled>
                    役割
                  </option>
                  <option value="2">タレント</option>
                  <option value="1">先生</option>
                </select>
              </div>
            </div>

            {role === 2 ? (
              <Select
                isMulti
                options={classes}
                onChange={(options) => {
                  setNewClasses(options.map((option) => option.value));
                }}
              />
            ) : (
              ""
            )}

            <div className={`input-div pass ${isMailFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="div ">
                <h5 className={`${email ? "hidden" : ""}`}>メール</h5>
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  type="email"
                  className="input"
                  required
                  onFocus={() => {
                    setIsMailFocus(true);
                  }}
                  onBlur={() => {
                    setIsMailFocus(false);
                  }}
                  name="email"
                />
              </div>
            </div>
            <div className={`input-div pass ${isPassFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5 className={`${password ? "hidden" : ""}`}>パスワード</h5>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type="password"
                  className="input"
                  required
                  onFocus={() => {
                    setIsPassFocus(true);
                  }}
                  onBlur={() => {
                    setIsPassFocus(false);
                  }}
                  name="password"
                />
              </div>
            </div>
            {/* <div className={`input-div pass ${isConfirmPassFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <h5 className={`${confirmPassword ? "hidden" : ""}`}>パスワード認証</h5>
                <input
                  onChange={(e) => {
                    checkConfirmPassValidation(e);
                  }}
                  type="password"
                  className="input"
                  required
                  onFocus={() => {
                    setIsConfirmPassFocus(true);
                  }}
                  onBlur={() => {
                    setIsConfirmPassFocus(false);
                  }}
                />
              </div>
            </div> */}
            {/* <a href="#">Forgot Password?</a> */}
            <input
              onClick={(e) => {
                e.preventDefault();
                handleSignup();
              }}
              type="submit"
              className="btn"
              value="登録"
            />
          </form>
        </div>
      </div>
    </section>
  );
}
