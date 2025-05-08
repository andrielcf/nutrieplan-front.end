import React from "react";
import { Navigate } from "react-router-dom";

const NotAuthenticatedRoute = ({ children }) => {
    const token = sessionStorage.getItem("token");

    if (!token) return <Navigate to="/auth/login" />;

    return children;
};

export default NotAuthenticatedRoute;