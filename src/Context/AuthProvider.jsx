import React, { useEffect, useState } from "react";
import { AuthContext } from "./Authcontext";
import { auth } from "../firebase.init";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signin = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };
  const signinWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  useEffect(() => {
    const unsubscrive = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    //   console.log("user in the current state change", currentUser);

      setLoading(false);
    });
    return () => {
      unsubscrive();
    };
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signin,
    signinWithGoogle,
    logOut,
    setUser,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
