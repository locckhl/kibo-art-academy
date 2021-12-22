import React, { useState } from "react";
import defaultAvatar from "../../assets/images/user.png";
import ProfileEdit from "../../components/ProfileEdit/ProfileEdit";
import { useAuth } from "../../contexts/AuthContext";
import "./index.scss";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  return (
    <div className="container mt-32 flex flex-col">
      <ProfileEdit open={open} setOpen={setOpen} />
      <div className="profile-header text-center text-3xl">
        <b>プロフィール</b>
      </div>
      <div className="profile-content flex mt-16 gap-10">
        <div className="profile-content__left w-1/2">
          <div className="flex flex-col float-right">
            <div className="avatar ">
              <div className="avatar-container">
                <img src={defaultAvatar} alt="" />
              </div>
            </div>

            {currentUser.role === 2 && (
              <div className="edit-btn">
                <div
                  className="btn"
                  onClick={() => {
                    setOpen(true);
                  }}
                >
                  プロフィール編集
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="profile-content__right w-1/2 leading-10">
          <div>
            <b>名前:</b>　ABC
          </div>
          <div>
            <b>メール:</b> abc@gmail.com
          </div>
          <div>
            <b>受講科目「クラス名」</b>
          </div>
          <ul>
            <li>ポップ</li>
            <li>ダンダンス</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
