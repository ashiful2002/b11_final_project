import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Loading/Loading";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isPending, data: payments = [] } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isPending) {
    return <Loading />;
  }

  return <div><div className="overflow-x-auto p-4">
  <h2 className="text-2xl font-bold mb-6 text-center text-primary">💳 Payment History</h2>
  <table className="table table-zebra table-lg w-full rounded-xl shadow-lg border border-base-300">
    <thead className="bg-base-200 text-base-content text-sm uppercase">
      <tr>
        <th>#</th>
        <th>Parcel ID</th>
        <th>Email</th>
        <th>Amount</th>
        <th>Method</th>
        <th>Transaction ID</th>
        <th>Paid At</th>
      </tr>
    </thead>
    <tbody>
      {payments.map((payment, index) => (
        <tr key={payment.transactionId}>
          <th>{index + 1}</th>
          <td>{payment.parcelId}</td>
          <td>{payment.email}</td>
          <td className="text-success font-medium">${payment.amount}</td>
          <td className="capitalize">{payment.paymentMethod}</td>
          <td className="text-xs">{payment.transactionId}</td>
          <td className="text-sm text-gray-500">
            {new Date(payment.paid_at).toLocaleString()}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>;
};

export default PaymentHistory;
