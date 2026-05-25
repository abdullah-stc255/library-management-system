import express from "express";
import {
  borrowBook,
  getMemberHistory,
  returnBook,
} from "../controllers/borrowBookController.js";
const router = express.Router();

router.post("/issue", borrowBook);
router.post("/:borrowId/return", returnBook);
router.get("/borrow/member/:memberId", getMemberHistory);

export default router;
