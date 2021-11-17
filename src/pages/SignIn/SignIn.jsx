import React, { useState } from "react";
import "./index.scss";

export default function SignIn() {
  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);

  return (
    <div className="signin">
      <div className="container">
        <div className="img">{/* <img src="img/bg.svg" /> */}</div>
        <div className="login-content">
          <form action="index.html">
            <h2 className="title">Welcome</h2>
            <div className={`input-div one ${isUsrFocus ? "focus" : ""}`}>
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div ">
                <h5>Username</h5>
                <input
                  type="text"
                  className="input "
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
                <h5>Password</h5>
                <input
                  type="password"
                  className="input"
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
            <input type="submit" className="btn" value="Login" />
          </form>
        </div>
      </div>
    </div>
  );
}
