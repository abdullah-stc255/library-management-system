import express from "express";
import { createMember } from "../controllers/memberController.js";
const router = express.Router();

router.post("/addMember", createMember);

export default router;
