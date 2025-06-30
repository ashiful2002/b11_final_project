import React from "react";
import { Outlet } from "react-router";
import Navbar from "../../Shared/Navbar/Navbar";
import Footer from "../../Shared/Footer/Footer";

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="w-11/12 mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default RootLayout;
