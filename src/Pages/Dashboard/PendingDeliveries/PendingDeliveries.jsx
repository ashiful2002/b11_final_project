import React from "react";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Loading/Loading";
import Swal from "sweetalert2";
import useTrackingLogger from "../../../hooks/useTrackingLogger";

const PendingDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { logTracking } = useTrackingLogger();
  // Fetch parcels assigned to this rider
  const { data: parcels = [], isLoading } = useQuery({
    queryKey: ["pendingDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/parcels?email=${user?.email}`);
      return res.data;
    },
  });

  // Mutation to update delivery status
  const mutation = useMutation({
    mutationFn: async ({ parcel, status }) => {
      console.log(parcel._id);
      
      const res = await axiosSecure.patch(`/parcels/${parcel._id}/status`, {
        status,
      });
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Parcel status updated!", "success");
      queryClient.invalidateQueries(["pendingDeliveries", user?.email]);
    },
    onError: () => {
      Swal.fire("Error", "Failed to update parcel status.", "error");
    },
  });

  const handleStatusChange = (parcel, newStatus) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Mark parcel as ${newStatus.replace("_", " ")}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    }).then(async (result) => {
      if (result.isConfirmed) {
        mutation.mutate({ parcel, status: newStatus });

        let trackDetails = `Picked up by ${user.displayName}`;

        if (newStatus === "delivered") {
          trackDetails = `Delivered by ${user.displayName}`;
        }
        const logTracking = async (data) => {
          try {
            console.log("Logging tracking data:", data);
            await axiosSecure.post("/tracking", data);
          } catch (error) {
            console.error("Tracking logging failed:", error);
          }
        };

        await logTracking({
          tracking_id: parcel.tracking_id,
          status: newStatus,
          details: trackDetails,
          updated_by: user.email,
        });
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Pending Deliveries</h2>

      {parcels.length === 0 ? (
        <p className="text-center text-gray-500">No pending deliveries.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Receiver</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Status</th>
                <th>Cost</th>
                <th>Tracking ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.receiverName}</td>
                  <td>{parcel.receiverContact}</td>
                  <td>{parcel.receiverAddress}</td>
                  <td>{parcel.delivery_status}</td>
                  <td>৳{parcel.cost}</td>
                  <td>{parcel.tracking_id}</td>
                  <td>
                    {parcel.delivery_status === "rider_assigned" && (
                      <button
                        className="btn btn-xs btn-primary text-white"
                        onClick={() => handleStatusChange(parcel, "in_transit")}
                      >
                        Mark as Picked Up
                      </button>
                    )}
                    {parcel.delivery_status === "in_transit" && (
                      <button
                        className="btn btn-xs btn-info text-white"
                        onClick={() => handleStatusChange(parcel, "delivered")}
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {parcel.delivery_status !== "rider_assigned" &&
                      parcel.delivery_status !== "in_transit" && (
                        <span className="text-xs text-gray-500">No action</span>
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

export default PendingDeliveries;
