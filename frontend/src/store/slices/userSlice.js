import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toggleAddNewAdminPopup } from "./popupSlice";

const initialState = {
  loading: false,
  error: null,
  message: null,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
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
      state.message = null;
      state.error = null;
    },
  },
});

export const fetchAllUsers = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  try {
    const { data } = await axios.get("/api/v1/users");
    dispatch(userSlice.actions.fetchAllUsersSuccess(data.users));
  } catch (error) {
    dispatch(userSlice.actions.fetchAllUsersFailed(error.response.data.message));
  }
};

export const addNewAdmin = (formData) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try {
    const { data } = await axios.post("/api/v1/user/new-admin", formData);
    dispatch(userSlice.actions.addNewAdminSuccess(data.message));
    dispatch(toggleAddNewAdminPopup());
    dispatch(fetchAllUsers());
  } catch (error) {
    dispatch(userSlice.actions.addNewAdminFailed(error.response.data.message));
  }
};

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
