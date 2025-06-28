import React, { useState, useEffect } from "react";
import placeHolder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png";
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin, resetUserSlice } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popupSlice";
import { toast } from "react-hot-toast";

const AddNewAdmin = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(placeHolder);

  const { loading, error, message } = useSelector((state) => state.user);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setAvatar(file);
    };
    reader.readAsDataURL(file);
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    if (avatar) data.append("avatar", avatar);
    dispatch(addNewAdmin(data));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetUserSlice());
      dispatch(toggleAddNewAdminPopup());
    }
    if (error) {
      toast.error(error);
      dispatch(resetUserSlice());
    }
  }, [dispatch, message, error]);

  return (
    <div className="fixed top-0 left-0 z-50 w-full h-screen bg-black bg-opacity-40 flex justify-center items-center px-2">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg relative p-6">
        <img
          src={closeIcon}
          alt="close"
          className="w-6 h-6 absolute right-5 top-5 cursor-pointer"
          onClick={() => dispatch(toggleAddNewAdminPopup())}
        />

        <div className="flex justify-center mb-6">
          <label htmlFor="avatar-input">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-24 h-24 rounded-full object-cover cursor-pointer border border-gray-300"
            />
            <input
              id="avatar-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <h2 className="text-center text-2xl font-semibold mb-4">Add New Admin</h2>

        <form onSubmit={handleAddNewAdmin} className="space-y-4">
          <input
            type="text"
            value={name}
            placeholder="Full Name"
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
            required
          />
          <input
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
            required
          />
          <div className="relative">
            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none"
              required
            />
            <img src={keyIcon} alt="key" className="w-5 h-5 absolute right-3 top-3.5" />
          </div>

          <div className="flex justify-between items-center gap-4 mt-6">
            <button
              type="submit"
              className="w-1/2 bg-black text-white py-2 rounded-md font-semibold hover:bg-gray-800 transition"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Admin"}
            </button>
            <button
              type="button"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="w-1/2 bg-gray-200 text-black py-2 rounded-md font-semibold hover:bg-gray-300 transition"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;

