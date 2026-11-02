const express = require("express");

const port = 3000;
const app = express();

app.use(express.json());

//data
const bookData = [
  {
    id: 101,
    title: "The Alchemist",
    author: "Paulo Coelho",
    category: "Fiction",
    quantity: 5,
    available: 3
  },
  {
    id: 102,
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    category: "Finance",
    quantity: 4,
    available: 2
  },
  {
    id: 103,
    title: "Atomic Habits",
    author: "James Clear",
    category: "Self Help",
    quantity: 6,
    available: 6
  }
];

// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to Library Management System"
  });
});

// Get All Books
app.get("/books", (req, res) => {
  res.status(200).json({
    message: "Books data received",
    bookData
  });
});

// Get Book By ID
app.get("/books/:id", (req, res) => {
  const id = Number(req.params.id);

  const book = bookData.find((book) => book.id === id);

  if (book) {
    res.status(200).json({
      message: "Book found",
      book
    });
    return;
  }

  res.status(404).json({
    message: "Book not found"
  });
});

// Create New Book
app.post("/api/books", (req, res) => {
  const { title, author, category, quantity, available } = req.body;

  if (!title || !author || !category || quantity == null) {
    res.status(400).json({
      message: "All book details are required"
    });
    return;
  }

  const newBook = {
    id: bookData.length
      ? bookData[bookData.length - 1].id + 1
      : 101,
    title,
    author,
    category,
    quantity,
    available: available ?? quantity
  };

  bookData.push(newBook);

  res.status(201).json({
    message: "Book added successfully",
    newBook
  });
});

// Edit Book
app.put("/edit/:id", (req, res) => {
  const id = Number(req.params.id);

  const { title, author, category, quantity, available } = req.body;

  const bookIndex = bookData.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    res.status(404).json({
      message: "Book not found"
    });
    return;
  }

  bookData[bookIndex] = {
    ...bookData[bookIndex],
    title: title ?? bookData[bookIndex].title,
    author: author ?? bookData[bookIndex].author,
    category: category ?? bookData[bookIndex].category,
    quantity: quantity ?? bookData[bookIndex].quantity,
    available: available ?? bookData[bookIndex].available
  };

  res.status(200).json({
    message: "Book updated successfully",
    book: bookData[bookIndex]
  });
});

// Delete Book
app.delete("/delete/:id", (req, res) => {
  const id = Number(req.params.id);

  const bookIndex = bookData.findIndex(
    (book) => book.id === id
  );

  if (bookIndex === -1) {
    res.status(404).json({
      message: "Book not found"
    });
    return;
  }

  const deletedBook = bookData.splice(bookIndex, 1);

  res.status(200).json({
    message: "Book deleted successfully",
    deletedBook
  });
});

// Get Available Books
app.get("/available", (req, res) => {
  const availableBooks = bookData.filter(
    (book) => book.available > 0
  );

  res.status(200).json({
    message: "Available books",
    availableBooks
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});