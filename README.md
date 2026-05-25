# Library Management System — Backend

A RESTful API for managing a library's books, members, and borrow/return operations. Built with Node.js, Express, and MongoDB.

---

## Table of Contents

- [Description](#description)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Project Setup](#project-setup)
- [Running the Project](#running-the-project)
- [API Endpoints](#api-endpoints)
  - [Health Check](#health-check)
  - [Books](#books)
  - [Members](#members)
  - [Borrow & Return](#borrow--return)

---

## Description

This backend powers a library management system that handles:

- **Book inventory** — add, update, search, and toggle book availability
- **Member management** — register members, track their borrow history and status
- **Borrow/Return workflow** — issue books to members, handle returns, detect overdue returns, and enforce a 3-book borrow limit per member

---

<!--
## Tech Stack

| Layer      | Technology          |
|------------|---------------------|
| Runtime    | Node.js (ESM)       |
| Framework  | Express v5          |
| Database   | MongoDB + Mongoose  |
| Dev server | Nodemon             |
| Config     | dotenv              |

---

## Project Structure

```
backend/
├── app.js                  # Entry point — Express app setup and server start
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── bookController.js
│   ├── memberController.js
│   └── borrowBookController.js
├── models/
│   ├── book.models.js
│   ├── member.models.js
│   └── borrow.models.js
├── routes/
│   ├── bookRoute.js
│   ├── memberRoute.js
│   └── borrowRoute.js
├── middleware/
├── .env
└── package.json
```

--- -->

## Environment Variables

Create a `.env` file in the root of the `backend/` directory. Use the table below as reference:

| Variable    | Description                | Example                                        |
| ----------- | -------------------------- | ---------------------------------------------- |
| `MONGO_URI` | MongoDB connection string  | `mongodb://localhost:27017/library-management` |
| `PORT`      | Port the server listens on | `3000`                                         |

**`.env.example`**

```env
MONGO_URI=mongodb://localhost:27017/library-management
PORT=3000
```

---

## Project Setup

**Prerequisites:** Node.js >= 18, MongoDB running locally (or a MongoDB Atlas URI)

```bash
# 1. Clone the repository
git clone <repo-url>
cd backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
# Edit .env and fill in your values
```

---

## Running the Project

```bash
# Development (auto-restarts on file changes)
npm run dev

# Production
npm start
```

The server will start on the port defined in your `.env` (default: `3000`).

---

## API Endpoints

Base URL: `http://localhost:3000`

---

### Health Check

| Method | Endpoint       | Description                         |
| ------ | -------------- | ----------------------------------- |
| GET    | `/healthcheck` | Verify the server is up and running |

**Response**

```json
{
  "success": true,
  "message": "Healthcheck - Ok!!"
}
```

---

### Books

Base path: `/books`

| Method | Endpoint            | Description                                       |
| ------ | ------------------- | ------------------------------------------------- |
| POST   | `/books/addBook`    | Add a new book to the library                     |
| GET    | `/books`            | Get all books                                     |
| GET    | `/books/search`     | Search books by title, author, genre, or ISBN     |
| GET    | `/books/:id`        | Get a single book by its ID                       |
| PATCH  | `/books/:id`        | Update book details (title, author, copies, etc.) |
| PATCH  | `/books/:id/status` | Toggle a book's active/inactive status            |

**POST `/books/addBook` — Request body**

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "isbn": "9780132350884",
  "genre": "Software Engineering",
  "totalCopies": 5
}
```

> `availableCopies` is automatically set to `totalCopies` on creation if not provided.

**GET `/books/search` — Query params**

```
/books/search?q=clean code
```

**PATCH `/books/:id/status` — Request body**

```json
{
  "isActive": false
}
```

---

### Members

Base path: `/members`

| Method | Endpoint              | Description                                         |
| ------ | --------------------- | --------------------------------------------------- |
| POST   | `/members/addMember`  | Register a new library member                       |
| GET    | `/members`            | Get all members                                     |
| GET    | `/members/search`     | Search members by name, email, or phone             |
| GET    | `/members/:id`        | Get a single member by their ID                     |
| PATCH  | `/members/:id`        | Update member details (name, email, phone, address) |
| PATCH  | `/members/:id/status` | Toggle a member's active/inactive status            |

**POST `/members/addMember` — Request body**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "03001234567",
  "address": "123 Main Street"
}
```

> A member can borrow a maximum of **3 books** at a time (`activeBorrowCount` is tracked automatically). Inactive members cannot borrow books.

---

### Borrow & Return

Base path: `/books`

| Method | Endpoint                         | Description                          |
| ------ | -------------------------------- | ------------------------------------ |
| POST   | `/books/issue`                   | Issue a book to a member             |
| POST   | `/books/:borrowId/return`        | Return a borrowed book               |
| GET    | `/books/borrow/member/:memberId` | Get full borrow history for a member |

**POST `/books/issue` — Request body**

```json
{
  "bookId": "64abc123...",
  "memberId": "64def456..."
}
```

**Response**

```json
{
  "success": true,
  "message": "Book issued",
  "data": {
    "borrowId": "64xyz789...",
    "member": {
      "memberId": "...",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "book": { "bookId": "...", "title": "Clean Code", "isbn": "9780132350884" }
  }
}
```

> Issue rules enforced:
>
> - Book must exist, be active, and have at least 1 available copy
> - Member must exist, be active, and have fewer than 3 active borrows
> - Due date is automatically set to **7 days** from the issue date

---

**POST `/books/:borrowId/return`**

No request body required. The `borrowId` is passed as a URL parameter.

**Response**

```json
{
  "success": true,
  "message": "Book returned successfully. Note: This return is overdue.",
  "data": {
    "borrowId": "...",
    "member": {
      "id": "...",
      "name": "John Doe",
      "email": "john.doe@example.com"
    },
    "book": { "id": "...", "title": "Clean Code", "isbn": "9780132350884" },
    "issueDate": "2025-05-18T00:00:00.000Z",
    "dueDate": "2025-05-25T00:00:00.000Z",
    "returnDate": "2025-05-27T00:00:00.000Z",
    "isOverdue": true,
    "daysOverdue": 2
  }
}
```

> Return rules enforced:
>
> - Cannot return an already-returned book
> - Overdue status and days overdue are calculated automatically

---

**GET `/books/borrow/member/:memberId`**

Returns the complete borrow history (all past and active borrows) for a given member, with book title and ISBN populated.

---

## Error Responses

All endpoints return a consistent error shape:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

| Status | Meaning                          |
| ------ | -------------------------------- |
| 400    | Bad request / validation failure |
| 404    | Resource not found               |
| 500    | Internal server error            |
