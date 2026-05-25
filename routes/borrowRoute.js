import express from "express";
import { borrowBook, returnBook } from "../controllers/borrowBookController.js";
const router = express.Router();

router.post("/issue", borrowBook);
router.post("/:borrowId/return", returnBook);

export default router;
