import { signInWithEmailAndPassword, signOut } from "@firebase/auth";
import { collection, getDocs } from "@firebase/firestore";
import React, { useContext, useState, useEffect } from "react";
import {
  auth,
  db,
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
              case 1: //teacher
                classes = await getFirebaseItems("Classes");
                break;

              case 2: // talent
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
              default:
                break;
            }

            // Get classes 's teacher 's name
            const usersRef = (await getDocs(collection(db, "Users"))).docs;
            const users = usersRef.map((user) => user.data());
            const result = classes.map((kurasu) => {
              let teacherName = "";
              users.every((user) => {
                if (user.userID === kurasu.teacherID) {
                  teacherName = user.name;
                  return false;
                }
                return true;
              });

              return { ...kurasu, teacherName };
            });

            setClasses(result);
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
    setCurrentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {loading !== true && children}
    </AuthContext.Provider>
  );
}
