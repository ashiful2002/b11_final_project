
import React from "react";
import { Link } from "react-router";
import { FaLock } from "react-icons/fa";

const ForbidenPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-4">
      <FaLock className="text-6xl text-red-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">403 - Forbidden</h1>
      <p className="text-lg text-gray-600 mb-6">
        You don’t have permission to access this page.
      </p>
      <Link
        to="/"
        className="inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
      >
        Go to Home
      </Link>
    </div>
  );
};

export default ForbidenPage;
