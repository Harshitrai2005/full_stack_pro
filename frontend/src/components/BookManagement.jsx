import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BookA, NotebookPen, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

import { fetchAllBooks, deleteBook } from "../store/slices/bookSlice";
import {
  toggleAddBookPopup,
  toggleReadBookPopup,
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";

import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();
  const { books } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );

  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredBooks(books);
    } else {
      const filtered = books.filter((book) =>
        book.title.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredBooks(filtered);
    }
  }, [search, books]);

  useEffect(() => {
    if (!readBookPopup && !recordBookPopup) {
      setSelectedBook(null);
    }
  }, [readBookPopup, recordBookPopup]);

  const openReadPopup = (book) => {
    setSelectedBook(book);
    dispatch(toggleReadBookPopup());
  };

  const openRecordPopup = (book) => {
    setSelectedBook(book);
    dispatch(toggleRecordBookPopup());
  };
  
  const handleDeleteBook = (bookId) => {
  if (window.confirm("Are you sure you want to delete this book?")) {
    dispatch(deleteBook({ bookId }));
    toast.success("Book deleted successfully!");
    dispatch(fetchAllBooks());
  }
};



  return (
    <div className="w-full px-4 py-6 md:px-10 md:py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Book Management</h1>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search books by title"
            className="border border-black px-4 py-2 rounded-md focus:outline-none"
          />
          <button
            onClick={() => dispatch(toggleAddBookPopup())}
            className="bg-black text-white px-4 py-2 rounded-md flex items-center space-x-2"
          >
            <BookA className="w-5 h-5" />
            <span>Add Book</span>
          </button>
        </div>
      </div>

      {filteredBooks.length === 0 ? (
        <div className="text-center text-gray-500 py-10 text-lg">No books found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-6 py-3 text-left">Author</th>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Price</th>
                <th className="px-6 py-3 text-left">Quantity</th>
                <th className="px-6 py-3 text-left">Availability</th>
                <th className="px-6 py-3 text-left">View</th>
                {user?.role === "Admin" && (
                  <>
                    <th className="px-6 py-3 text-left">Record Book</th>
                    <th className="px-6 py-3 text-left">Delete</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book, index) => (
                <tr
                  key={book._id}
                  className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                >
                  <td className="px-6 py-4">{book.author}</td>
                  <td className="px-6 py-4">{book.title}</td>
                  <td className="px-6 py-4">₹{book.price}</td>
                  <td className="px-6 py-4">{book.quantity}</td>
                  <td className="px-6 py-4">
                    {book.availability ? "Available" : "Unavailable"}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openReadPopup(book)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                  {user?.role === "Admin" && (
                    <>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openRecordPopup(book)}
                          className="flex items-center text-sm text-blue-600 font-medium hover:underline"
                        >
                          <NotebookPen className="w-4 h-4 mr-1" />
                          Record
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleDeleteBook(book._id)}
                          className="flex items-center text-sm text-red-600 font-medium hover:underline"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {addBookPopup && <AddBookPopup />}
      {readBookPopup && selectedBook && <ReadBookPopup book={selectedBook} />}
      {recordBookPopup && selectedBook && <RecordBookPopup bookId={selectedBook._id} />}
    </div>
  );
};

export default BookManagement;

