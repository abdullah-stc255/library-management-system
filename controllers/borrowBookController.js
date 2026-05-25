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
        message: "Member ID is not valid",
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
      return res.status(400).json({
        success: false,
        message: "Book Inactive",
      });
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

    await issueBook.save();

    book.availableCopies -= 1;
    await book.save();

    member.activeBorrowCount += 1;
    await member.save();

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

export async function returnBook(req, res) {
  try {
    const { borrowId } = req.params;
    const isValidId = mongoose.Types.ObjectId.isValid(borrowId);
    if (!isValidId) {
      return res.status(400).json({
        status: false,
        message: "Id is not valid",
      });
    }
    if (!borrowId || borrowId.trim() === "" || borrowId === null) {
      return res.status(400).json({
        status: success,
        message: "Borrow id is required",
      });
    }

    const borrow = await Borrow.findById(borrowId);
    if (!borrow) {
      return res.status(404).json({
        success: false,
        message: "Borrow record not found",
      });
    }

    if (borrow.isReturned) {
      return res.status(400).json({
        success: false,
        message: "This book has already been returned",
      });
    }

    const book = await Book.findById(borrow.bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const member = await Member.findById(borrow.memberId);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const returnDate = new Date();
    const isOverdue = returnDate > borrow.dueDate;

    borrow.returnDate = returnDate;
    borrow.isReturned = true;
    borrow.isOverdue = isOverdue;
    await borrow.save();

    book.availableCopies += 1;
    await book.save();

    if (member.activeBorrowCount > 0) member.activeBorrowCount -= 1;
    await member.save();

    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const daysOverdue = isOverdue
      ? Math.ceil((returnDate - borrow.dueDate) / MS_PER_DAY)
      : 0;

    return res.status(200).json({
      success: true,
      message: isOverdue
        ? "Book returned successfully. Note: This return is overdue."
        : "Book returned successfully",
      data: {
        borrowId: borrow._id,
        member: { id: member._id, name: member.name, email: member.email },
        book: { id: book._id, title: book.title, isbn: book.isbn },
        issueDate: borrow.issueDate,
        dueDate: borrow.dueDate,
        returnDate: borrow.returnDate,
        isOverdue,
        daysOverdue,
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

export async function getMemberHistory(req, res) {
  try {
    const { memberId } = req.params;
    console.log(req.params);
    console.log("membersID", memberId);
    if (!memberId || memberId.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "please provide memberId to see the history",
      });
    }

    const isValidId = mongoose.Types.ObjectId.isValid(memberId);
    if (!isValidId) {
      return res.status(400).json({
        success: false,
        message: "Id is not valid",
      });
    }

    let member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Member not found",
      });
    }

    const borrowCount = await Borrow.countDocuments({ memberId });
    const borrows = await Borrow.find({ memberId })
      .populate("bookId", "title isbn")
      .populate("memberId", "name email");
    console.log("borrowCount", borrowCount);

    return res.status(200).json({
      success: true,
      data: borrows,
    });
  } catch (error) {
    console.log("error", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
