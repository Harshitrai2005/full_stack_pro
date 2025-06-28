import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserBorrowedBooks } from "../store/slices/borrowSlice";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import Header from "../layouts/Header";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  useEffect(() => {
    dispatch(fetchUserBorrowedBooks());
  }, [dispatch]);

  const totalBorrowed = userBorrowedBooks.filter(b => !b.returned).length;
  const totalReturned = userBorrowedBooks.filter(b => b.returned).length;

  const chartData = {
    labels: ["Borrowed", "Returned"],
    datasets: [
      {
        label: "Books",
        data: [totalBorrowed, totalReturned],
        backgroundColor: ["#facc15", "#34d399"],
        borderColor: ["#fff", "#fff"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <>
      <Header />
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8 text-center">User Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <img src={bookIcon} alt="bookIcon" className="h-12 w-12" />
            <div>
              <p className="text-gray-500 text-sm">Total Borrowed</p>
              <h2 className="text-2xl font-bold text-yellow-500">{totalBorrowed}</h2>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <img src={returnIcon} alt="returnIcon" className="h-12 w-12" />
            <div>
              <p className="text-gray-500 text-sm">Total Returned</p>
              <h2 className="text-2xl font-bold text-green-500">{totalReturned}</h2>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-5 flex items-center gap-4">
            <img src={browseIcon} alt="browseIcon" className="h-12 w-12" />
            <div>
              <p className="text-gray-500 text-sm">Total Activity</p>
              <h2 className="text-2xl font-bold text-blue-500">
                {totalBorrowed + totalReturned}
              </h2>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white shadow-md p-6 rounded-lg">
          <h3 className="text-xl font-medium text-gray-700 text-center mb-6">
            Book Activity Summary
          </h3>
          <div className="w-full md:w-1/2 mx-auto">
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
