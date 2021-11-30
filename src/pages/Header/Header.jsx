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
                <a href="/">ホーム</a>
              </dd>
              <dd>
                <a href="/signin">サイイン</a>
              </dd>
              <dd>
                <a href="/signup">アカウント追加</a>
              </dd>
            </dl>
          </div>
          <div className="header-user flex-1 ">
            <div className="flex justify-end ">
              <div className="mr-2">
               Ryo 先生
              </div>
              <div className="mr-2 flex items-center">
                <div className="btn">サインアウト</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
