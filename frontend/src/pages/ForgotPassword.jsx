import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email.trim());
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if (isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen bg-white">
      {/* Left Side (Illustration) */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center max-w-[400px]">
          <img src={logo_with_title} alt="logo" className="mb-12 h-44 mx-auto" />
          <h3 className="text-gray-300 text-3xl font-medium leading-10">
            Your premier digital library for borrowing books.
          </h3>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 relative">
        <Link
          to="/login"
          className="absolute top-10 left-5 border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 hover:bg-black hover:text-white transition duration-300 text-center"
        >
          Back
        </Link>

        <form onSubmit={handleForgotPassword} className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-20 w-auto" />
          </div>

          <h1 className="text-4xl font-semibold mb-6">Forgot Password</h1>
          <p className="text-gray-700 mb-6">Enter your email to reset your password</p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-3 mb-4 border border-black rounded-md focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`border-2 w-full font-semibold py-2 rounded-lg transition ${
              loading
                ? "bg-gray-300 border-gray-300 text-white cursor-not-allowed"
                : "bg-black text-white border-black hover:bg-white hover:text-black"
            }`}
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>

          <p className="mt-6 text-sm text-gray-600">
            Remember your password?{" "}
            <Link to="/login" className="text-black font-semibold underline hover:text-gray-800">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
