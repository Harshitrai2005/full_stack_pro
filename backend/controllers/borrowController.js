import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import { Borrow } from "../model/borrowModel.js";
import { Book } from "../model/bookModel.js";
import { User } from "../model/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

// Record a borrowed book
export const recordBorrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available", 400));
  }

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );
  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book is already borrowed", 400));
  }

  const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate,
  });

  await user.save();

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate,
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully",
  });
});

// Get books borrowed by logged-in user
export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowedBooks } = req.user;

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});

// Admin: Get all borrowed book records
export const getBorrowedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find({ returnDate: null })
    .populate("book")
    .sort({ dueDate: -1 });

  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});


// Return a borrowed book
export const returnBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found", 404));

  const user = await User.findOne({ email, accountVerified: true });
  if (!user) return next(new ErrorHandler("User not found", 404));

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === bookId && b.returned === false
  );
  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book", 404));
  }

  borrowedBook.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });

  if (!borrow) {
    return next(new ErrorHandler("Book borrow record not found", 404));
  }

  borrow.returnDate = new Date();
  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;
  await borrow.save();

  res.status(200).json({
    success: true,
    message: fine
      ? `Returned successfully. Base: ₹${book.price}, Fine: ₹${fine}, Total: ₹${fine + book.price}`
      : `Returned successfully. Total Charges: ₹${book.price}`,
  });
});
