import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [serviceCenters, setServiceCenters] = useState([]);
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const axiosSecure = useAxiosSecure();
  // ✅ Fetch service center data from public folder
  useEffect(() => {
    fetch("/serviceCenter.json")
      .then((res) => res.json())
      .then((data) => {
        setServiceCenters(data);
        const uniqueRegions = [...new Set(data.map((item) => item.region))];
        setRegions(uniqueRegions);
      })
      .catch((err) => console.error("Failed to load service centers", err));
  }, []);

  // ✅ Watch selected region and filter districts
  const selectedRegion = watch("region");
  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = serviceCenters
        .filter((item) => item.region === selectedRegion)
        .map((item) => item.district);
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  }, [selectedRegion, serviceCenters]);

  // ✅ Set default values for name and email
  useEffect(() => {
    setValue("name", user?.displayName || "");
    setValue("email", user?.email || "");
  }, [user, setValue]);

  const onSubmit = (data) => {
    const riderData = {
      ...data,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    console.log("Rider Application:", riderData);

    axiosSecure.post("/riders", riderData).then((res) => {
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your rider request is under review.",
        });
      }
    });

    reset({
      age: "",
      phone: "",
      nid: "",
      bikeNumber: "",
      region: "",
      district: "",
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h2 className="text-3xl font-bold mb-8 text-center">Be A Rider</h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Name */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">Name</label>
          <input
            type="text"
            {...register("name")}
            
            className="input input-bordered bg-gray-100 w-full"
          />
        </div>

        {/* Email */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">Email</label>
          <input
            type="email"
            {...register("email")}
            
            className="input input-bordered bg-gray-100 w-full"
          />
        </div>

        {/* Age */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">Age</label>
          <input
            type="number"
            {...register("age", { required: true, min: 18 })}
            className="input input-bordered w-full"
            placeholder="Your age"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">Age is required (18+)</p>
          )}
        </div>

        {/* Phone */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">
            Phone Number
          </label>
          <input
            type="text"
            {...register("phone", { required: true })}
            className="input input-bordered w-full"
            placeholder="01XXXXXXXXX"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">Phone is required</p>
          )}
        </div>

        {/* NID */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">
            National ID
          </label>
          <input
            type="text"
            {...register("nid", { required: true })}
            className="input input-bordered w-full"
            placeholder="NID Number"
          />
          {errors.nid && (
            <p className="text-red-500 text-sm mt-1">NID is required</p>
          )}
        </div>

        {/* Bike Registration */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">
            Bike Registration Number
          </label>
          <input
            type="text"
            {...register("bikeNumber", { required: true })}
            className="input input-bordered w-full"
            placeholder="Registration Number"
          />
          {errors.bikeNumber && (
            <p className="text-red-500 text-sm mt-1">Required</p>
          )}
        </div>

        {/* Region */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">Region</label>
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full"
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-red-500 text-sm mt-1">Region is required</p>
          )}
        </div>

        {/* District */}
        <div className="form-control">
          <label className="label text-left font-medium pb-1">District</label>
          <select
            {...register("district", { required: true })}
            className="select select-bordered w-full"
            disabled={!selectedRegion}
          >
            <option value="">Select District</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">District is required</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button type="submit" className="btn btn-primary text-neutral-600 w-full mt-2">
            Submit Rider Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
