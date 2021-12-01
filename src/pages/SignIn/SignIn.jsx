import React, { useState } from "react";

import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { useLocation, useNavigate } from "react-router";

export default function SignIn({ logIn }) {
  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);

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

  const handleLogin = () => {
    // clearInput();
    clearError();
    // const auth = getAuth();
    logIn(email, password)
      .then(() => {
        window.localStorage.setItem("user", "true");
        SuccessMessage("サイイン成功");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
          case "auth/user-not-found":
            ErrorMessage("User not found");
            break;
          case "auth/wrong-password":
            ErrorMessage("Wrong password entered");
            break;
          default:
            ErrorMessage("Something went wrong");
        }
      });
  };

  return (
    <div className="signin">
      <div className="container">
        <div className="img">{/* <img src="img/bg.svg" /> */}</div>
        <div className="login-content">
          <form>
            <h2 className="title">ようこそ</h2>
            <div className={`input-div one ${isUsrFocus ? "focus" : ""}`}>
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
                    setIsUsrFocus(true);
                  }}
                  onBlur={() => {
                    setIsUsrFocus(false);
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
            <p className="errorMsg">{passwordError}</p>
            <input
              onClick={(e) => {
                e.preventDefault();
                handleLogin();
              }}
              type="submit"
              className="btn"
              value="サイイン"
            />
          </form>
        </div>
      </div>
    </div>
  );
}
