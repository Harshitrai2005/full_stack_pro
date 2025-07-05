import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const { loading, error, message, isAuthenticated } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleUpdatePassword = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }

    dispatch(updatePassword({ oldPassword, newPassword }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <form onSubmit={handleUpdatePassword} className="max-w-md mx-auto space-y-4 mt-10">
      <input
        type="password"
        placeholder="Current Password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
        required
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        value={confirmNewPassword}
        onChange={(e) => setConfirmNewPassword(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-black text-white py-2 rounded hover:bg-white hover:text-black border-2 border-black transition"
      >
        {loading ? "Updating..." : "Update Password"}
      </button>
    </form>
  );
};

export default UpdatePassword;
