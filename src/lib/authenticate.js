import react from "react";
import { getAuth,signOut } from "@firebase/auth";

export const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
}