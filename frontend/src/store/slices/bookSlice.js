import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:4000/api/v1/book";

const bookSlice = createSlice({
  name: "book",
  initialState: {
    loading: false,
    books: [],
    error: null,
    message: null,
  },
  reducers: {
    addBookRequest: (state) => {
      state.loading = true;
    },
    addBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchBooksRequest: (state) => {
      state.loading = true;
    },
    fetchBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteBookRequest: (state) => {
      state.loading = true;
    },
    deleteBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    deleteBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    resetBookSlice: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
});

export const {
  addBookRequest,
  addBookSuccess,
  addBookFailed,
  fetchBooksRequest,
  fetchBooksSuccess,
  fetchBooksFailed,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailed,
  resetBookSlice,
} = bookSlice.actions;

export default bookSlice.reducer;

export const addBook = (formData) => async (dispatch) => {
  dispatch(addBookRequest());
  try {
    const { data } = await axios.post(`${API}/admin/add`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    dispatch(addBookSuccess(data.message));
  } catch (err) {
    dispatch(addBookFailed(err.response?.data?.message || "Failed to add book"));
  }
};

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(fetchBooksRequest());
  try {
    const { data } = await axios.get(`${API}/all`, {
      withCredentials: true,
    });
    dispatch(fetchBooksSuccess(data.books));
  } catch (err) {
    dispatch(fetchBooksFailed(err.response?.data?.message || "Failed to fetch books"));
  }
};

export const deleteBook = (id) => async (dispatch) => {
  dispatch(deleteBookRequest());
  try {
    const { data } = await axios.delete(`${API}/delete/${id}`, {
      withCredentials: true,
    });
    dispatch(deleteBookSuccess(data.message));
  } catch (err) {
    dispatch(deleteBookFailed(err.response?.data?.message || "Failed to delete book"));
  }
};
