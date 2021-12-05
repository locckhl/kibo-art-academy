import { signInWithEmailAndPassword, signOut } from "@firebase/auth";
import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  getFirebaseItems,
  getFirebaseItemsWithCondition,
  getFirebaseItemWithCondition,
} from "../lib/firebase";
import { ErrorMessage, SuccessMessage } from "../utils/toastify";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [classes, setClasses] = useState(null);
  const [loading, setLoading] = useState(true);

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        setCurrentUser(null);
        SuccessMessage("サインアウトしました");
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth");
      setUser(user);
      getFirebaseItemWithCondition("Users", ["userID", "==", user?.uid]).then(
        (userInfo) => {
          setCurrentUser(userInfo);

          // Get classes
          (async function () {
            let classes = [];
            switch (parseInt(userInfo.role)) {
              case 0: //admin
                classes = await getFirebaseItems("Classes");
                break;
              case 1: //teacher
                classes = await getFirebaseItemsWithCondition("Classes", [
                  "teacherID",
                  "==",
                  userInfo.userID,
                ]);
                break;
              default:
                //students
                console.log("nani");
                const classList = await getFirebaseItems("Classes");
                for (let i = 0; i < classList.length; i++) {
                  let tmp = await getFirebaseItems(
                    "Classes",
                    classList[i].id,
                    "ClassTalents"
                  );
                  tmp = tmp[0]?.talentIDs;
                  const index = tmp.findIndex(
                    (item) => item === userInfo.userID
                  );
                  if (index > -1) {
                    classes.push(classList[i]);
                  }
                }
                break;
            }
            setClasses(classes);
            setLoading(false);
          })();
        }
      );
    });

    return unsubscribe;
  }, [setCurrentUser]);

  const value = {
    user,
    currentUser,
    classes,
    logIn,
    logOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading !== true && children}
    </AuthContext.Provider>
  );
}