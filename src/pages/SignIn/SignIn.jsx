import React, { useEffect, useState } from "react";
import Home from '../Home/Home';
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut} from "firebase/auth";
import { auth } from '../../lib/firebase';
import App from '../../App';
import "./index.scss";

export default function SignIn() {
  const [isUsrFocus, setIsUsrFocus] = useState(false);
  const [isPassFocus, setIsPassFocus] = useState(false);
  
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const clearInput = () => {
    setEmail('');
    setPassword('');
  }

  const clearError = () => {
    setEmailError('');
    setPasswordError('');
  }

  const handleLogin = () => {
    clearError();
    // const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
    .catch(err => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-not-found":
            setEmailError('User not found');
            break;
          case "auth/wrong-password":
            setPasswordError('Wrong password entered');
            break;
        }
      })
  }

  const handleLogout = () => {
    // const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
  }
    
  const authListener = () => {
    // const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        clearInput();
        setUser(user);
      } else {
        setUser("");
      }
    });
  }

  useEffect(() => {
    authListener();
  }, [user]);

  if (user) {
    return (
      <div>
        <header>
        <div className="container px-10 mx-auto">
        <div className="flex items-center header-content">
          <div className="header-logo">
            <div>
              <a href="/">
                <img src={logo} alt="" />
              </a>
            </div>
          </div>
          <div className="header-navbar ">
            <dl className="flex text-xl">
              <dd>
                <a href="/">HOME</a>
              </dd>
            </dl>
          </div>
          <div className="header-user flex-1 ">
            <div className="flex justify-end ">
              <div className="mr-2">
               Ryo sensei
              </div>
              <div className="mr-2 flex items-center">
                <div onClick={(e) => {e.preventDefault();handleLogout()}} className="btn">Sign out</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </header>
      <Routes>
        <Route path="/" element={<Home />}></Route>
      </Routes>
      </div>
  )
  } else {
    return (
      <div className="signin">
        <div className="container">
          <div className="img">{/* <img src="img/bg.svg" /> */}</div>
          <div className="login-content">
            <form>
              <h2 className="title">Welcome</h2>
              <div className={`input-div one ${isUsrFocus ? "focus" : ""}`}>
                <div className="i">
                  <i className="fas fa-user"></i>
                </div>
                <div className="div ">
                  <h5>Email</h5>
                  <input
                    onChange = {(e) => {
                      setEmail(e.target.value)
                    }}
                    type="text"
                    className="input"
                    required
                    onFocus={() => {
                      setIsUsrFocus(true);
                    }}
                    onBlur={() => {
                      setIsUsrFocus(false);
                    }}
                  />
                </div>
              </div>
              <div className={`input-div pass ${isPassFocus ? "focus" : ""}`}>
                <div className="i">
                  <i className="fas fa-lock"></i>
                </div>
                <div className="div">
                  <h5>Password</h5>
                  <input
                    onChange = {(e) => {
                      setPassword(e.target.value)
                    }}
                    type="password"
                    className="input"
                    required
                    onFocus={() => {
                      setIsPassFocus(true);
                    }}
                    onBlur={() => {
                      setIsPassFocus(false);
                    }}
                  />
                </div>
              </div>
              {/* <a href="#">Forgot Password?</a> */}
              <p className="errorMsg">{passwordError}</p>
              <input onClick={(e) => {e.preventDefault();handleLogin()}} type="submit" className="btn" value="Login" />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
