// ParcelTable.jsx
import React from "react";

const ParcelTable = ({ parcels = [], onDelete, onView, onPay }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Parcel Type</th>
            <th>Created At</th>
            <th>Cost</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parcels.map((parcel, index) => (
            <tr key={parcel._id}>
              <th>{index + 1}</th>
              <td className=" max-w-[180px] truncate">{parcel.title}</td>
              <td className="capitalize">{parcel.parcelType}</td>
              <td>{parcel.creation_time_display}</td>
              <td>৳{parcel.cost}</td>
              <td>
                <span
                  className={`badge ${
                    parcel.payment_status === "paid"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {parcel.payment_status}
                </span>
              </td>
              <td className="space-x-1">
                <button
                  className="btn btn-xs btn-info"
                  onClick={() => onView(parcel)}
                >
                  View
                </button>
                {parcel.payment_status !== "paid" && (
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => onPay(parcel)}
                  >
                    Pay
                  </button>
                )}
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => onDelete(parcel._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {parcels.length === 0 && (
        <div className="text-center py-10 text-gray-500">No parcels found.</div>
      )}
    </div>
  );
};

export default ParcelTable;
