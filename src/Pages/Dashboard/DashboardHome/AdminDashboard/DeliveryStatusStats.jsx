import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MdLocalShipping,
  MdCheckCircle,
  MdErrorOutline,
} from "react-icons/md";
import { TbProgressBolt } from "react-icons/tb";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Loading from "../../../../Loading/Loading";

// Status icons mapped by delivery status
const statusIcons = {
  delivered: <MdCheckCircle className="text-green-500 text-3xl" />,
  in_transit: <TbProgressBolt className="text-blue-500 text-3xl" />,
  not_collected: <MdErrorOutline className="text-orange-500 text-3xl" />,
  pending: <MdLocalShipping className="text-gray-500 text-3xl" />,
};

// Format status label: e.g., "not_collected" → "Not collected"
const getStatusLabel = (status) =>
  status?.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());

const DeliveryStatusStats = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data: stats = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcelStatusCount"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return (res.data || []).map((item) => ({
        status: item._id,
        count: item.count,
      }));
    },
  });

  const total = stats.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">📦 Parcel Delivery Status</h2>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <div className="text-red-500 text-center font-medium">
          Failed to load parcel stats. Please try again.
        </div>
      ) : stats.length === 0 ? (
        <div className="text-gray-500 text-center">No parcel data available.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map(({ status, count }) => {
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

            return (
              <div
                key={status}
                className="card bg-white border shadow-md rounded-xl"
              >
                <div className="card-body">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {statusIcons[status] || (
                        <MdLocalShipping className="text-gray-400 text-3xl" />
                      )}
                      <h3 className="text-lg font-semibold">
                        {getStatusLabel(status)}
                      </h3>
                    </div>
                    <span className="badge badge-neutral text-sm px-3 py-1">
                      {count} Parcels
                    </span>
                  </div>

                  <progress
                    className="progress progress-primary w-full"
                    value={percentage}
                    max="100"
                  ></progress>
                  <p className="text-sm text-gray-500 mt-2">
                    {percentage}% of total ({total})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusStats;
