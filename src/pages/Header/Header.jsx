import React from "react";
import "./index.scss";
import logo from "../../assets/images/logo.png";
// import SignIn from "../../components/SignIn/SignIn";

export default function Header() {


  return (
    <header>
      <div className="container px-10 mx-auto">
        <div className="flex items-center header-content">
          <div className="header-logo">
            <div>
              <a href="/">
                <img src={logo} alt="" />
              </a>
            </div>
          </div>
          <div className="header-navbar ">
            <dl className="flex text-xl">
              <dd>
                <a href="/">HOME</a>
              </dd>
              <dd>
                <a href="/signin">SIGN IN</a>
              </dd>
              <dd>
                <a href="/signup">SIGN UP</a>
              </dd>
            </dl>
          </div>
          <div className="header-user flex-1 ">
            <div className="flex justify-end ">
              <div className="mr-2">
               Ryo sensei
              </div>
              <div className="mr-2 flex items-center">
                <div className="btn">Sign out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
