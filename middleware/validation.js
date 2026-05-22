export function booksValidation({
  title,
  author,
  isbn,
  totalCopies,
  availableCopies,
  isActive,
  genre,
}) {
  const error = [];
  if (!title || title.toString().trim() === "") {
    error.push({
      field: "title",
      message: "Title is required",
    });
  }

  if (!author || author.trim() === "") {
    error.push({
      field: "author",
      message: "author is required",
    });
  }

  if (!isbn || isbn.toString().trim() === "") {
    error.push({
      field: "isbn",
      message: "isbn is required",
    });
  }

  const parsedCopies = Number(totalCopies);
  if (!totalCopies) {
    error.push({
      field: "totalCopies",
      message: "totalCopies is required",
    });
  } else if (isNaN(parsedCopies)) {
    error.push({
      field: "totalCopies",
      message: "Total copies must be a type Number",
    });
  } else if (parsedCopies < 1) {
    error.push({
      field: "totalCopies",
      message: "Total copies must be at least 1",
    });
  }
  if (availableCopies !== undefined) {
    const parsedCopies = Number(availableCopies);
    if (isNaN(parsedCopies)) {
      error.push({
        field: "availableCopies",
        message: "Available copies must be a type Number",
      });
    } else if (parsedCopies < 0) {
      error.push({
        field: "availableCopies",
        message: "Available copies cannot be negative",
      });
    } else if (availableCopies > totalCopies) {
      error.push({
        field: "availableCopies",
        message: "Available copies cannot exceed total copies",
      });
    }
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      error.push({
        field: "isActive",
        message: "Is Active should be boolean",
      });
    }
  }

  if (genre !== undefined) {
    if (typeof genre !== "string" || genre.toString().trim() === "") {
      error.push({
        field: "genre",
        message: "Genre must not be empty.",
      });
    }
  }

  return error;
}

export function bookUpdateValidation(body) {
  const error = [];
  if (body.title !== undefined) {
    if (body.title.toString().trim() === "") {
      error.push({
        field: "title",
        message: "Title cannot be empty",
      });
    }
  }
  if (body.author !== undefined) {
    if (body.author.toString().trim() === "") {
      error.push({
        field: "author",
        message: "Author cannot be empty",
      });
    }
  }

  if (body.isbn !== undefined) {
    error.push({
      field: "isbn",
      message: "ISBN can't be updated",
    });
  }

  if (body.totalCopies !== undefined) {
    const parsedCopies = Number(body.totalCopies);
    if (isNaN(parsedCopies)) {
      error.push({
        field: "totalCopies",
        message: "Total copies must be a type Number",
      });
    } else if (parsedCopies < 1) {
      error.push({
        field: "totalCopies",
        message: "Total copies must be at least 1",
      });
    }
  }

  if (body.availableCopies !== undefined) {
    const parsedCopies = Number(body.availableCopies);
    if (isNaN(parsedCopies)) {
      error.push({
        field: "availableCopies",
        message: "Available copies must be a type Number",
      });
    } else if (parsedCopies < 0) {
      error.push({
        field: "availableCopies",
        message: "Available copies cannot be negative",
      });
    }
  }

  if (body.isActive !== undefined) {
    if (typeof body.isActive !== "boolean") {
      error.push({
        field: "isActive",
        message: "Is Active should be boolean",
      });
    }
  }

  if (body.genre !== undefined) {
    if (typeof body.genre !== "string" || body.genre.toString().trim() === "") {
      error.push({
        field: "genre",
        message: "Genre must not be empty.",
      });
    }
  }

  const allowedField = [
    "title",
    "author",
    "totalCopies",
    "availableCopies",
    "isActive",
    "genre",
  ];

  const hasValidField = allowedField.some((field) => body[field] !== undefined);
  if (!hasValidField) {
    error.push({
      field: "body",
      message: "At least one field must be provided to update",
    });
  }

  console.log(body);
  return error;
}

export function updateBookStatusValidation(isActive) {
  let error = [];
  if (isActive === undefined || isActive === null) {
    error.push({
      field: "isActive",
      message: "IsActive field is required",
    });
  } else if (typeof isActive !== "boolean") {
    error.push({
      field: "isActive",
      message: "IsActive should be type boolean",
    });
  }
  return error;
}

// ==============================================================
//                 Members Validation
// ==============================================================

