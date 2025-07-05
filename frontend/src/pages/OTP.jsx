import React from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

import  { useState, useEffect } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";

import { toast } from "react-hot-toast";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (message) {
      toast.success(message);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification({email, otp});
  };

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* Left Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative flex-col">
        <Link
          to={"/register"}
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 absolute top-10 left-5 hover:bg-black hover:text-white transition duration-300 text-end"
        >
          Back
        </Link>

        <div className="flex justify-center mb-12">
          <div className="rounded-full flex items-center justify-center">
            <img src={logo} alt="logo" className="h-24 w-auto" />
          </div>
        </div>

        <h1 className="text-4xl font-medium text-center mb-6">
          Check your Mailbox
        </h1>
        <p className="text-gray-800 mb-6 text-center">
          Please enter the OTP to proceed
        </p>

        <form onSubmit={handleOtpVerification} className="w-full max-w-sm">
          <div className="mb-4">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            VERIFY
          </button>
        </form>
      </div>

      {/* Right Side */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tl-[80px] rounded-bl-[80px]">
        <div className="text-center h-[400px]">
          <div className="flex justify-center mb-12">
            <img
              src={logo_with_title}
              alt="logo"
              className="mb-12 h-44 w-auto"
            />
          </div>

          <p>New to our platform? Sign up now</p>
          <Link
            to={"/register"}
            className="border-2 mt-5 border-white w-full font-semibold bg-white text-black py-2 rounded-lg hover:bg-black hover:text-white transition"
          >
            SIGN UP
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OTP;

