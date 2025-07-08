import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
import Loading from "../../../../../Loading/Loading";

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f97316", "#94a3b8"]; // Tailwind green, blue, yellow, orange, slate

const getStatusLabel = (status) =>
  status?.replaceAll("_", " ").replace(/^\w/, (c) => c.toUpperCase());

const RechartPieChart = () => {
  const axiosSecure = useAxiosSecure();

  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["parcelStatusPie"],
    queryFn: async () => {
      const res = await axiosSecure.get("/parcels/delivery/status-count");
      return (res.data || []).map((item) => ({
        name: getStatusLabel(item._id),
        value: item.count,
      }));
    },
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        📊 Parcel Status Overview
      </h2>

      {isLoading ? (
        <Loading />
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load chart data.</p>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">No parcel data found.</p>
      ) : (
        <div className="w-full h-96">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                key={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} (${(percent * 100).toFixed(1)}%)`
                }
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default RechartPieChart;
