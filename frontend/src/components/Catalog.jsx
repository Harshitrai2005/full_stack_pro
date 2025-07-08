import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import { toggleReturnBookPopup } from "../store/slices/popupSlice";

// Icons
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";


import ReturnBookPopup from "../popups/ReturnBookPopup";

const Catalog = () => {
  const dispatch = useDispatch();
  const { returnBookPopup } = useSelector((state) => state.popup);
  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const currentDate = new Date();

  const borrowedBooks = allBorrowedBooks?.filter(
    (book) => new Date(book.dueDate) > currentDate
  );
  const overdueBooks = allBorrowedBooks?.filter(
    (book) => new Date(book.dueDate) <= currentDate
  );
  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  const openReturnBookPopup = (book) => {
    dispatch(
      toggleReturnBookPopup({
        _id: book._id,
        userEmail: book.user.email,
        title: book.title,
      })
    );
  };

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Borrowed Books Catalog</h2>

      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${
            filter === "borrowed" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("borrowed")}
        >
          borrowed not overdue
        </button>
        <button
          className={`px-4 py-2 rounded ${
            filter === "overdue" ? "bg-red-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setFilter("overdue")}
      >
          Overdue
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {booksToDisplay?.map((book) => (
            <div
              key={book._id}
              className="p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p>
                  <strong>Title:</strong> {book.title}
                </p>
                <p>
                  <strong>Email:</strong> {book.user.email}
                </p>
                <p>
                  <strong>Due Date:</strong> {formatDateTime(book.dueDate)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {filter === "borrowed" ? (
                  <button
                    onClick={() => openReturnBookPopup(book)}
                    className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800"
                  >
                    <PiKeyReturnBold size={18} /> Return
                  </button>
                ) : (
                  <div className="text-green-600 flex items-center gap-1">
                    <FaSquareCheck size={18} /> Returned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

  
      {returnBookPopup && <ReturnBookPopup />}
    </div>
  );
};

export default Catalog;
