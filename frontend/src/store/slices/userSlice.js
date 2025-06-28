import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1/user";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    error: null,
    message: null,
    users: [],
  },
  reducers: {
    fetchAllUsersRequest: (state) => {
      state.loading = true;
    },
    fetchAllUsersSuccess: (state, action) => {
      state.loading = false;
      state.users = action.payload;
    },
    fetchAllUsersFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addNewAdminRequest: (state) => {
      state.loading = true;
    },
    addNewAdminSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addNewAdminFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetUserSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const {
  fetchAllUsersRequest,
  fetchAllUsersSuccess,
  fetchAllUsersFailed,
  addNewAdminRequest,
  addNewAdminSuccess,
  addNewAdminFailed,
  resetUserSlice,
} = userSlice.actions;

export default userSlice.reducer;

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(fetchAllUsersRequest());
  try {
    const { data } = await axios.get(`${API}/all`, {
      withCredentials: true,
    });
    dispatch(fetchAllUsersSuccess(data.users));
  } catch (err) {
    dispatch(fetchAllUsersFailed(err.response?.data?.message || "Failed to fetch users"));
  }
};

export const addNewAdmin = (formData) => async (dispatch) => {
  dispatch(addNewAdminRequest());
  try {
    const { data } = await axios.post(`${API}/add/new-admin`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });
    dispatch(addNewAdminSuccess(data.message));
  } catch (err) {
    dispatch(addNewAdminFailed(err.response?.data?.message || "Failed to add admin"));
  }
};
