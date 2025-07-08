import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaTrashAlt, FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Loading from "../../../Loading/Loading";

const ActiveRiders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce logic (delay API call by 500ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: riders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["activeRiders", debouncedSearch],
    queryFn: async () => {
      const res = await axios.get(
        `https://zap-shift-server-sandy.vercel.app/riders/approved?name=${debouncedSearch}`
      );
      return res.data;
    },
  });

  const handleDeactivate = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This rider will be marked as inactive.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, deactivate!",
    });

    if (confirm.isConfirmed) {
      await axios.patch(`https://zap-shift-server-sandy.vercel.app/riders/${id}/deactivate`);
      Swal.fire("Deactivated!", "Rider has been deactivated.", "success");
      refetch();
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <h2 className="text-2xl font-bold text-green-700">Active Riders</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name"
            className="input input-bordered w-full max-w-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={refetch} className="btn btn-neutral">
            <FaSearch />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-sm md:text-base">
          <thead className="bg-green-60 bg-primary text-gray-600 ext-white">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Region</th>
              <th>District</th>
              <th>Joined</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {riders.map((rider, index) => (
              <tr key={rider._id}>
                <td>{index + 1}</td>
                <td>{rider.name}</td>
                <td>{rider.email}</td>
                <td>{rider.phone}</td>
                <td>{rider.region}</td>
                <td>{rider.district}</td>
                <td>{new Date(rider.createdAt).toLocaleDateString()}</td>
                <td>
                  <span className="badge badge-primary text-gray-700 ">
                    {rider.status}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleDeactivate(rider._id)}
                    className="btn btn-xs btn-error"
                  >
                    <FaTrashAlt className="text-white" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {riders.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No riders found.</p>
        )}
      </div>
    </div>
  );
};

export default ActiveRiders;
