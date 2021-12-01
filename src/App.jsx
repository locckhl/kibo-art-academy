import "./App.scss";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Attendance from "./pages/Attendance/Attendance";
import Evaluation from "./pages/Evaluation/Evaluation";
import Document from "./pages/Document/Document";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "./lib/firebase";
import { SuccessMessage, ErrorMessage } from "../src/utils/toastify";
import RequireAuth from "./components/RequireAuth/RequireAuth";

function App() {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        window.localStorage.setItem("user", "true");
        setIsLoggedIn("true");
      } else {
        setUser(null);
        window.localStorage.setItem("user", "false");
        setIsLoggedIn("false");
      }
    });
  };

  useEffect(() => {
    authListener();
  }, [user]);

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password).then((user) => {
      setUser(user)
    });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        SuccessMessage("サインアウトしました");
      })
      .catch((error) => {
        ErrorMessage(error);
      });
  };

  return (
    <Router>
      {/* 
      {window.location.pathname !== "/signin" && (
        <Header {...{ user, handleLogout }} />
      )} */}

      <Header {...{ isLoggedIn: isLoggedIn, handleLogout }} />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth >
              <Home user={user} />
            </RequireAuth>
          }
        ></Route>

        <Route
          path="/signup"
          element={
            <RequireAuth >
              <SignUp  />
            </RequireAuth>
          }
        ></Route>

        <Route
          path="/signin"
          element={
            isLoggedIn === "true" ? (
              <Navigate replace to="/" />
            ) : (
              <SignIn logIn={logIn} />
            )
          }
        ></Route>

        <Route
          path="/attendance/:classId"
          element={
            <RequireAuth >
              <Attendance user={user} />
            </RequireAuth>
          }
        ></Route>

        <Route
          path="/evaluation/:classId"
          element={
            <RequireAuth >
              <Evaluation user={user} />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/document/:classId"
          element={
            <RequireAuth >
              <Document user={user} />
            </RequireAuth>
          }
        ></Route>
      </Routes>

      {window.location.pathname !== "/signin" && <Footer />}
    </Router>
  );
}

export default App;
