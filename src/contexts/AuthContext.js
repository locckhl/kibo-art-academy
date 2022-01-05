import { signInWithEmailAndPassword, signOut } from "@firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import {
  auth, getFirebaseItemWithCondition
} from "../lib/firebase";
import { ErrorMessage, SuccessMessage } from "../utils/toastify";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
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
          setLoading(false)
        }
      );
    });

    return unsubscribe;
  }, [setCurrentUser]);

  const value = {
    user,
    currentUser,
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
