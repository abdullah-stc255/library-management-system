import mongoose from "mongoose";
import Book from "../models/book.models.js";
import Member from "../models/member.models.js";
import Borrow from "../models/borrow.models.js";

export async function borrowBook(req, res) {
  try {
    const { bookId, memberId } = req.body;
    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    const isValidmemberId = mongoose.Types.ObjectId.isValid(memberId);
    if (!isValidBookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is not valid",
      });
    }

    if (!isValidmemberId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is not valid",
      });
    }

    let book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }
    if (!book.isActive) {
      if (!book) {
        return res.status(400).json({
          success: false,
          message: "Book Inactive",
        });
      }
    }
    if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }

    let member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    } else if (!member.isActive) {
      return res.status(400).json({
        success: false,
        message: "Member Inactive",
      });
    } else if (member.activeBorrowCount === 3) {
      return res.status(400).json({
        success: false,
        message: "Borrow limit exceeded",
      });
    }

    const issueDate = new Date();
    const dueDate = new Date(issueDate);
    dueDate.setDate(dueDate.getDate() + 7);

    console.log(dueDate);

    const issueBook = new Borrow({
      memberId,
      bookId,
      issueDate,
      dueDate,
    });

    issueBook.save();

    book.availableCopies -= 1;
    book.save();

    member.activeBorrowCount += 1;
    member.save();

    res.status(201).json({
      success: true,
      message: "Book issued",
      data: {
        borrowId: issueBook._id,
        member: {
          memberId,
          name: member.name,
          email: member.email,
        },
        book: {
          bookId,
          title: book.title,
          isbn: book.isbn,
        },
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

// TODO: Complete the logic here.
