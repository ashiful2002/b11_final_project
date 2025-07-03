import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import GoogleLogin from "../SocialLogin/GoogleLogin/GoogleLogin";
import axios from "axios";
import useAxios from "../../../hooks/useAxios";

const Register = () => {
  const { createUser, updateUserProfile } = useAuth();
  const [userProfilePic, setUserProfilePic] = useState("");
  const axiosInstance = useAxios();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleImageUpload = async (e) => {
    const image = e.target.files[0];
    const formData = new FormData();
    formData.append("image", image);
    const imageUploadUrl = `https://api.imgbb.com/1/upload?key=${
      import.meta.env.VITE_IMGBB_KEY
    }`;
    const res = await axios.post(imageUploadUrl, formData);
    console.log(res.data.data.url);
    setUserProfilePic(res.data.data.url);
  };
  const onRegister = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then(async (res) => {
        console.log(res.user);

        // update user data in database
        const userInfo = {
          email: data.email,
          role: "user",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };
        const userRes = await axiosInstance.post("/users", userInfo);
        console.log(userRes.data);

        // update user profile in firebase
        const updateProfile = {
          displayName: data.name,
          photoURL: userProfilePic,
        };
        updateUserProfile(updateProfile)
          .then(() => {
            console.log("image and name updated");
          })

          .catch((err) => {
            console.error(err);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onRegister)} className="w-full">
        <h1 className="text-3xl font-semibold text-center my-3">
          Register as a new user
        </h1>
        <fieldset className="w-full space-y-4">
          {/* Name field */}
          <label className="label">User Name</label>
          <input
            type="text"
            {...register("name", {
              required: true,
            })}
            className="input w-full"
            placeholder="Your Full Name"
          />
          {/* Image field */}
          <label className="label">Image</label>
          <input
            type="file"
            onChange={handleImageUpload}
            // {...register("image", {
            //   required: true,
            // })}
            className="input w-full cursor-pointer"
            placeholder="Your Profile Picture"
          />

          {/* Email field */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Enter a valid email",
              },
            })}
            className="input w-full"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <label className="label">Password</label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 3,
                message: "Password must be at least 3 characters",
              },
              maxLength: {
                value: 8,
                message: "Password must be at most 8 characters",
              },
            })}
            className="input w-full"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <div>
            <span>Already have an account? </span>
            <Link to="/login" className="link link-hover text-secondary">
              Login
            </Link>
          </div>

          <button
            type="submit"
            className="btn btn-primary text-gray-800 mt-4 w-full"
          >
            Register
          </button>
        </fieldset>
      </form>
      <GoogleLogin />
    </div>
  );
};

export default Register;
