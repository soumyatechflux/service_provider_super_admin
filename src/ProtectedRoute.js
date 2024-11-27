import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ loggedIn, children }) => {
  if (!loggedIn) {
    // If not logged in, redirect to the login page
    return <Navigate to="/" />;
  }

  // If logged in, render the child components (protected routes)
  return children;
};

export default ProtectedRoute;