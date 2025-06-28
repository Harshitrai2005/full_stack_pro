import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  message: null,
  books: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    fetchAllBooksRequest: (state) => {
      state.loading = true;
    },
    fetchAllBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    fetchAllBooksFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

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

    resetBookSlice: (state) => {
      state.loading = false;
      state.message = null;
      state.error = null;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchAllBooksRequest());
  try {
    const { data } = await axios.get("/api/v1/books");
    dispatch(bookSlice.actions.fetchAllBooksSuccess(data.books));
  } catch (error) {
    dispatch(bookSlice.actions.fetchAllBooksFailed(error.response.data.message));
  }
};

export const addBook = (formData) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const { data } = await axios.post("/api/v1/book/new", formData);
    dispatch(bookSlice.actions.addBookSuccess(data.message));
  } catch (error) {
    dispatch(bookSlice.actions.addBookFailed(error.response.data.message));
  }
};

export const {
  fetchAllBooksRequest,
  fetchAllBooksSuccess,
  fetchAllBooksFailed,
  addBookRequest,
  addBookSuccess,
  addBookFailed,
  resetBookSlice,
} = bookSlice.actions;

export default bookSlice.reducer;
