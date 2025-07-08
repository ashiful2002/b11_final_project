import React from "react";
import { NavLink, Outlet } from "react-router";
import Logo from "../../Shared/ProFast/Logo/Logo";
import Navbar from "../../Shared/Navbar/Navbar";
import {
  FaHome,
  FaBoxOpen,
  FaMoneyCheckAlt,
  FaUserEdit,
  FaSearchLocation,
  FaMotorcycle,
  FaClock,
  FaUserShield,
  FaBluetoothB,
  FaTruckLoading,
  FaCheckDouble,
  FaCheck,
  FaWallet,
} from "react-icons/fa"; // icons
import useUserRole from "../../hooks/useUserRole";

const DashboardLayout = () => {
  const { role, roleLoading } = useUserRole();
  console.log(role);

  const links = (
    <>
      <Logo />
      <li>
        <NavLink to="/dashboard" className="flex items-center gap-2">
          <FaHome /> Home
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/myparcels" className="flex items-center gap-2">
          <FaBoxOpen /> My Parcels
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/payment-history"
          className="flex items-center gap-2"
        >
          <FaMoneyCheckAlt /> Payment History
        </NavLink>
      </li>
      <li>
        <NavLink to="/dashboard/track" className="flex items-center gap-2">
          <FaSearchLocation /> Track a parcel
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/dashboard/myparcels/profile"
          className="flex items-center gap-2"
        >
          <FaUserEdit /> Update Profile
        </NavLink>
      </li>

      {/* rider nav */}
      {!roleLoading && role === "rider" && (
        <>
          <li>
            <NavLink
              to="/dashboard/pending-deliveries"
              className="flex items-center gap-2"
            >
              <FaTruckLoading /> Pending Deliveries
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/dashboard/completed-deliveries"
              className="flex items-center gap-2"
            >
              <FaCheck /> Completed Deliveries
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/my-earning"
              className="flex items-center gap-2"
            >
              <FaWallet /> My Earning
            </NavLink>
          </li>
        </>
      )}

      {/* admin navbar */}
      {!roleLoading && role === "admin" && (
        <>
          <li>
            <NavLink
              to="/dashboard/assign-riders"
              className="flex items-center gap-2"
            >
              <FaMotorcycle /> Assign Rider
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/active-riders"
              className="flex items-center gap-2"
            >
              <FaMotorcycle /> Active Riders
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/pending-riders"
              className="flex items-center gap-2"
            >
              <FaClock /> Pending Riders
            </NavLink>
          </li>
          {/* admin routes */}
          <li>
            <NavLink
              to="/dashboard/make-admin"
              className="flex items-center gap-2"
            >
              <FaUserShield /> Make Admin
            </NavLink>
          </li>
        </>
      )}
    </>
  );
  return (
    <div>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col ">
          {/* dsfgag asdfg a */}

          <div className="drawer">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col">
              {/* Navbar */}
              <div className="navbar bg-base-300 w-full lg:hidden">
                <div className="flex-none ">
                  <label
                    htmlFor="my-drawer-2"
                    aria-label="open sidebar"
                    className="btn btn-square btn-ghost"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      className="inline-block h-6 w-6 stroke-current"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      ></path>
                    </svg>
                  </label>
                </div>
                <div className="mx-2 flex-1 px-2 lg:hidden">Dashboard</div>
                <div className="hidden flex-none  lg:hidden">
                  <ul className="menu menu-horizontal">
                    {/* Navbar menu content here */}
                    {links}
                  </ul>
                </div>
              </div>
              {/* Page content here */}
            </div>
            {/* <div className="drawer-side">
              <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              
            </div> */}
          </div>
          <Outlet />
          {/* Page content here */}
        </div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer-2"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
            {/* Sidebar content here */}
            {links}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
