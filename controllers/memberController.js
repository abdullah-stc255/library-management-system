import mongoose from "mongoose";
import {
  createMemberValidation,
  updateMemberValidation,
} from "../middleware/validation.js";
import Member from "../models/member.models.js";

export async function createMember(req, res) {
  try {
    const error = createMemberValidation(req.body);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }
    const { email, phone } = req.body;

    const existMember = await Member.findOne({
      $or: [{ email: email }, { phone: phone }],
    });
    console.log("existMember", existMember);
    if (existMember) {
      return res.status(400).json({
        success: false,
        message: "Member already exist with this email or Phone number",
      });
    }

    const member = new Member(req.body);
    member.save();

    res.status(201).json({
      success: true,
      data: member,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

export async function updateMember(req, res) {
  try {
    const { id } = req.params;
    const { isActive, ...updateData } = req.body;
    console.log();
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid id",
      });
    }
    const error = updateMemberValidation(req.body);
    if (error.length > 0) {
      return res.status(400).json({
        success: false,
        message: error,
      });
    }

    let member = await Member.findByIdAndUpdate(id, updateData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!member) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Member detail updated successfully",
      data: member,
    });
  } catch (error) {
    console.log("error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
