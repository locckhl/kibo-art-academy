import React from "react";
import "./index.scss";
import logo from "../../assets/images/logo.png";

export default function Header({ handleLogout }) {
  const user = window.localStorage.getItem("user");
  return (
    user === "true" && (
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
                  <a href="/signup">アカウント追加</a>
                </dd>
              </dl>
            </div>
            <div className="header-user flex-1 ">
              <div className="flex justify-end ">
                <div className="mr-2">Ryo 先生</div>
                <div className="mr-2 flex items-center">
                  {user ? (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        handleLogout();
                      }}
                      className="btn"
                    >
                      サインアウト
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  );
}
