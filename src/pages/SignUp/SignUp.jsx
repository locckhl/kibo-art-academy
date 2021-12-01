import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { auth } from "../../lib/firebase";

export default function SignUp() {
  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isMailFocus, setIsMailFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);

  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

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
          case "auth/invalid-email":
            ErrorMessage(err.message);
            break;
          case "auth/weak-password":
            ErrorMessage(err.message);
            break;
          default:
            ErrorMessage(err.message);
        }
      });
  };

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
            <div className={`input-div pass ${isMailFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-user"></i>
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
