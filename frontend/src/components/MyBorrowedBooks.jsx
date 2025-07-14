import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import { BookA } from "lucide-react";

const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  const formattedDate = date.toLocaleDateString("en-US", options);
  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formattedDate} ${formattedTime}`;
};

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();
  const { userBorrowedBooks, loading } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  return (
    <>
      <Header />
      <div className="flex flex-col p-4 md:p-8 w-full overflow-auto">
        <div className="flex items-center mb-6">
          <BookA className="w-7 h-7 mr-2" />
          <h1 className="text-xl font-bold">My Borrowed Books</h1>
        </div>

        {loading ? (
          <p className="text-center font-semibold mt-4">Loading...</p>
        ) : userBorrowedBooks.length === 0 ? (
          <p className="text-center font-semibold mt-4">No books found.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-gray-300 shadow-md">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Book Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Borrowed On</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Return Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userBorrowedBooks.map((book, index) => (
                  <tr
                    key={book._id || index}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
                  >
                    <td className="px-6 py-4 text-sm font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-sm">
                      {book.bookId?.title || "Untitled"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      ₹{book.bookId?.price || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDateTime(book.borrowedDate)}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {book.returned ? formatDateTime(book.returnDate) : "Not Returned"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {book.returned ? "Returned" : "Borrowed"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default MyBorrowedBooks;
