import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate, useNavigate } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { toast } from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

 const handleLogin = (e) => {
  e.preventDefault();
  const data = {
    email,
    password,
  };
  dispatch(login(data)); 
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
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative flex-col">
        <div className="flex justify-center mb-12">
          <div className="rounded-full flex items-center justify-center">
            <img src={logo} alt="logo" className="h-24 w-auto" />
          </div>
        </div>

        <h1 className="text-4xl font-medium text-center mb-12 overflow-hidden">
          Welcome Back!!
        </h1>

        <p className="text-gray-800 mb-6 text-center">
          Please enter the credentials to login
        </p>

        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
              required
            />
          </div>

          <div className="mb-4 text-right">
            <Link
              to={"/password/forgot"}
              className="font-semibold text-black hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="mb-4 text-center">
            <p>
              New to our platform?
              <Link
                to="/register"
                className="text-sm text-gray-500 hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <button
            type="submit"
            className="border-2 mt-5 border-black w-full font-semibold bg-black text-white py-2 rounded-lg hover:bg-white hover:text-black transition"
          >
            SIGN IN
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

export default Login;

