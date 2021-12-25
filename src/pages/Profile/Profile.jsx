import React, { useState } from "react";
import defaultAvatar from "../../assets/images/user.png";
import ProfileEdit from "../../components/ProfileEdit/ProfileEdit";
import { useAuth } from "../../contexts/AuthContext";
import "./index.scss";
import { updateItemFireBase, uploadImage } from "../../lib/firebase";
import { toast } from "react-toastify";
import { getAuth, updatePassword } from "@firebase/auth"

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { currentUser, classes, setCurrentUser } = useAuth();
  const onSubmit = async(data, callback) => {
    const {password, cfPassword, valueInputFile} = data;
    let url = "";
    let newData = currentUser;
    if(valueInputFile) {
      url = await uploadImage("talent", valueInputFile);
      const isSuccess = await updateItemFireBase({...newData, imageUrl: url}, "Users", currentUser.id);
      if (isSuccess) {
        toast.success("Upload Image Success")
        setCurrentUser({...currentUser, imageUrl: url})
      }else {
        toast.error("Error");
      }
      callback(null);
    }
    if (password && cfPassword){
      if (password === cfPassword){
        try {
          const user = await getAuth() 
          await updatePassword(user.currentUser, password);
          toast.success("Update Password Success");
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error("error")
      }
    }
    setOpen(false);
  }
  return (
    <div className="container mt-32 flex flex-col">
      <ProfileEdit data={currentUser} open={open} setOpen={setOpen} onUpdate={onSubmit}/>
      <div className="profile-header text-center text-3xl">
        <b>プロフィール</b>
      </div>
      <div className="profile-content flex mt-16 gap-10">
        <div className="profile-content__left w-1/2">
          <div className="flex flex-col float-right">
            <div className="avatar ">
              <div className="avatar-container">
                <img src={currentUser?.imageUrl || defaultAvatar} alt="" />
              </div>
            </div>
            <br />
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
            <b>名前: </b>{currentUser?.name}
          </div>
          <div>
            <b>メール: </b> {currentUser?.email}
          </div>
          <div>
            <b>受講科目「クラス名」</b>
          </div>
          <ul>
            {classes.map((item, idx)=>
              <li key={idx}>{item.className}</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
