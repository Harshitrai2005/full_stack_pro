import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { recordBorrowedBook, fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popupSlice";
import { toast } from "react-hot-toast";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleRecordBook = async (e) => {
    e.preventDefault();
    dispatch(recordBorrowedBook({ bookId, email }))
      .then((res) => {
        toast.success(res.message || "Book recorded successfully");
        dispatch(toggleRecordBookPopup());
        dispatch(fetchAllBorrowedBooks()); 
      })
      .catch((err) => {
        toast.error(err.message || "Failed to record book");
      });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow sm:w-1/2 lg:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Record Book</h3>
          <form onSubmit={handleRecordBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">User Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Borrower's Email"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                type="button"
                onClick={() => dispatch(toggleRecordBookPopup())}
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecordBookPopup;
