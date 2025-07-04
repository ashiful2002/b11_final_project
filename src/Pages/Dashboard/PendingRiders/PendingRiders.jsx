import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { FaCheckCircle, FaTimesCircle, FaEye } from "react-icons/fa";
import Loading from "../../../Loading/Loading";

const PendingRiders = () => {
  const [selectedRider, setSelectedRider] = useState(null);

  const {
    data: riders = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/riders/pending");
      return res.data;
    },
  });

  const handleApprove = async (id, action = "approve") => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/riders/approve/${id}/status`,
        { status: action === "approve" ? "approved" : "rejected" }
      );
      if (res.data.modifiedCount > 0) {
        Swal.fire(
          action === "approve" ? "Approved!" : "Rejected!",
          `Rider has been ${action === "approve" ? "approved" : "rejected"}.`,
          "success"
        );
        refetch();
        setSelectedRider(null); // Close modal if open
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the rider application!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/riders/${id}`);
        Swal.fire("Deleted!", "Rider application removed.", "success");
        refetch();
      } catch (error) {
        console.error(error);
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Riders</h2>

      {riders.length === 0 ? (
        <p className="text-center text-gray-500">No pending applications found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
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
                  <td className="flex gap-2">
                    <button
                      className="btn btn-xs btn-success"
                      title="Approve"
                      onClick={() => handleApprove(rider._id)}
                    >
                      <FaCheckCircle />
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      title="Delete"
                      onClick={() => handleCancel(rider._id)}
                    >
                      <FaTimesCircle />
                    </button>
                    <button
                      className="btn btn-xs btn-info"
                      title="View Details"
                      onClick={() => setSelectedRider(rider)}
                    >
                      <FaEye />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedRider && (
        <dialog id="rider_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-xl mb-4">Rider Details</h3>
            <div className="space-y-2">
              <p><strong>Name:</strong> {selectedRider.name}</p>
              <p><strong>Email:</strong> {selectedRider.email}</p>
              <p><strong>Phone:</strong> {selectedRider.phone}</p>
              <p><strong>Age:</strong> {selectedRider.age}</p>
              <p><strong>NID:</strong> {selectedRider.nid}</p>
              <p><strong>Bike Number:</strong> {selectedRider.bikeNumber}</p>
              <p><strong>Region:</strong> {selectedRider.region}</p>
              <p><strong>District:</strong> {selectedRider.district}</p>
              <p><strong>Status:</strong> {selectedRider.status}</p>
              <p><strong>Submitted:</strong> {new Date(selectedRider.createdAt).toLocaleString()}</p>
            </div>

            <div className="modal-action flex justify-between items-center">
              <button
                className="btn btn-success"
                onClick={() => handleApprove(selectedRider._id, "approve")}
              >
                Approve
              </button>
              <button
                className="btn btn-warning"
                onClick={() => handleApprove(selectedRider._id, "reject")}
              >
                Reject
              </button>
              <form method="dialog">
                <button
                  className="btn"
                  onClick={() => setSelectedRider(null)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingRiders;
