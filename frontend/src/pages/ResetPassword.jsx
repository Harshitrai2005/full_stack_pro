import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { token } = useParams();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

 const handleResetPassword = (e) => {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    toast.error("Passwords do not match");
    return;
  }

  dispatch(
    resetPassword({
      token,
      password: newPassword,
      confirmPassword,
    })
  );
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

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* Left Side */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center h-[450px]">
          <div className="flex justify-center mb-12">
            <img
              src={logo_with_title}
              alt="logo"
              className="mb-12 h-44 w-auto"
            />
          </div>
          <h3 className="text-gray-300 mb-12 max-w-[320px] mx-auto text-3xl font-medium leading-10">
            Reset your password securely and get back to reading!
          </h3>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        <Link
          to="/login"
          className="border-2 border-black rounded-3xl font-bold w-52 py-2 px-4 absolute top-10 left-5 hover:bg-black hover:text-white transition duration-300 text-center"
        >
          Back
        </Link>
        <form
          onSubmit={handleResetPassword}
          className="w-full max-w-sm text-center"
        >
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-20 w-auto" />
          </div>

          <h1 className="text-4xl font-semibold mb-6">Reset Password</h1>
          <p className="text-gray-800 mb-6 text-center">
            Enter your old and new password below
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full px-4 py-3 mb-4 border border-black rounded-md focus:outline-none"
            required
          />

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-4 py-3 mb-4 border border-black rounded-md focus:outline-none"
            required
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm New Password"
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
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

