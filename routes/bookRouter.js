import express from "express";
import {
  addBook,
  updateBook,
  getBooks,
  getBookById,
  searchBooks,
} from "../controllers/bookController.js";

const router = express.Router();

router.post("/addBook", addBook);
router.patch("/:id", updateBook);
router.get("/", getBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);

export default router;
