import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import GoogleLogin from "../SocialLogin/GoogleLogin/GoogleLogin";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="">
      <h1 className="text-3xl font-semibold text-center my-3">Log in user</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
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

          <div className="flex items-center justify-between">
            <div>
              <a className="link link-hover">Forgot password?</a>
            </div>
            <div>
              <span>New user? </span>
              <Link to="/register" className="link link-hover text-secondary">
                Register first
              </Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary text-gray-800 mt-4 w-full">
            Login
          </button>
        </fieldset>
      </form>
            <GoogleLogin />

    </div>
  );
};

export default Login;
