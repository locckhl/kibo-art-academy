import React from "react";
import "./index.scss";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  console.log("Header");
  const { currentUser, logOut } = useAuth();
  return (
    currentUser && (
      <header>
        <div className="container px-10 mx-auto">
          <div className="flex items-center header-content">
            <div className="header-logo">
              <div>
                <Link to="/">
                  <img src={logo} alt="" />
                </Link>
              </div>
            </div>
            <div className="header-navbar ">
              <dl className="flex text-xl">
                <dd>
                  <Link to="/">ホーム</Link>
                </dd>
                <dd>
                {currentUser.role === 0 ? (<Link to="/signup">アカウント追加</Link>) : ""}
                </dd>
              </dl>
            </div>
            <div className="header-user flex-1 ">
              <div className="flex justify-end ">
                <div className="mr-2">
                  {currentUser.name}
                  {currentUser.role === 0 ? " ( 管理者 )" : ""}
                  {currentUser.role === 1 ? " ( 先生 )" : ""}
                  {currentUser.role === 2 ? " ( タレント ) " : ""}
                </div>
                <div className="mr-2 flex items-center">
                  {currentUser ? (
                    <div
                      onClick={(e) => {
                        e.preventDefault();
                        logOut();
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
