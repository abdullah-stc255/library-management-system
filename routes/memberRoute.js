import express from "express";
import {
  createMember,
  getMemberById,
  getMembers,
  searchMembers,
  updateMember,
  updateMemberStatus,
} from "../controllers/memberController.js";
const router = express.Router();

router.post("/addMember", createMember);
router.get("/", getMembers);
router.get("/search", searchMembers);
router.patch("/:id", updateMember);
router.get("/:id", getMemberById);
router.patch("/:id/status", updateMemberStatus);

export default router;
