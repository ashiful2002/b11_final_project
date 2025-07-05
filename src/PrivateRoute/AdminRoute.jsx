import React from "react";
import useAuth from "../hooks/useAuth";
import Loading from "../Loading/Loading";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user || role !== "admin") {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminRoute;
