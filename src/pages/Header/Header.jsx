import React from "react";
import "./index.scss";
import logo from "../../assets/images/logo.png";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export default function Header() {
  console.log("Header");
  const { currentUser, logOut } = useAuth();
  return (
    currentUser &&
    Object.keys(currentUser).length !== 0 && (
      <header>
        <div className="container px-10 mx-auto">
          <div className="flex flex-col md:flex-row items-center header-content">
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
                {currentUser.role === 0 ? (
                  <>
                    <dd>
                      <Link to="/signup">アカウント追加</Link>
                    </dd>
                    <dd>
                      <Link to="/addClass">クラス追加</Link>
                    </dd>
                  </>
                ) : (
                  ""
                )}
              </dl>
            </div>
            <div className="header-user flex-1 ">
              <div className="flex justify-end ">
                <div className="mr-2 cursor-pointer">
                  {currentUser.role === 0
                    ? ` ${currentUser.name} ( 管理者 )`
                    : ""}
                  {currentUser.role === 1
                    ? ` ${currentUser.name} ( 先生 )`
                    : ""}
                  {currentUser.role === 2 ? (
                    <Link to={`/profile/${currentUser.userID}`}>
                      {currentUser.name} ( タレント )
                    </Link>
                  ) : (
                    ""
                  )}
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
