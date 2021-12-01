import React from "react";
import { Navigate, useLocation } from "react-router";

export default function RequireAuth({  children }) {
  let location = useLocation();
  const user = window.localStorage.getItem("user")
  console.log("auth", user);


  if (user === "true") {

    return children;
  }
  return <Navigate to="/signin" state={{ from: location }} />;

}
