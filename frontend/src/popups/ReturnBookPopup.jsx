import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { toast } from "react-hot-toast";
import { toggleReturnBookPopup } from "../store/slices/popupSlice";

const ReturnBookPopup = () => {
  const dispatch = useDispatch();
  const { returnBookPopupData } = useSelector((state) => state.popup);

  const [bookId] = useState(returnBookPopupData?._id || "");
  const [email] = useState(returnBookPopupData?.userEmail || "");

 const handleReturn = () => {
  if (!bookId || !email) {
    toast.error("Missing book or email");
    return;
  }

  dispatch(returnBook(bookId, email)).then(() => {
    toast.success("Book returned successfully");
    dispatch(toggleReturnBookPopup());
  });
};


  const handleClose = () => {
    dispatch(toggleReturnBookPopup());
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md relative">
        <img
          src={closeIcon}
          alt="close"
          className="w-6 h-6 absolute right-4 top-4 cursor-pointer"
          onClick={handleClose}
        />
        <h2 className="text-xl font-semibold mb-4 text-center">Return Book</h2>

        <p className="text-gray-700 mb-6 text-center">
          Are you sure you want to return the book{" "}
          <span className="font-medium">
            {returnBookPopupData?.title || "Unknown"}
          </span>{" "}
         ?
        </p>

        <div className="flex justify-between mt-4">
          <button
            onClick={handleClose}
            className="w-1/2 mr-2 border border-black py-2 rounded-md hover:bg-black hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleReturn}
            className="w-1/2 ml-2 bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
