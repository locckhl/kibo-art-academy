import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.scss";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";
import Attendance from "./pages/Attendance/Attendance";
import Document from "./pages/Document/Document";
import Evaluation from "./pages/Evaluation/Evaluation";
import Footer from "./pages/Footer/Footer";
import Header from "./pages/Header/Header";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import "react-loading-skeleton/dist/skeleton.css";
import ClassDetail from "./pages/ClassDetail/ClassDetail";
import AddClass from "./pages/AddClass/AddClass";

function App() {
  return (
    <Router>
      {/* 
      {window.location.pathname !== "/signin" && (
        <Header {...{ user, handleLogout }} />
      )} */}
      <AuthProvider>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="/signup"
            element={
              <RequireAuth>
                <SignUp />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="/signin"
            // element={
            //   currentUser ? (
            //     <Navigate replace to="/" />
            //   ) : (
            //     <SignIn logIn={logIn} />
            //   )
            // }
            element={<SignIn />}
          ></Route>

          <Route
            path="/attendance/:classId"
            element={
              <RequireAuth>
                <Attendance />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="/evaluation/:classId"
            element={
              <RequireAuth>
                <Evaluation />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/document/:classId"
            element={
              <RequireAuth>
                <Document />
              </RequireAuth>
            }
          ></Route>
          <Route
            path="/profile/:userId"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="/classDetail/:classId"
            element={
              <RequireAuth>
                <ClassDetail />
              </RequireAuth>
            }
          ></Route>

          <Route
            path="/addClass"
            element={
              <RequireAuth>
                <AddClass />
              </RequireAuth>
            }
          ></Route>
        </Routes>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
