import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useLoaderData } from "react-router";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
const generateTrackingId = () => {
  return "SAD-" + Math.random().toString(36).substring(2, 9).toUpperCase();
};
const ParcelForm = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const serviceCenters = useLoaderData();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Watch fields
  const parcelType = watch("parcelType");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const [regions, setRegions] = useState([]);
  const [senderDistricts, setSenderDistricts] = useState([]);
  const [receiverDistricts, setReceiverDistricts] = useState([]);

  // Load regions once
  useEffect(() => {
    const uniqueRegions = [
      ...new Set(serviceCenters.map((item) => item.region)),
    ];
    setRegions(uniqueRegions);
  }, [serviceCenters]);

  // Set sender districts
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

  // Set receiver districts
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

  // Set default sender name from user
  useEffect(() => {
    if (user?.displayName) {
      setValue("senderName", user.displayName);
    }
  }, [user?.displayName, setValue]);

  // ✅ Final submit
  const handleFinalSubmit = (data, cost) => {
    console.log("✅ Parcel Created:", data);
    toast.success(`Parcel Created! Estimated Cost: ৳${cost}`);
    reset();
  };

  // ✅ Form submit with cost calculation and confirmation
  //   const handleFormSubmit = (data) => {
  //     const {
  //       parcelType,
  //       weight,
  //       senderRegion,
  //       receiverRegion,
  //       senderServiceCenter,
  //       receiverServiceCenter,
  //     } = data;

  //     const weightValue = parseFloat(weight) || 0;
  //     const isWithinCity =
  //       senderRegion === receiverRegion &&
  //       senderServiceCenter === receiverServiceCenter;

  //     let cost = 0;

  //     if (parcelType === "document") {
  //       cost = isWithinCity ? 60 : 80;
  //     } else {
  //       if (weightValue <= 3) {
  //         cost = isWithinCity ? 110 : 150;
  //       } else {
  //         const extraKg = weightValue - 3;
  //         const extraCost = extraKg * 40;
  //         cost = isWithinCity ? 110 + extraCost : 150 + extraCost + 40;
  //       }
  //     }

  //     // 🔥 Show confirm toast
  //     toast.custom((t) => (
  //       <div className="bg-white shadow-md rounded-md p-5 w-96 border border-gray-200">
  //         <h3 className="text-lg font-semibold mb-2 text-center">
  //           Confirm Parcel Submission
  //         </h3>
  //         <p className="text-gray-700 mb-4 text-center">
  //           Estimated Cost:{" "}
  //           <span className="font-bold text-green-600">৳{cost}</span>
  //         </p>
  //         <div className="flex justify-center gap-4">
  //           <button
  //             className="btn btn-sm btn-success"
  //             onClick={() => {
  //               toast.dismiss(t.id);
  //               handleFinalSubmit(data, cost);
  //             }}
  //           >
  //             Confirm
  //           </button>
  //           <button
  //             className="btn btn-sm btn-outline"
  //             onClick={() => toast.dismiss(t.id)}
  //           >
  //             Cancel
  //           </button>
  //         </div>
  //       </div>
  //     ));
  //   };

  const handleFormSubmit = (data) => {
    const {
      parcelType,
      weight,
      title,
      senderRegion,
      senderServiceCenter,
      senderName,
      senderContact,
      senderAddress,
      pickupInstruction,
      receiverRegion,
      receiverServiceCenter,
      receiverName,
      receiverContact,
      receiverAddress,
      deliveryInstruction,
    } = data;

    const weightValue = parseFloat(weight) || 0;
    const isSameCity =
      senderRegion === receiverRegion &&
      senderServiceCenter === receiverServiceCenter;

    let baseCost = 0;
    let extraCost = 0;
    let outsideCitySurcharge = 0;

    if (parcelType === "document") {
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

    // Build HTML for SweetAlert
    const html = `
    <div style="text-align:left;">
      <h3 class="text-lg font-bold mb-2">📦 Parcel Info</h3>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Type:</strong> ${
        parcelType === "document" ? "Document" : "Non-Document"
      }</p>
      ${
        parcelType === "non-document"
          ? `<p><strong>Weight:</strong> ${weightValue} kg</p>`
          : ""
      }
      <hr class="my-2" />
      <h3 class="text-lg font-bold mb-2">🧍 Sender Info</h3>
      <p><strong>Name:</strong> ${senderName}</p>
      <p><strong>Contact:</strong> ${senderContact}</p>
      <p><strong>Region:</strong> ${senderRegion}</p>
      <p><strong>Service Center:</strong> ${senderServiceCenter}</p>
      <p><strong>Address:</strong> ${senderAddress}</p>
      <p><strong>Pickup Instructions:</strong> ${pickupInstruction}</p>
      <hr class="my-2" />
      <h3 class="text-lg font-bold mb-2">📮 Receiver Info</h3>
      <p><strong>Name:</strong> ${receiverName}</p>
      <p><strong>Contact:</strong> ${receiverContact}</p>
      <p><strong>Region:</strong> ${receiverRegion}</p>
      <p><strong>Service Center:</strong> ${receiverServiceCenter}</p>
      <p><strong>Address:</strong> ${receiverAddress}</p>
      <p><strong>Delivery Instructions:</strong> ${deliveryInstruction}</p>
      <hr class="my-2" />
      <h3 class="text-lg font-bold mb-2">💰 Cost Breakdown</h3>
      <p><strong>Base Cost:</strong> ৳${baseCost}</p>
      ${
        extraCost > 0
          ? `<p><strong>Extra Weight:</strong> ৳${extraCost} (৳40 × ${
              weightValue - 3
            }kg)</p>`
          : ""
      }
      ${
        outsideCitySurcharge > 0
          ? `<p><strong>Outside City Charge:</strong> ৳${outsideCitySurcharge}</p>`
          : ""
      }
      <p class="mt-2 text-xl font-bold text-green-600 border-t pt-2">
        Total Cost: ৳${totalCost}
      </p>
    </div>
  `;

    Swal.fire({
      title: "Confirm Parcel Submission",
      html,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "✅ Proceed to Payment",
      cancelButtonText: "✏️ Edit Info",
      width: 700,
      focusConfirm: false,
      customClass: {
        htmlContainer: "text-sm",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const parcelData = {
          ...data,
          weight: weightValue, // ensure numeric
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
          tracking_id: generateTrackingId(),
        };

        console.log("📦 Final Parcel Data:", parcelData);

        axiosSecure.post("/parcels", parcelData).then((res) => {
          console.log(res.data);
          if (res.data.insertedId) {
            // TODO: redirect to the  payment getway

            Swal.fire("Success", `Proceeding to payment...`, "success");
          }
        });

        //
        reset();
      } else {
        Swal.fire("Edit Mode", "Please make changes as needed.", "info");
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
          <button className="btn btn-primary w-full">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ParcelForm;
