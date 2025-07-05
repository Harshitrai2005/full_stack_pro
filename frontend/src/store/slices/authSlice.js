import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: null,
    isAuthenticated: false,
    error: null,
    message: null,
  },
  reducers: {
    registerRequest: (state) => { state.loading = true; },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.message = "Registered successfully";
    },
    registerFailed: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    loginRequest: (state) => { state.loading = true; },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.message = "Logged in successfully";
    },
    loginFailed: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    logoutRequest: (state) => { state.loading = true; },
    logoutSuccess: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.message = "Logged out successfully";
    },
    logoutFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    otpVerificationRequest: (state) => { state.loading = true; },
    otpVerificationSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.message = "OTP verified successfully";
    },
    otpVerificationFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    getUserRequest: (state) => { state.loading = true; },
    getUserSuccess: (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    getUserFailed: (state, action) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = action.payload;
    },
    forgotPasswordRequest: (state) => { state.loading = true; },
    forgotPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    forgotPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetPasswordRequest: (state) => { state.loading = true; },
    resetPasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    resetPasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updatePasswordRequest: (state) => { state.loading = true; },
    updatePasswordSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updatePasswordFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetAuthSlice: (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.message = null;
    },
    clearError: (state) => { state.error = null; },
    clearMessage: (state) => { state.message = null; },
  },
});

export const {
  registerRequest, registerSuccess, registerFailed,
  loginRequest, loginSuccess, loginFailed,
  logoutRequest, logoutSuccess, logoutFailed,
  otpVerificationRequest, otpVerificationSuccess, otpVerificationFailed,
  getUserRequest, getUserSuccess, getUserFailed,
  forgotPasswordRequest, forgotPasswordSuccess, forgotPasswordFailed,
  resetPasswordRequest, resetPasswordSuccess, resetPasswordFailed,
  updatePasswordRequest, updatePasswordSuccess, updatePasswordFailed,
  resetAuthSlice, clearError, clearMessage,
} = authSlice.actions;

export default authSlice.reducer;

// THUNK FUNCTIONS — correctly mapped to backend routes

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const { data } = await axios.post(`${API}/register`, userData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(registerSuccess(data.user));
  } catch (err) {
    dispatch(registerFailed(err.response?.data?.message || "Registration failed"));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    const { data } = await axios.post(`${API}/login`, credentials, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    dispatch(loginSuccess(data.user));
  } catch (err) {
    dispatch(loginFailed(err.response?.data?.message || "Login failed"));
  }
};



export const logout = () => async (dispatch) => {
  try {
    dispatch(logoutRequest());
    await axios.get(`${API}/logout`, { withCredentials: true });
    dispatch(logoutSuccess());
  } catch (err) {
    dispatch(logoutFailed(err.response?.data?.message || "Logout failed"));
  }
};

export const otpVerification = (payload) => async (dispatch) => {
  try {
    dispatch(otpVerificationRequest());
    const { data } = await axios.post(`${API}/verify-otp`, payload, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(otpVerificationSuccess(data.user));
  } catch (err) {
    dispatch(otpVerificationFailed(err.response?.data?.message || "OTP verification failed"));
  }
};

export const getUser = () => async (dispatch) => {
  try {
    dispatch(getUserRequest());
    const { data } = await axios.get(`${API}/me`, { withCredentials: true });
    dispatch(getUserSuccess(data.user));
  } catch (err) {
    dispatch(getUserFailed(err.response?.data?.message || "Failed to get user"));
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const { data } = await axios.post(`${API}/password/forgot`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(forgotPasswordSuccess(data.message));
  } catch (err) {
    dispatch(forgotPasswordFailed(err.response?.data?.message || "Forgot password failed"));
  }
};

export const resetPassword = ({ token, password, confirmPassword }) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const { data } = await axios.put(`${API}/password/reset/${token}`, {
      password,
      confirmPassword,
    }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(resetPasswordSuccess(data.message));
  } catch (err) {
    dispatch(resetPasswordFailed(err.response?.data?.message || "Reset password failed"));
  }
};

export const updatePassword = ({ oldPassword, newPassword }) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const { data } = await axios.put(`${API}/password/update`, {
      oldPassword,
      newPassword,
    }, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(updatePasswordSuccess(data.message));
  } catch (err) {
    dispatch(updatePasswordFailed(err.response?.data?.message || "Update password failed"));
  }
};
