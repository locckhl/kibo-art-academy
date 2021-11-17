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

function App() {
  return (
    <Router>
      {window.location.pathname !== "/signin" && <Header />}

      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/signup" element={<SignUp />}></Route>
        <Route path="/signin" element={<SignIn />}></Route>
        <Route path="/attendance/:classId" element={<Attendance />}></Route>
        <Route path="/evaluation/:classId" element={<Evaluation />}></Route>
        <Route path="/document/:classId" element={<Document />}></Route>
      </Routes>

      {window.location.pathname !== "/signin" && <Footer />}
    </Router>
  );
}

export default App;
