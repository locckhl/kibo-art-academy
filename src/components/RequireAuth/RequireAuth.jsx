import React from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext.js";
export default function RequireAuth({ children }) {
  let location = useLocation();
  const { currentUser } = useAuth();

  console.log("currentUser", currentUser);

  // Authorized user
  if (currentUser && Object.keys(currentUser).length !== 0) {
    return children;
  }

  // Unauthorized user
  return <Navigate to="/signin" state={{ from: location }} />;
}
