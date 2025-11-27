import React from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { returnBorrowedBook, fetchAllBorrowedBooks} from "../store/slices/borrowSlice";
import {fetchAllBooks} from "../store/slices/bookSlice";
import { toast } from "react-hot-toast";
import { toggleReturnBookPopup } from "../store/slices/popUpSlice";

const ReturnBookPopup = () => {
const dispatch = useDispatch();
const { returnBookPopupData } = useSelector((state) => state.popup);

const bookId = returnBookPopupData?._id || "";
const email = returnBookPopupData?.userEmail || "";

const handleReturn = () => {
if (!bookId || !email) {
toast.error("Missing book or email");
return;
}


dispatch(returnBorrowedBook({ bookId, email }))
      .then((res) => {
        toast.success(res.message || "Book returned successfully");
        dispatch(toggleReturnBookPopup());
        dispatch(fetchAllBorrowedBooks());
        dispatch(fetchAllBooks());
      })
      .catch((err) => {
        toast.error(err.message || "Failed to return book");
      });
  
};

const handleClose = () => {
dispatch(toggleReturnBookPopup());
};

return (
<div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
<div className="bg-white p-6 rounded-xl w-full max-w-md relative">
<img src={closeIcon} alt="close" className="w-6 h-6 absolute right-4 top-4 cursor-pointer" onClick={handleClose} />
<h2 className="text-xl font-semibold mb-4 text-center">Return Book</h2>


    <p className="text-gray-700 mb-6 text-center">
      Are you sure you want to return this book?
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
