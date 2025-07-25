import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import bookReducer from "./slices/bookSlice";
import borrowReducer from "./slices/borrowSlice";
import popupReducer from "./slices/popupSlice";
import userReducer from "./slices/userSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    book: bookReducer,
    borrow: borrowReducer,
    popup: popupReducer,
    user: userReducer,
  },
});

export { store };
