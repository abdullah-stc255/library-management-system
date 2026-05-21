import express from "express";
import {
  addBook,
  updateBook,
  getBooks,
  getBookById,
  searchBooks,
  updateBookStatus,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/addBook", addBook);
router.patch("/:id", updateBook);
router.get("/", getBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);
router.patch("/:id/status", updateBookStatus);

export default router;
