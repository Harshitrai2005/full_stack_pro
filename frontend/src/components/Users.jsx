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
    if (message || error) {
      toast[error ? "error" : "success"](error || message);
      dispatch(resetUserSlice());
      dispatch(fetchAllUsers());
    }
  }, [dispatch, error, message]);

  useEffect(() => {
    if (promoteMessage || promoteError) {
      toast[promoteError ? "error" : "success"](promoteError || promoteMessage);
      dispatch(resetUserSlice());
      dispatch(fetchAllUsers());
    }
  }, [dispatch, promoteMessage, promoteError]);

  const handleMakeAdmin = (email) => {
    dispatch(promoteUserToAdmin({ email }));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">All Users</h2>

      {loading ? (
        <p className="text-lg text-gray-600">Loading users...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-3 border">Name</th>
                <th className="py-2 px-3 border">Email</th>
                <th className="py-2 px-3 border">Role</th>
                <th className="py-2 px-3 border">Verified</th>
                <th className="py-2 px-3 border">Books Borrowed</th>
                <th className="py-2 px-3 border">Avatar</th>
                <th className="py-2 px-3 border">Joined On</th>
                <th className="py-2 px-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="text-center">
                    <td className="py-2 px-3 border">{user.name}</td>
                    <td className="py-2 px-3 border">{user.email}</td>
                    <td className="py-2 px-3 border">{user.role}</td>
                    <td className="py-2 px-3 border">
                      {user.accountVerified ? "Yes" : "No"}
                    </td>
                    <td className="py-2 px-3 border">
                      {user.borrowedBooks?.length || 0}
                    </td>
                    <td className="py-2 px-3 border">
                      {user.avatar?.url ? (
                        <img
                          src={user.avatar.url}
                          alt="avatar"
                          className="h-8 w-8 rounded-full mx-auto"
                        />
                      ) : (
                        "N/A"
                      )}
                    </td>
                    <td className="py-2 px-3 border">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-3 border">
                      {user.role !== "Admin" ? (
                        <button
                          onClick={() => handleMakeAdmin(user.email)}
                          className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 disabled:opacity-50"
                          disabled={promoteLoading}
                        >
                          {promoteLoading ? "..." : "Make Admin"}
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">Admin</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-4 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Users;
