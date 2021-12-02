import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { auth } from "../../lib/firebase";

export default function SignUp() {
  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isMailFocus, setIsMailFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);
  const [isRoleFocus, setIsRoleFocus] = useState(false);
  const [isConfirmPassFocus, setIsConfirmPassFocus] = useState(false);

  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState(true);

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  const clearError = () => {
    setEmailError("");
    setPasswordError("");
  };

  const handleSignup = () => {
    clearError();
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        SuccessMessage("登録成功");
        window.location.href = "/";
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/email-already-in-use":
            ErrorMessage("Email already in use");
            break;
          case "auth/invalid-email":
            ErrorMessage("Invalid email");
            break;
          case "auth/weak-password":
            ErrorMessage("Weak password");
            break;
            case "auth/internal-error":
              ErrorMessage("Password must have more than 8 characters and less than 20 characters");
              break;
          default:
            ErrorMessage(err.message);
        }
      });
  };

  //confirm password for future feature?
  const checkConfirmPassValidation = (e) => {
    const confirmPassword = e.target.value; 
    if (password != confirmPassword) {
      ErrorMessage("Confirm Password should be match with password");
    } else {
      SuccessMessage("Matched");
      setConfirmPassword(confirmPassword);
    }
  }

  //valid password
  const checkPassValidation = (e) => {
    const password = e.target.value;
    if (password.length >= 8 && password.length < 20) {
        setPassword(password);
    }
  }

  //valid special characters in username
  const checkUserNameValidation = (e) => {
    const userName = e.target.value;
    const special = ["<", ">", "/", "|", ":", "*", "?", '"',"\\"];
    let result = false;
    for (let i=0; i<special.length; i++) {
      if (userName.includes(special[i])) {
         result = true;
         break;
      }
    }
    if (result === true) {
      ErrorMessage("Special characters are not allowed");
    } else {
      setUserName(userName);
    }
  }

  //Select Role - Radio button onchange
  const handleRole = (e) => {
    setRole(e.target.value);
  }

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
                    checkUserNameValidation(e);
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
                    <input type="radio" value="student" name="role" onChange={handleRole}/> Student
                  </div>
                  <div>
                    <input type="radio" value="teacher" name="role" onChange={handleRole}/> Teacher
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
                    checkPassValidation(e);
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
