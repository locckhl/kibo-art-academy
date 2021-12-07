import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { auth, db } from "../../lib/firebase";
import { useAuth } from "../../contexts/AuthContext";
import { Navigate } from "react-router";

export default function SignUp() {
  console.log("SignUp");
  const { currentUser, user } = useAuth();
  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isMailFocus, setIsMailFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [isRoleFocus, setIsRoleFocus] = useState(false);
  // const [isConfirmPassFocus, setIsConfirmPassFocus] = useState(false);

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = () => {
    if (!checkUserNameValidation()) {
      return;
    }
    if (!checkRoleValidation()) {
      return;
    }
    if (!checkPassValidation()) {
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((data) => {
        console.log(data.user.uid);
        SuccessMessage("登録成功");
        setDoc(doc(db, "Users", email), {
          email: email,
          name: userName,
          role: role,
          userID: data.user.uid,
        });
        // window.location.href = "/";
        auth.updateCurrentUser(user)
        setTimeout(function () {
          window.location.href = "/";
        }, 1000);
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            ErrorMessage("Email already in use");
            break;
          case "auth/missing-email":
            ErrorMessage("Missing email");
            break;
          case "auth/invalid-email":
            ErrorMessage("Invalid email");
            break;
          case "auth/weak-password":
            ErrorMessage("Weak password");
            break;
          default:
            ErrorMessage("Something went wrong");
            console.log(JSON.stringify(err, null, 2));
        }
      });
    // window.location.href = "/";
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
        "Password must have more than 8 characters and less than 20 characters"
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
      ErrorMessage("Username cannot be empty");
      return false;
    }
    for (let i = 0; i < special.length; i++) {
      if (userName.includes(special[i])) {
        ErrorMessage("Special characters are not allowed");
        return false;
      }
    }
    return true;
  };

  const checkRoleValidation = () => {
    if (role === "") {
      ErrorMessage("Role cannot be empty");
      return false;
    }
    return true;
  };

  //Select Role - Radio button onchange
  const handleRole = (e) => {
    setRole(parseInt(e.target.value));
  };

  if (currentUser.role !== 0) return <Navigate to="/" />;

  return (
    <div className="signin">
      <div className="container">
        <div className="img">{/* <img src="img/bg.svg" /> */}</div>
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
                />
              </div>
            </div>
            <div className={`input-div pass ${isRoleFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div ">
                <h5>Role</h5>
                <div>
                  <div>
                    <input
                      type="radio"
                      value={2}
                      name="role"
                      onChange={handleRole}
                    />{" "}
                    Student
                  </div>
                  <div>
                    <input
                      type="radio"
                      value={1}
                      name="role"
                      onChange={handleRole}
                    />{" "}
                    Teacher
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
}
