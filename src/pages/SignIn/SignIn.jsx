import React, { useState } from "react";

import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";

export default function SignIn() {
  console.log("SignIn");
  const { currentUser, logIn } = useAuth();
  let navigate = useNavigate();
  let location = useLocation();
  let from = location.state?.from?.pathname || "/";

  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const clearInput = () => {
    setEmail("");
    setPassword("");
  };

  if(currentUser) return <Navigate to="/"/>; 

  const handleLogin = () => {
    // clearInput();
    // const auth = getAuth();
    logIn(email, password)
      .then(() => {
        SuccessMessage("サイイン成功");
        navigate(from, { replace: true });
      })
      .catch((err) => {
        switch (err.code) {
          case "auth/invalid-email":
            ErrorMessage("Invalid email");
            break;
          case "auth/user-not-found":
            ErrorMessage("User not found");
            break;
          case "auth/wrong-password":
            ErrorMessage("Wrong password entered");
            break;
          default:
            ErrorMessage("Password cannot be empty");
            console.log(err.message)
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
