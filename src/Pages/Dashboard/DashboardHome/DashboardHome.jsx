import React from "react";
import useUserRole from "../../../hooks/useUserRole";
import Loading from "../../../Loading/Loading";
import UserDashBoard from "./UserDashboard/UserDashBoard";
import RiderDashboard from "./RiderDashboard/RiderDashboard";
import AdminDashboard from "./AdminDashboard/AdminDashboard";
import ForbidenPage from "../../ErrorPage/ForbiddenPage/ForbidenPage";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <Loading />;
  }
  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "rider") {
    return <RiderDashboard />;
  } else if (role === "user") {
    return <UserDashBoard />;
  } else {
    return <ForbidenPage />;
  }

};

export default DashboardHome;
