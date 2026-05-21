import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
    },
    isbn: {
      type: String,
      required: [true, "ISBN is required"],
      unique: true,
    },
    genre: {
      type: String,
    },
    totalCopies: {
      type: Number,
      required: [true, "Total copies is required"],
      min: [1, "Total copies must be atleas 1"],
    },
    availableCopies: {
      type: Number,
      min: [0, "Available copies can't be negative"],
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

bookSchema.pre("save", function () {
  if (this.isNew && this.availableCopies === undefined) {
    this.availableCopies = this.totalCopies;
  }
});

const Book = mongoose.model("Book", bookSchema);

export default Book;
