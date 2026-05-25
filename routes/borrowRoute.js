import express from "express";
import { borrowBook } from "../controllers/borrowBookController.js";
const router = express.Router();

router.post("/issue", borrowBook);

export default router;
