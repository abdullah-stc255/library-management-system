import express from "express";
import {
  createMember,
  getMembers,
  updateMember,
} from "../controllers/memberController.js";
const router = express.Router();

router.post("/addMember", createMember);
router.get("/", getMembers);
router.patch("/:id", updateMember);

export default router;
