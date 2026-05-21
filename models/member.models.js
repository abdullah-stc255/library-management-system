import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      lowercase: true,
    },
    phone: {
      type: Number,
      require: [true, "Number is required"],
      unique: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    activeBorrowCount: {
      type: Number,
      default: 0,
      min: [0, "Active borrow count can't be negative"],
      max: [3, "A member can have borrow max 3 books"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Member = mongoose.model("Member", memberSchema);

export default Member;
