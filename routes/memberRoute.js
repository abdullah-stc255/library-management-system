import express from "express";
import { createMember, updateMember } from "../controllers/memberController.js";
const router = express.Router();

router.post("/addMember", createMember);
router.patch("/:id", updateMember);

export default router;