// Email format validator (basic)
// ─────────────────────────────────────────────
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ─────────────────────────────────────────────
// Phone format validator
// Allows: digits, spaces, +, -, ()
// Min 7 digits, Max 15 digits
// ─────────────────────────────────────────────
const isValidPhone = (phone) => {
  const digitsOnly = String(phone).replace(/[\s\-\+\(\)]/g, "");
  return /^\d{7,15}$/.test(digitsOnly);
};
// ==========================================================
export function createMemberValidation({
  name,
  email,
  phone,
  address,
  activeBorrowCount,
  isActive,
}) {
  const error = [];
  if (!name || name.toString().trim() === "") {
    error.push({
      field: "name",
      message: "Name is required",
    });
  }

  if (!email || email.toString().trim() === "") {
    error.push({
      field: "Email",
      message: "Email is required",
    });
  } else if (!isValidEmail(email)) {
    error.push({
      field: "email",
      message: "Invalid email",
    });
  }

  if (!phone || phone.toString().trim() === "") {
    error.push({
      field: "phone",
      message: "Phone Number is required",
    });
  } else if (!isValidPhone(phone)) {
    error.push({
      field: "phone",
      message: "Invalid phone number",
    });
  }

  // if (!address || address.toString().trim() === "") {
  //   error.push({
  //     field: "address",
  //     message: "Address is required",
  //   });
  // }

  if (activeBorrowCount !== undefined) {
    const parsedCopies = Number(activeBorrowCount);
    if (activeBorrowCount === "" || activeBorrowCount === null) {
      error.push({
        field: "activeBorrowCount",
        message: "Active borrow count should not empty",
      });
    } else if (isNaN(parsedCopies)) {
      error.push({
        field: "activeBorrowCount",
        message: "Active Borrow Count must be a type Number",
      });
    } else if (parsedCopies < 0) {
      error.push({
        field: "activeBorrowCount",
        message: "Active borrow count cannot be negative",
      });
    } else if (activeBorrowCount > 3) {
      error.push({
        field: "activeBorrowCount",
        message: "Active borrow count should not exceed 3",
      });
    }
  }

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      error.push({
        field: "isActive",
        message: "Is Active should be boolean",
      });
    }
  }
  return error;
}

export function updateMemberValidation(body) {
  let error = [];
  if (body.name !== undefined) {
    if (body.name.toString().trim() === "") {
      error.push({
        field: "name",
        message: "Name is required",
      });
    }
  }
  if (body.email !== undefined) {
    if (body.email.toString().trim() === "") {
      error.push({
        field: "email",
        message: "Email is required",
      });
    } else if (!isValidEmail(body.email)) {
      error.push({
        field: "email",
        message: "Invalid email",
      });
    }
  }
  if (body.phone !== undefined) {
    if (body.phone.toString().trim() === "") {
      error.push({
        field: "phone",
        message: "Phone Number is required",
      });
    } else if (!isValidPhone(body.phone)) {
      error.push({
        field: "phone",
        message: "Invalid phone number",
      });
    }
  }
  // if (body.address !== undefined) {
  //   if (body.address.trim() === "") {
  //     error.push({
  //       field: "address",
  //       message: "Address can't be empty",
  //     });
  //   }
  // }
  if (body.activeBorrowCount !== undefined) {
    const parsedCopies = Number(body.activeBorrowCount);
    if (body.activeBorrowCount === "" || body.activeBorrowCount === null) {
      error.push({
        field: "activeBorrowCount",
        message: "Active borrow count should not be empty",
      });
    } else if (isNaN(parsedCopies)) {
      error.push({
        field: "activeBorrowCount",
        message: "Active Borrow Count must be a type Number",
      });
    } else if (parsedCopies < 0) {
      error.push({
        field: "activeBorrowCount",
        message: "Active borrow count cannot be negative",
      });
    } else if (body.activeBorrowCount > 3) {
      error.push({
        field: "activeBorrowCount",
        message: "Active borrow count should not exceed 3",
      });
    }
  }

  const allowedField = [
    "name",
    "phone",
    "email",
    "address",
    "activeBorrowCount",
  ];

  const hasValidField = allowedField.some((field) => body[field] !== undefined);
  if (!hasValidField) {
    error.push({
      field: "body",
      message: "At least one field must be provided to update",
    });
  }

  return error;
}
