import "./App.scss";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./pages/Header/Header";
import Footer from "./pages/Footer/Footer";
import SignIn from "./pages/SignIn/SignIn";
import Home from "./pages/Home/Home";
import SignUp from "./pages/SignUp/SignUp";
import Attendance from "./pages/Attendance/Attendance";
import Evaluation from "./pages/Evaluation/Evaluation";
import Document from "./pages/Document/Document";
import RequireAuth from "./components/RequireAuth/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";

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
        </Routes>

        <Footer />
      </AuthProvider>
    </Router>
  );
}

export default App;
