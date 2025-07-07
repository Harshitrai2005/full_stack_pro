import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  resetUserSlice,
  promoteUserToAdmin,
} from "../../store/slices/userSlice";
import { toast } from "react-hot-toast";

const Users = () => {
  const dispatch = useDispatch();

  const {
    users,
    loading,
    error,
    message,
    promoteLoading,
    promoteError,
    promoteMessage,
  } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetUserSlice());
      dispatch(fetchAllUsers());
    }
    if (error) {
      toast.error(error);
      dispatch(resetUserSlice());
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    if (promoteMessage) {
      toast.success(promoteMessage);
      dispatch(resetUserSlice());
      dispatch(fetchAllUsers());
    }
    if (promoteError) {
      toast.error(promoteError);
      dispatch(resetUserSlice());
    }
  }, [dispatch, promoteMessage, promoteError]);

  const handleMakeAdmin = (email) => {
    dispatch(promoteUserToAdmin({email}));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      {loading ? (
        <p className="text-lg text-gray-600">Loading users...</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Role</th>
              <th className="py-2 px-4 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="text-center">
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.email}</td>
                  <td className="py-2 px-4 border">{user.role}</td>
                  <td className="py-2 px-4 border">
                    {user.role !== "Admin" ? (
                      <button
                        onClick={() => handleMakeAdmin(user.email)}
                        className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
                        disabled={promoteLoading}
                      >
                        {promoteLoading ? "Processing..." : "Make Admin"}
                      </button>
                    ) : (
                      <span className="text-green-600 font-semibold">Admin</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Users;
