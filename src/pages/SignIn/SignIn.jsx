import React, { useState } from "react";

import "./index.scss";
import { ErrorMessage, SuccessMessage } from "../../utils/toastify";
import { Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import wave from "../../assets/images/wave.png";
import bg from "../../assets/images/bg.svg";

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
            ErrorMessage("無効なメール");
            break;
          case "auth/user-not-found":
            ErrorMessage("ユーザーが見つかりません");
            break;
          case "auth/wrong-password":
            ErrorMessage("パスワードを間違って入力しました。");
            break;
          default:
            ErrorMessage("パスワードを空にすることはできません");
            console.log(err.message);
        }
      });
  };

  // Authorized user
  if (currentUser && Object.keys(currentUser).length !== 0)
    return <Navigate to="/" />;

  // Unauthorized user
  return (
    <section className="signin">
      {<img className="wave" src={wave} alt="background" />}
      <div className="container">
        <div className="img">{<img src={bg} alt="background" />}</div>
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
    </section>
  );
}
