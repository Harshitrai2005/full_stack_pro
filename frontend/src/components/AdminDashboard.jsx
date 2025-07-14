import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import { fetchAllUsers } from "../store/slices/userSlice";
import { fetchAllBooks } from "../store/slices/bookSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
import { Pie } from "react-chartjs-2";

import userIcon from "../assets/people.png";
import bookIcon from "../assets/book.png";
import borrowIcon from "../assets/book-square.png";

import {
Chart as ChartJS,
ArcElement,
Tooltip,
Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
const dispatch = useDispatch();
const { users } = useSelector((state) => state.user);
const { books } = useSelector((state) => state.book);
const { allBorrowedBooks } = useSelector((state) => state.borrow);

useEffect(() => {
dispatch(fetchAllUsers());
dispatch(fetchAllBooks());
dispatch(fetchAllBorrowedBooks());
}, [dispatch]);

const totalUsers = useMemo(
() => users.filter((u) => u.role === "User").length,
[users]
);

const totalBooks = useMemo(() => books.length, [books]);

const totalReturned = useMemo(
() => allBorrowedBooks.filter((b) => b.returnDate !== null).length,
[allBorrowedBooks]
);

const totalBorrowed = useMemo(() => allBorrowedBooks.length, [allBorrowedBooks]);

const chartData = {
labels: ["Currently Borrowed", "Returned"],
datasets: [
{
label: "Borrow Stats",
data: [totalBorrowed - totalReturned, totalReturned],
backgroundColor: ["#f97316", "#10b981"],
borderColor: ["#fff", "#fff"],
borderWidth: 2,
},
],
};

return (
<>
<Header />
<div className="p-6 max-w-6xl mx-auto">
<h1 className="text-3xl font-semibold mb-8 text-center">Admin Dashboard</h1>

php-template
Copy
Edit
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
        <img src={userIcon} alt="users" className="h-12 w-12" />
        <div>
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold text-blue-600">{totalUsers}</h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
        <img src={bookIcon} alt="books" className="h-12 w-12" />
        <div>
          <p className="text-gray-500 text-sm">Total Books</p>
          <h2 className="text-2xl font-bold text-purple-600">{totalBooks}</h2>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
        <img src={borrowIcon} alt="borrow" className="h-12 w-12" />
        <div>
          <p className="text-gray-500 text-sm">Total Borrow Records</p>
          <h2 className="text-2xl font-bold text-orange-500">{totalBorrowed}</h2>
        </div>
      </div>
    </div>

    <div className="mt-12 bg-white shadow-md p-6 rounded-lg">
      <h3 className="text-xl font-medium text-gray-700 text-center mb-6">
        Borrow vs Return
      </h3>
      <div className="w-full md:w-1/2 mx-auto">
        <Pie data={chartData} />
      </div>
    </div>
  </div>
</>
);
};

export default AdminDashboard;
