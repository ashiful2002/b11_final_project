import React, { useEffect, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Loading/Loading";

const AssignRider = () => {
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [riders, setRiders] = useState([]);
  const [isLoadingRiders, setIsLoadingRiders] = useState(false);

  const {
    data: parcels = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assignableParcels"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3000/parcels", {
        params: {
          payment_status: "paid",
          delivery_status: "not_collected",
        },
      });
      return res.data.filter(
        (p) =>
          p.payment_status === "paid" && p.delivery_status === "not_collected"
      );
    },
  });

  const handleAssignClick = async (parcel) => {
    setSelectedParcel(parcel);
    setIsLoadingRiders(true);
    console.log(parcel.senderServiceCenter);

    try {
      const res = await axios.get("http://localhost:3000/riders/available", {
        params: {
          district: parcel.senderServiceCenter,
        },
      });
      setRiders(res.data);
    } catch (error) {
      console.error("Failed to load riders", error);
      setRiders([]);
    } finally {
      setIsLoadingRiders(false);
    }
  };

  if (isLoading) return <Loading />;

  const handleAssignRider = async (riderId) => {
    try {
      const res = await axiosSecure.patch("/assign-rider", {
        parcelId: selectedParcel._id,
        riderId: riderId,
      });

      if (res.data?.parcelUpdated && res.data?.riderUpdated) {
        Swal.fire("Success", "Rider assigned successfully", "success");
        setSelectedParcel(null); // Close modal
        refetch(); // Refetch parcel list
      } else {
        Swal.fire("Warning", "Assignment not completed properly", "warning");
      }
    } catch (err) {
      console.error("Assign error:", err);
      Swal.fire("Error", "Failed to assign rider", "error");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Assign Rider to Parcel</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Tracking ID</th>
              <th>Title</th>
              <th>Weight</th>
              <th>Receiver</th>
              <th>Location</th>
              <th>Cost</th>
              <th>Created By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.tracking_id}</td>
                <td>{parcel.title}</td>
                <td>{parcel.weight} kg</td>
                <td>
                  {parcel.receiverName}
                  <br />
                  <span className="text-xs text-gray-500">
                    {parcel.receiverContact}
                  </span>
                </td>
                <td>
                  {parcel.receiverRegion}, {parcel.receiverServiceCenter}
                </td>
                <td>${parcel.cost}</td>
                <td className="text-sm">{parcel.created_by}</td>
                <td>
                  <span className="badge badge-warning">
                    {parcel.delivery_status}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary text-gray-700"
                    onClick={() => handleAssignClick(parcel)}
                  >
                    Assign Rider
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedParcel && (
        <dialog id="assign_modal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-xl mb-4">Assign Rider</h3>
            <p className="mb-2 text-sm">
              Parcel: <strong>{selectedParcel.tracking_id}</strong> |
              Destination: {selectedParcel.receiverServiceCenter}
            </p>

            {isLoadingRiders ? (
              <Loading />
            ) : riders.length === 0 ? (
              <p className="text-red-500">
                No available riders in this district.
              </p>
            ) : (
              <ul className="space-y-2">
                {riders.map((rider) => (
                  <li
                    key={rider._id}
                    className="flex justify-between items-center border p-2 rounded"
                  >
                    <div>
                      <p className="font-semibold">{rider.name}</p>
                      <p className="text-sm text-gray-500">{rider.phone}</p>
                    </div>
                    <button
                      onClick={() => handleAssignRider(rider._id)}
                      className="btn btn-sm btn-success"
                    >
                      Confirm Assign
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="modal-action">
              <form method="dialog">
                <button className="btn" onClick={() => setSelectedParcel(null)}>
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

export default AssignRider;
