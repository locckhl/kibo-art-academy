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
  const isLoggedIn = window.localStorage.getItem("user");

  const authListener = () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        window.localStorage.setItem("user", "true");
      } else {
        setUser(null);
        window.localStorage.setItem("user", "false");
      }
    });
  };

  useEffect(() => {
    authListener();
  }, [user]);

  const logIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        window.localStorage.setItem("user", "false");
        SuccessMessage("サインアウトしました");
        window.location.href = "/";
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

      <Header {...{ user, handleLogout }} />
      <Routes>
        <Route
          path="/"
          element={
            <RequireAuth user={user}>
              <Home />
            </RequireAuth>
          }
        ></Route>

        <Route
          path="/signup"
          element={
            <RequireAuth user={user}>
              <SignUp />
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
            <RequireAuth user={user}>
              <Attendance />
            </RequireAuth>
          }
        ></Route>

        <Route
          path="/evaluation/:classId"
          element={
            <RequireAuth user={user}>
              <Evaluation />
            </RequireAuth>
          }
        ></Route>
        <Route
          path="/document/:classId"
          element={
            <RequireAuth user={user}>
              <Document />
            </RequireAuth>
          }
        ></Route>
      </Routes>

      {window.location.pathname !== "/signin" && <Footer />}
    </Router>
  );
}

export default App;
