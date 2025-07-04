import React from "react";
import useAuth from "../../../hooks/useAuth";
import { Link, Navigate, useNavigate } from "react-router";
const NavbarEnd = () => {
  const navigate = useNavigate();
  const { logOut, user, loading } = useAuth();
  // console.log(user);

  const handleSignOut = () => {
    logOut()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  if (loading) {
    // return <Loading />;
  }
  return (
    <div className="">
      {user ? (
        <div className="flex items-center gap-4">
          <img
            src={
              user.photoURL ||
              " https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
            }
            alt="User"
            className="w-10 h-10 rounded-full"
          />

          <button
            onClick={handleSignOut}
            className="btn btn-primary text-gray-800"
          >
            Log out
          </button>
        </div>
      ) : (
        <Link to="/login" className="btn">
          sign in
        </Link>
      )}
    </div>
  );
};

export default NavbarEnd;
//
