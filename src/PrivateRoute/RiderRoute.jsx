import React from "react";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";
import { Navigate, useLocation } from "react-router";
import Loading from "../Loading/Loading";

const RiderRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();
  const location = useLocation();

  if (loading || roleLoading) {
    <Loading />;
  }

  if (!user || role !== "rider") {
    return <Navigate to="/forbidden" state={{ from: location }} replace />;
  }

  return children;
};

export default RiderRoute;
