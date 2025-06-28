import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  message: null,
  userBorrowedBooks: [],
  allBorrowedBooks: [],
};

const borrowSlice = createSlice({
  name: "borrow",
  initialState,
  reducers: {
    fetchUserBorrowedBooksRequest: (state) => {
      state.loading = true;
    },
    fetchUserBorrowedBooksSuccess: (state, action) => {
      state.loading = false;
      state.userBorrowedBooks = action.payload;
    },
    fetchUserBorrowedBooksFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchAllBorrowedBooksRequest: (state) => {
      state.loading = true;
    },
    fetchAllBorrowedBooksSuccess: (state, action) => {
      state.loading = false;
      state.allBorrowedBooks = action.payload;
    },
    fetchAllBorrowedBooksFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    recordBorrowedBookRequest: (state) => {
      state.loading = true;
    },
    recordBorrowedBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    recordBorrowedBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    returnBookRequest: (state) => {
      state.loading = true;
    },
    returnBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetBorrowSlice: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
});

export const fetchUserBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const { data } = await axios.get("/api/v1/borrow/user");
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksSuccess(data.borrowedBooks));
  } catch (error) {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(error.response.data.message));
  }
};

export const fetchAllBorrowedBooks = () => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const { data } = await axios.get("/api/v1/borrow/all");
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksSuccess(data.borrowedBooks));
  } catch (error) {
    dispatch(borrowSlice.actions.fetchAllBorrowedBooksFailed(error.response.data.message));
  }
};

export const recordBorrowedBook = (formData) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBorrowedBookRequest());
  try {
    const { data } = await axios.post("/api/v1/borrow", formData);
    dispatch(borrowSlice.actions.recordBorrowedBookSuccess(data.message));
  } catch (error) {
    dispatch(borrowSlice.actions.recordBorrowedBookFailed(error.response.data.message));
  }
};

export const returnBook = (formData) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const { data } = await axios.post("/api/v1/borrow/return", formData);
    dispatch(borrowSlice.actions.returnBookSuccess(data.message));
  } catch (error) {
    dispatch(borrowSlice.actions.returnBookFailed(error.response.data.message));
  }
};

export const {
  fetchUserBorrowedBooksRequest,
  fetchUserBorrowedBooksSuccess,
  fetchUserBorrowedBooksFailed,
  fetchAllBorrowedBooksRequest,
  fetchAllBorrowedBooksSuccess,
  fetchAllBorrowedBooksFailed,
  recordBorrowedBookRequest,
  recordBorrowedBookSuccess,
  recordBorrowedBookFailed,
  returnBookRequest,
  returnBookSuccess,
  returnBookFailed,
  resetBorrowSlice,
} = borrowSlice.actions;

export default borrowSlice.reducer;
