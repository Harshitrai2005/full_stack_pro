import React from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";


import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { register, resetAuthSlice } from "../store/slices/authSlice";


const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    const data = {
  name,
  email,
  password,
};
dispatch(register(data)); 

  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      navigate(`/otp-verification/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, error, message, navigate]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen">
      {/* Left Side */}
      <div className="hidden w-full md:w-1/2 bg-black text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px]">
        <div className="text-center space-y-4">
          <img src={logo_with_title} alt="logo" />
          <p>Already have an account?</p>
          <Link to="/login" className="underline">
            SIGN IN
          </Link>
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">
          <div className="flex justify-center mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <h3 className="font-medium text-4xl">SIGN UP</h3>
              <img src={logo} alt="logo" className="h-auto w-24 object-cover" />
            </div>
          </div>

          <p className="text-gray-800 text-center mb-12">
            Please provide your information to sign up
          </p>

          <form onSubmit={handleRegister}>
            <div className="mb-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                required
              />
            </div>

            <div className="mb-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                required
              />
            </div>

            <div className="mb-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
                required
              />
            </div>

            <div className="block md:hidden font-semibold mt-5">
              <p>Already have an account?</p>
              <Link to="/login" className="text-sm text-gray-500 hover:underline">
                SIGN IN
              </Link>
            </div>

            <button
              type="submit"
              className="border-2 mt-5 w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;

