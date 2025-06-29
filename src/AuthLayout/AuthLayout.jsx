import React from "react";
import Logo from "../Shared/ProFast/Logo/Logo";
import { Outlet } from "react-router";
import authimage from "../assets/authimage.png";
const AuthLayout = () => {
  return (
    <div className="sm:p-10">
      <Logo />
      <div className="hero rounded-2xl sm:p-12 bg-base-200 ">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <div className="flex-1">
            <img src={authimage} className="max-w-sm rounded-lg shadow-2xl" />
          </div>
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
