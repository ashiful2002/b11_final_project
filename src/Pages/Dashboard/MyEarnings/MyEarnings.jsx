import React from "react";
import { format, isSameDay, isSameMonth, isSameYear } from "date-fns";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Loading from "../../../Loading/Loading";

const MyEarnings = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: deliveries = [], isLoading } = useQuery({
    queryKey: ["myEarnings", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/riders/completed-parcels?email=${user.email}`
      );
      return res.data;
    },
  });

  const calculateEarning = (parcel) => {
    const isSameDistrict =
      parcel.senderServiceCenter === parcel.receiverServiceCenter;
    return isSameDistrict ? parcel.cost * 0.8 : parcel.cost * 0.2;
  };

  const getEarningsSummary = () => {
    const now = new Date();

    let todayTotal = 0;
    let monthTotal = 0;
    let yearTotal = 0;
    let overallTotal = 0;
    let pendingTotal = 0;
    let cashedOutTotal = 0;

    deliveries.forEach((parcel) => {
      const deliveredDate = parcel.delivered_at
        ? new Date(parcel.delivered_at)
        : null;
      const earning = calculateEarning(parcel);
      console.log("cashed_out", parcel.delivered_at);

      overallTotal += earning;

      if (parcel.cashout_status === "cashed_out") {
        cashedOutTotal += earning;
      } else {
        pendingTotal += earning;
      }

      if (deliveredDate) {
        if (isSameDay(deliveredDate, now)) {
          todayTotal += earning;
        }

        if (isSameMonth(deliveredDate, now)) {
          monthTotal += earning;
        }

        if (isSameYear(deliveredDate, now)) {
          yearTotal += earning;
        }
      }
    });

    return {
      todayTotal,
      monthTotal,
      yearTotal,
      overallTotal,
      cashedOutTotal,
      pendingTotal,
    };
  };

  if (isLoading) return <Loading />;

  const {
    todayTotal,
    monthTotal,
    yearTotal,
    overallTotal,
    cashedOutTotal,
    pendingTotal,
  } = getEarningsSummary();

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">My Earnings Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-gray-700">Total Earned</h4>
          <p className="text-2xl font-bold text-blue-800">
            ${overallTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-gray-700">Cashed Out</h4>
          <p className="text-2xl font-bold text-green-800">
            ${cashedOutTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-gray-700">Pending</h4>
          <p className="text-2xl font-bold text-yellow-800">
            ${pendingTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-indigo-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-gray-700">Today</h4>
          <p className="text-2xl font-bold text-indigo-800">
            ${todayTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-purple-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-gray-700">This Month</h4>
          <p className="text-2xl font-bold text-purple-800">
            ${monthTotal.toFixed(2)}
          </p>
        </div>

        <div className="bg-pink-100 p-4 rounded-xl shadow">
          <h4 className="text-lg font-semibold text-gray-700">This Year</h4>
          <p className="text-2xl font-bold text-pink-800">
            ${yearTotal.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MyEarnings;
