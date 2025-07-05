import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import { FaSearch, FaUserShield } from "react-icons/fa";
import { AiOutlineStop, AiTwotoneStop } from "react-icons/ai";

const fetchUserByEmail = async (email) => {
  const res = await axios.get(
    `http://localhost:3000/users/search?email=${email}`
  );
  return res.data;
};

const promoteToAdmin = async (userId) => {
  const res = await axios.patch(`http://localhost:3000/users/${userId}/role`, {
    role: "admin",
  });
  return res.data;
};

const MakeAdmin = () => {
  const [searchEmail, setSearchEmail] = useState("");
  const [trigger, setTrigger] = useState(false);

  const {
    data: users = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["searchUser", searchEmail, trigger],
    queryFn: () => fetchUserByEmail(searchEmail),
    enabled: !!searchEmail, // only run on demand
  });

  const handleSearch = () => {
    if (searchEmail.trim()) {
      refetch();
    }
  };

  const handlePromote = async (userId) => {
    try {
      const result = await promoteToAdmin(userId);
      if (result.result?.modifiedCount > 0) {
        Swal.fire("Success", "User promoted to admin", "success");
        setTrigger((prev) => !prev); // trigger refetch
      } else {
        Swal.fire("Info", "User already an admin", "info");
      }
    } catch (error) {
      console.error("Promotion error:", error);
      Swal.fire("Error", "Failed to promote user", "error");
    }
  };
  const handleRemoveAdmin = async (id) => {
    try {
      const res = await axios.patch(`http://localhost:3000/users/${id}/role`, {
        role: "user",
      });

      if (res.data.result.modifiedCount > 0) {
        Swal.fire("Success", "User demoted to user role.", "success");
        refetch(); // Refresh the user list
      } else {
        Swal.fire("Info", "No changes made.", "info");
      }
    } catch (error) {
      console.error("Error demoting user:", error);
      Swal.fire("Error", "Failed to demote user.", "error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Make Admin</h2>

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Search by email"
          className="input input-bordered w-full"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="btn btn-primary text-gray-700"
        >
          <FaSearch className="mr-1" /> Search
        </button>
      </div>

      {isLoading || isFetching ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.created_at
                      ? new Date(user.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {user.role !== "admin" ? (
                      <button
                        onClick={() => handlePromote(user._id)}
                        className="btn btn-sm btn-primary text-neutral-600"
                      >
                        <FaUserShield className="mr-1" /> Promote
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRemoveAdmin(user._id)}
                        className="btn text-red-600 font-semibold"
                      >
                        <AiOutlineStop className=""/> Remove From Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MakeAdmin;
