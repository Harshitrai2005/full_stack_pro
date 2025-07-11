import { Book } from "../model/bookModel.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Add a new book
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const book = await Book.create({ title, author, description, price, quantity });

  res.status(201).json({
    success: true,
    message: "Book added successfully",
    book,
  });
});

// Delete a book by ID
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);
  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
  });
});

// Get all books
export const getAllBooks = catchAsyncErrors(async (req, res, next) => {
  const books = await Book.find();

  res.status(200).json({
    success: true,
    books,
  });
});
