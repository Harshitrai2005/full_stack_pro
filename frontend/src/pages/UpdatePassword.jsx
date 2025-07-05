import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-hot-toast";
import { Navigate } from "react-router-dom";

const UpdatePassword = () => {
  const dispatch = useDispatch();
  const { loading, message, error, isAuthenticated } = useSelector((state) => state.auth);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("New and confirm passwords do not match");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Update Password</h2>

        <input
          type="password"
          placeholder="Current Password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-3 border rounded"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          className="w-full px-4 py-2 mb-4 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-semibold rounded transition ${
            loading
              ? "bg-gray-300 text-white cursor-not-allowed"
              : "bg-black text-white hover:bg-white hover:text-black border-2 border-black"
          }`}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePassword;
