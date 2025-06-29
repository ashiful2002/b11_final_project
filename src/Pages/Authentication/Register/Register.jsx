import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import useAuth from "../../../hooks/useAuth";
import GoogleLogin from "../SocialLogin/GoogleLogin/GoogleLogin";

const Register = () => {
  const { createUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onRegister = (data) => {
    console.log(data);
    createUser(data.email, data.password)
      .then((res) => {
        console.log(res.user);
      })
      .then((error) => {
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
