import mongoose from "mongoose";
import {
  booksValidation,
  bookUpdateValidation,
  updateBookStatusValidation,
} from "../middleware/validation.js";
import Book from "../models/book.models.js";

export async function addBook(req, res) {
  try {
    const error = booksValidation(req.body);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
    const {
      title,
      author,
      isbn,
      genre,
      totalCopies,
      availableCopies,
      isActive,
    } = req.body;
    const existing = await Book.findOne({ isbn });
    console.log("existing books", existing);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A book with this ISBN is already exist",
      });
    }

    const book = new Book({
      title,
      author,
      isbn,
      genre,
      totalCopies,
      availableCopies,
      isActive,
    });
    await book.save();

    res.status(201).json({
      success: true,
      message: "Booked added successfully",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function updateBook(req, res) {
  try {
    const { isbn, ...updatedData } = req.body;
    const { id } = req.params;
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    console.log(isValidObjectId);
    if (!isValidObjectId) {
      return res.status(400).json({
        success: false,
        message: "Id is not valid",
      });
    }
    const error = bookUpdateValidation(req.body);
    console.log("id", id);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    let book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    const newTotal =
      req.body.totalCopies !== undefined
        ? Number(req.body.totalCopies)
        : book.totalCopies;

    const newAvailableCopies =
      req.body.availableCopies !== undefined
        ? Number(req.body.availableCopies)
        : book.availableCopies;

    if (newAvailableCopies > newTotal) {
      return res.status(400).json({
        success: false,
        message: "Available copies cannot exceed total copies",
      });
    }

    book = await Book.findByIdAndUpdate(id, updatedData, { new: true });

    res.status(200).json({
      success: true,
      message: "book updated successfully",
      data: book,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

export async function getBooks(req, res) {
  try {
    let { page, limit } = req.query;
    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 10;

    const skip = (page - 1) * limit;
    const booksCount = await Book.countDocuments();
    console.log("BooksCount", booksCount);
    const books = await Book.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    if (!books) {
      return res.status(404).json({
        success: false,
        message: "Books not found",
      });
    }
    res.status(200).json({
      success: true,
      data: books,
      pagination: {
        booksCount,
        page,
        limit,
        totalPages: Math.ceil(booksCount / limit),
      },
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function getBookById(req, res) {
  try {
    const { id } = req.params;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Id is not valid",
      });
    }
    const books = await Book.findById(id);
    if (!books) {
      return res.status(404).json({
        success: false,
        message: "Books not found",
      });
    }
    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function searchBooks(req, res) {
  try {
    const { title, author, genre, isActive } = req.query;
    let query = {};

    if (title) {
      query.title = { $regex: title.trim(), $options: "i" };
    }
    if (author) {
      query.author = { $regex: author.trim(), $options: "i" };
    }
    if (genre) {
      query.genre = { $regex: genre.trim(), $options: "i" };
    }

    if (isActive !== undefined) {
      if (isActive === "true") query.isActive = true;
      else query.isActive = false;
    }

    let books = await Book.find(query).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: books,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateBookStatus(req, res) {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Id is not valid",
      });
    }

    const error = updateBookStatusValidation(isActive);
    if (error.length) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    let book = await Book.findById(id);
    if (book.isActive === isActive) {
      return res.status(400).json({
        success: false,
        message: `Book is already ${isActive ? "Active" : "Inactive"} state`,
      });
    }
    const issuedBook = book.totalCopies - book.availableCopies;
    if (issuedBook > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot deactivate. ${issuedBook} copy/copies of this book are currently issued`,
      });
    }

    book.isActive = isActive;
    book.save();
    res.status(200).json({
      success: true,
      message: `Book ${isActive ? "activated" : "deactivated"} successfully`,
      data: book,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
