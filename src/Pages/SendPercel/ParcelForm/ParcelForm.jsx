import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useLoaderData, useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useTrackingLogger from "../../../hooks/useTrackingLogger";
import useaxios from "../../../hooks/useAxios";
import axios from "axios";
const generateTrackingId = () => {
  return "SAD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
};

const ParcelForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();
  const navigate = useNavigate();
  const { logTracking } = useTrackingLogger();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const parcelType = watch("parcelType");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const [regions, setRegions] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);

  useEffect(() => {
    const uniqueRegions = [
      ...new Set(serviceCenters.map((item) => item.region)),
    ];
    setRegions(uniqueRegions);
  }, [serviceCenters]);

  useEffect(() => {
    if (senderRegion) {
      const filtered = serviceCenters
        .filter((sc) => sc.region === senderRegion)
        .map((sc) => sc.district);
      setSenderDistricts(filtered);
    } else {
      setSenderDistricts([]);
    }
  }, [senderRegion, serviceCenters]);

  useEffect(() => {
    if (receiverRegion) {
      const filtered = serviceCenters
        .filter((sc) => sc.region === receiverRegion)
        .map((sc) => sc.district);
      setReceiverDistricts(filtered);
    } else {
      setReceiverDistricts([]);
    }
  }, [receiverRegion, serviceCenters]);

  useEffect(() => {
    if (user?.displayName) {
      setValue("senderName", user.displayName);
    }
  }, [user?.displayName, setValue]);

  const handleFormSubmit = (data) => {
    const weightValue = parseFloat(data.weight) || 0;
    const isSameCity =
      data.senderRegion === data.receiverRegion &&
      data.senderServiceCenter === data.receiverServiceCenter;

    let baseCost = 0;
    let extraCost = 0;
    let outsideCitySurcharge = 0;

    if (data.parcelType === "document") {
      baseCost = isSameCity ? 60 : 80;
    } else {
      if (weightValue <= 3) {
        baseCost = isSameCity ? 110 : 150;
      } else {
        const extraKg = weightValue - 3;
        extraCost = extraKg * 40;
        baseCost = isSameCity ? 110 : 150;
        if (!isSameCity) {
          outsideCitySurcharge = 40;
        }
      }
    }

    const totalCost = baseCost + extraCost + outsideCitySurcharge;
    const tracking_id = generateTrackingId();

    Swal.fire({
      title: "Confirm Parcel Submission",
      text: `Estimated Cost: ৳${totalCost}`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Submit",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          weight: weightValue,
          cost: totalCost,
          created_by: user?.email || "unknown",
          creation_date: new Date().toISOString(),
          creation_time_display: new Date().toLocaleString("en-BD", {
            timeZone: "Asia/Dhaka",
            dateStyle: "medium",
            timeStyle: "short",
          }),
          payment_status: "unpaid",
          delivery_status: "not_collected",
          tracking_id,
        };
        // console.log("ready for payment", parcelData);

        try {
          const res = await axiosSecure
            .post("/parcels", parcelData)
            .then(async (res) => {
              
              if (res.data.result.insertedId) {
                Swal.fire({
                  title: "Redirecting...",
                  text: "Proceeding to payment gateway.",
                  icon: "success",
                  timer: 1500,
                  showConfirmButton: false,
                });


                await logTracking({
                  tracking_id: parcelData.tracking_id,
                  status: "parcel_created",
                  details: `Creatd by ${user.displayName}`,
                  updated_by: user.email,
                });

                navigate("/dashboard/myParcels");
                reset();
              }
            });
        } catch (err) {
          console.error(err);
          Swal.fire("Error", "Something went wrong", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold mb-1">Send a Parcel</h2>
      <p className="mb-6 text-gray-500">
        Fill out the form to schedule a pickup and delivery
      </p>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-10">
        {/* --- Parcel Info --- */}
        <section className="shadow-md rounded-2xl p-5">
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">
            📦 Parcel Info
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Parcel Type</label>
              <div className="flex flex-col gap-2">
                {["document", "non-document"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      value={type}
                      {...register("parcelType", { required: true })}
                      className="radio radio-primary"
                    />
                    <span className="label-text capitalize">{type}</span>
                  </label>
                ))}
              </div>
              {errors.parcelType && (
                <p className="text-red-500 text-sm mt-1">
                  Parcel type is required
                </p>
              )}
            </div>

            <div>
              <label className="label">Title</label>
              <input
                {...register("title", { required: true })}
                className="input input-bordered w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">Title is required</p>
              )}
            </div>

            {parcelType === "non-document" && (
              <div>
                <label className="label">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight", { required: true })}
                  className="input input-bordered w-full"
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">
                    Weight is required
                  </p>
                )}
              </div>
            )}
          </div>
        </section>

        {/* --- Sender & Receiver Info --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Sender Info */}
          <section className="shadow-2xl rounded-2xl p-5">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
              🧍 Sender Info
            </h3>
            <div className="space-y-4">
              <input
                {...register("senderName", { required: true })}
                className="input input-bordered w-full"
                placeholder="Sender Name"
              />
              <input
                {...register("senderContact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Sender Contact"
              />
              <select
                {...register("senderRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("senderServiceCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {senderDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <textarea
                {...register("senderAddress", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Sender Address"
              />
              <textarea
                {...register("pickupInstruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Pickup Instruction"
              />
            </div>
          </section>

          {/* Receiver Info */}
          <section className="shadow-2xl rounded-2xl p-5">
            <h3 className="text-xl font-semibold border-b pb-2 mb-4">
              📮 Receiver Info
            </h3>
            <div className="space-y-4">
              <input
                {...register("receiverName", { required: true })}
                className="input input-bordered w-full"
                placeholder="Receiver Name"
              />
              <input
                {...register("receiverContact", { required: true })}
                className="input input-bordered w-full"
                placeholder="Receiver Contact"
              />
              <select
                {...register("receiverRegion", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Region</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
              <select
                {...register("receiverServiceCenter", { required: true })}
                className="select select-bordered w-full"
              >
                <option value="">Select Service Center</option>
                {receiverDistricts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
              <textarea
                {...register("receiverAddress", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Receiver Address"
              />
              <textarea
                {...register("deliveryInstruction", { required: true })}
                className="textarea textarea-bordered w-full"
                placeholder="Delivery Instruction"
              />
            </div>
          </section>
        </div>

        <div className="pt-6">
          <button className="btn btn-primary w-full text-gray-600">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParcelForm;
