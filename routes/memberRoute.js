import express from "express";
import {
  createMember,
  getMemberById,
  getMembers,
  updateMember,
} from "../controllers/memberController.js";
const router = express.Router();

router.post("/addMember", createMember);
router.get("/", getMembers);
router.patch("/:id", updateMember);
router.get("/:id", getMemberById);

export default router;
