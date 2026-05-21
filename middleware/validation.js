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
    "isbn",
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
