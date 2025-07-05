import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import SideBar from "../components/SideBar";
import UserDashBoard from "../components/UserDashBoard";
import AdminDashBoard from "../components/AdminDashBoard";
import BookManagement from "../components/BookManagement";
import Users from "../components/Users";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import UpdatePassword from "./UpdatePassword";


const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const renderComponent = () => {
    switch (selectedComponent) {
      case "Dashboard":
        return user?.role === "User" ? <UserDashBoard /> : <AdminDashBoard />;
      case "Books":
        return <BookManagement />;
      case "Catalog":
        return user?.role === "Admin" ? <Users /> : null;
      case "Users":
        return user?.role === "Admin" ? <Users /> : null;
      case "My Borrowed Books":
        return <MyBorrowedBooks />;
      case "Update Password":
        return <UpdatePassword />;
      default:
        return user?.role === "User" ? <UserDashBoard /> : <AdminDashBoard />;
    }
  };

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100">
      <div className="md:hidden z-10 absolute right-6 top-4 sm:top-6 flex justify-center items-center bg-black rounded-md h-9 w-9 text-white">
        <GiHamburgerMenu
          className="text-2xl"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        />
      </div>

      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      <div className="flex-1 p-4">{renderComponent()}</div>
    </div>
  );
};

export default Home;
