import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import ParcelTable from "./parcelTable";
import Swal from "sweetalert2";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const {
    data: parcels = [],
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["my-parcels", user.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels?email=${user.email}`);
      return res.data;
    },
  });

  const handleView = (parcel) => {
    console.log("Viewing:", parcel);
    // You can use a modal or navigate to a detail page
  };

  const handlePay = (parcel) => {
    console.log("Initiating payment for:", parcel);
    // You can redirect to payment route or open modal
  };
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await axiosSecure.delete(`/parcels/${id}`);
      refetch();

      Swal.fire({
        title: "Deleted!",
        text: "The parcel has been deleted.",
        icon: "success",
      });
    } catch (error) {
      console.error("Delete error:", error);
      Swal.fire("Error", "Something went wrong while deleting.", "error");
    }
  }
};

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        📦 My Parcels ({parcels.length})
      </h2>
      <ParcelTable
        parcels={parcels}
        onView={handleView}
        onPay={handlePay}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MyParcels;
