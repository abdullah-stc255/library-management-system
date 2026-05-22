import mongoose from "mongoose";
import Book from "../models/book.models";
import Member from "../models/member.models";
import Borrow from "../models/borrow.models";

export async function borrowBook(req, res) {
  try {
    const { bookId, memberId } = req.body;
    const isValidBookId = mongoose.Types.ObjectId.isValid(bookId);
    const isValidmemberId = mongoose.Types.ObjectId.isValid(memberId);
    if (!bookId) {
      return res.status(400).json({
        success: false,
        message: "Book ID is not valid",
      });
    }

    if (!memberId) {
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
    } else if (!book.isActive) {
      if (!book) {
        return res.status(400).json({
          success: false,
          message: "Book Inactive",
        });
      }
    } else if (book.availableCopies < 1) {
      return res.status(400).json({
        success: false,
        message: "Book is not available",
      });
    }

    let member = await Member.findById(id);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    } else if (member.isActive) {
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
      duedate,
    });
    res.status(200).json({
      success: true,
      message: "Book issued",
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
