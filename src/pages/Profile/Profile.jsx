import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from "@firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import defaultAvatar from "../../assets/images/user.png";
import ProfileEdit from "../../components/ProfileEdit/ProfileEdit";
import { useAuth } from "../../contexts/AuthContext";
import {
  auth,
  db,
  getFirebaseItems,
  getFirebaseItemWithCondition,
  updateItemFireBase,
  uploadImage,
} from "../../lib/firebase";
import { ErrorMessage } from "../../utils/toastify";
import "./index.scss";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { currentUser } = useAuth();
  const [talent, setTalent] = useState(null);
  const [classes, setClasses] = useState(null);
  const { userId: talentId } = useParams();

  const checkCurrentPass = async (oldPass) => {
    let result = true;
    try {
      console.log(auth.currentUser.email, oldPass);
      const response = await reauthenticateWithCredential(
        auth.currentUser,
        EmailAuthProvider.credential(auth.currentUser.email, oldPass)
      );
      console.log(response, "response");
    } catch (error) {
      switch (error.code) {
        case "auth/wrong-password":
          ErrorMessage("現在のパスワードを間違って入力しました。");
          result = false;
          break;
        default:
          ErrorMessage("パスワード編集失敗");
          console.log(error.message);
          result = false;
      }
    }
    return result;
  };

  const onSubmit = async (data, callback) => {
    const { password, cfPassword, valueInputFile, oldPass } = data;
    let url = "";
    let newData = currentUser;
    if (valueInputFile) {
      url = await uploadImage("talent", valueInputFile);
      const isSuccess = await updateItemFireBase(
        { ...newData, imageUrl: url },
        "Users",
        currentUser.id
      );
      if (isSuccess) {
        toast.success("アバター編集ト成功");
        setTalent({ ...talent, imageUrl: url });
      } else {
        toast.error("エラー");
      }
      callback(null);
    }

    if (password && cfPassword) {
      if (!(await checkCurrentPass(oldPass))) return;
      if (password === cfPassword) {
        try {
          const user = getAuth();
          await updatePassword(user.currentUser, password);
          await setDoc(
            doc(db, "Users", user.currentUser.email),
            { password: password },
            { merge: true }
          );

          toast.success("パスワード編集成功");
        } catch (error) {
          switch (error.code) {
            default:
              ErrorMessage("パスワード編集失敗");
              console.log(error.message);
          }
        }
      } else {
        toast.error("エラー");
      }
    }
    setOpen(false);
  };

  const getTalentData = async () => {
    const talentRes = await getFirebaseItemWithCondition("Users", [
      "userID",
      "==",
      talentId,
    ]);
    setTalent(talentRes);

    let classes = [];

    const classList = await getFirebaseItems("Classes");
    for (let i = 0; i < classList.length; i++) {
      let tmp = await getFirebaseItems(
        "Classes",
        classList[i].id,
        "ClassTalents"
      );
      tmp = tmp[0]?.talentIDs;
      const index = tmp.findIndex((item) => item === talentId);
      if (index > -1) {
        classes.push(classList[i]);
      }
    }

    setClasses(classes);
  };

  useEffect(() => {
    getTalentData();
  }, []);

  return (
    <div className="container mt-32 flex flex-col">
      {talent && (
        <ProfileEdit
          data={talent}
          open={open}
          setOpen={setOpen}
          onUpdate={onSubmit}
        />
      )}
      <div className="profile-header text-center text-3xl">
        <b>プロフィール</b>
      </div>

      {talent && classes ? (
        <div className="profile-content flex mt-16 gap-10">
          <div className="profile-content__left w-1/2">
            <div className="flex flex-col float-right">
              <div className="avatar ">
                <div className="avatar-container">
                  <img src={talent?.imageUrl || defaultAvatar} alt="" />
                </div>
              </div>
              <br />
              {currentUser.role === 2 && currentUser.userID === talentId && (
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
              <b>名前: </b>
              {talent?.name}
            </div>
            <div>
              <b>メール: </b> {talent?.email}
            </div>
            <div className="flex">
              <div>
                <b>受講科目「クラス名」</b>
              </div>

              <ul className="ml-5 mt-7">
                {classes.map((item, idx) => (
                  <li key={idx} style={{ listStyle: "initial" }}>
                    {item.className}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <Skeleton
          count={15}
          width="50%"
          style={{ transform: "translateX(50%)" }}
        />
      )}
    </div>
  );
}
