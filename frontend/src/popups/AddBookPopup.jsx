import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-hot-toast";

const AddBookPopup = () => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const { message, loading, error } = useSelector((state) => state.book);

  const handleAddBook = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);

    dispatch(addBook(formData));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(toggleAddBookPopup());

      // Reset form fields
      setTitle("");
      setAuthor("");
      setPrice("");
      setQuantity("");
      setDescription("");
    }
  }, [message, dispatch]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 p-5 flex items-center justify-center z-50">
      <div className="w-full bg-white rounded-lg shadow sm:w-1/2 lg:w-1/3">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Add New Book</h3>
          <form onSubmit={handleAddBook}>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Book Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book's Title"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Book Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Book's Author"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Book Price</label>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Book's Price"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Quantity</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Book's Quantity"
                className="w-full px-4 py-2 border-2 border-black rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-900 font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Book's Description"
                rows={4}
                className="w-full px-4 py-2 border-2 border-black rounded-md"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => dispatch(toggleAddBookPopup())}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBookPopup;

