import React from "react";
import useAuth from "../../../hooks/useAuth";
import { Link, Navigate, useNavigate } from "react-router";
import Loading from "../../../Loading/Loading";
const NavbarEnd = () => {
  const navigate = useNavigate();
  const { logOut, user, loading } = useAuth();
  console.log(user);

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
    <Loading />;
  }
  return (
    <div>
      {user ? (
        <img src={user.photoURL} alt="" />
      ) : (
        // <button onClick={handleSignOut} className="btn">
        //   Sign out
        // </button>
        <Link to="/login" className="btn">
          sign in
        </Link>
      )}
    </div>
  );
};

export default NavbarEnd;
