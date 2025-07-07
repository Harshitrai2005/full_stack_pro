import React, { useState, useEffect } from "react";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword, resetAuthSlice } from "../store/slices/authSlice";
import { toggleSettingPopup } from "../store/slices/popupSlice";
import { toast } from "react-hot-toast";

const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleConfirm = (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match");
      return;
    }

    dispatch(updatePassword({ currentPassword, newPassword, confirmNewPassword }));
  };

  const handleCancel = () => {
    dispatch(toggleSettingPopup());
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
      dispatch(toggleSettingPopup());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error]);

  return (
    <div className="fixed inset-0 z-30 bg-black bg-opacity-40 flex justify-center items-center px-4">
      <div className="relative bg-white rounded-md w-full max-w-md p-6">
        <img
          src={closeIcon}
          alt="close"
          className="absolute top-4 right-4 h-6 w-6 cursor-pointer"
          onClick={handleCancel}
        />
        <div className="flex flex-col items-center gap-2 mb-6">
          <img src={keyIcon} alt="key" className="w-12 h-12" />
          <h1 className="text-xl font-semibold">Update Password</h1>
        </div>
        <form onSubmit={handleConfirm}>
          <input
            type="password"
            placeholder="Current Password"
            className="w-full px-4 py-2 border border-black rounded-md mb-4"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full px-4 py-2 border border-black rounded-md mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full px-4 py-2 border border-black rounded-md mb-6"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            required
          />
          <div className="flex justify-end gap-4">
            <button
              type="button"
              className="border border-black px-5 py-2 rounded-md text-black hover:bg-black hover:text-white transition"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white px-5 py-2 rounded-md hover:bg-white hover:text-black border border-black transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Confirm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPopup;


