import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../../Loading/Loading";
import Swal from "sweetalert2";

const CompletedDeliveries = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // Fetch completed deliveries for the logged-in rider
  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["completedDeliveries", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/completed-parcels?email=${user.email}`);
      return res.data;
    },
  });

  // Mutation for requesting cashout
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/parcels/${id}/cashout`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["completedDeliveries"]);
      Swal.fire("Cashout Requested!", "", "success");
    },
    onError: () => {
      Swal.fire("Error", "Cashout request failed", "error");
    },
  });

  // Calculate rider earnings for a parcel
  const calculateEarnings = (parcel) => {
    const isSameDistrict =
      parcel.senderServiceCenter === parcel.receiverServiceCenter;
    return isSameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.2;
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Completed Deliveries</h2>

      {deliveries.length === 0 ? (
        <p className="text-gray-500 text-center">No completed deliveries yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Receiver</th>
                <th>Cost</th>
                <th>Earnings</th>
                <th>Pickup Time</th>
                <th>Delivered Time</th>
                <th>Cashout Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {deliveries.map((parcel, index) => (
                <tr key={parcel._id}>
                  <td>{index + 1}</td>
                  <td>{parcel.title}</td>
                  <td>{parcel.receiverName}</td>
                  <td>${parcel.cost}</td>
                  <td>
                    $
                    {calculateEarnings(parcel).toFixed(2)}
                    {parcel.senderServiceCenter === parcel.receiverServiceCenter ? (
                      <span className="text-green-500 text-xs ml-1">(80%)</span>
                    ) : (
                      <span className="text-yellow-600 text-xs ml-1">(20%)</span>
                    )}
                  </td>
                  <td>
                    {parcel.picked_up_at
                      ? new Date(parcel.picked_up_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>
                    {parcel.delivered_at
                      ? new Date(parcel.delivered_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="capitalize">
                    {parcel.cashout_status || "not requested"}
                  </td>
                  <td>
                    {parcel.cashout_status !== "cashed_out" ? (
                      <button
                        className="btn btn-xs btn-success"
                        onClick={() => mutation.mutate(parcel._id)}
                      >
                        Request Cashout
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400">Cashed Out</span>
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

export default CompletedDeliveries;
