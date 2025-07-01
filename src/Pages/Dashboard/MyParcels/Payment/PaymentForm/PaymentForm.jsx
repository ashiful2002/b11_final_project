import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../../../hooks/useAxiosSecure";
import Loading from "../../../../../Loading/Loading";
import useAuth from "../../../../../hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

const PaymentForm = () => {
  const { user } = useAuth();
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const { parcelId } = useParams();
  console.log(parcelId);
  const axiosSecure = useAxiosSecure();
  // useing transetc query
  const navigate = useNavigate();
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });
  if (isPending) {
    return <Loading />;
  }
  const amount = parcelInfo.cost;

  const amountInCent = amount * 100;

  console.log("aprcel info", amountInCent);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }
    const card = elements.getElement(CardElement);
    if (!card) {
      return;
    }

    // Use your card Element with other Stripe.js APIs
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });
    if (error) {
      console.log("error", error);
      setError(error.message);
    } else {
      setError("");
      console.log("payment method", paymentMethod);
      // step-2 create payment intent
      const res = await axiosSecure.post("/create-payment-intent", {
        amountInCent,
        parcelId,
      });

      const clientSecret = res.data.clientSecret;
      // step 3 - confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: user?.displayName,
            email: user?.email,
          },
        },
      });

      if (result.error) {
        console.log(result.error.message);
        setError(result.error.message);
      } else {
        ("");
        if (result.paymentIntent.status === "succeeded") {
          console.log("payment Succeeded");
          console.log(result);
          // step 4- mark parcel paid  also create payment histry

          const paymentData = {
            parcelId,
            email: user.email,
            amount,
            transectionId: result.paymentIntent.id,
            paymentMethod: result.paymentIntent.payment_method,
          };

          const paymentRes = await axiosSecure.post("/payments", paymentData);

          if (paymentRes.data.insertedId) {
            console.log("pament successfull");
            // ✅ SweetAlert
            Swal.fire({
              title: "Payment Successful!",
              text: `Transaction ID: ${result.paymentIntent.id}`,
              icon: "success",
              confirmButtonText: "Go to My Parcels",
            }).then(() => {
              // ✅ Redirect after confirmation
              navigate("/dashboard/myParcels");
            });
          }
        }
      }
      console.log("res from intent", res);
    }
  };
  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-2xl">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800">
        Parcel Payment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border w-60 p-4 rounded-md shadow-sm bg-gray-50">
          <CardElement />
        </div>

        <button
          className="w-full py-2 px-4 btn btn-primary text-white rounded-lg :bg-blue-700 disabled:opacity-50 transition-all"
          type="submit"
          disabled={!stripe}
        >
          Pay ${amount}
        </button>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
