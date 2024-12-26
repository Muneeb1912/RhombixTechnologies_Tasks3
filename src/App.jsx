import React, { useState, useEffect } from "react";

const App = () => {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("books");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });
  const [query, setQuery] = useState("");
  const [borrowHistory, setBorrowHistory] = useState(() => {
    const savedHistory = localStorage.getItem("borrowHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [newBook, setNewBook] = useState({ title: "", category: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 6;

  useEffect(() => {
    localStorage.setItem("books", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("borrowHistory", JSON.stringify(borrowHistory));
  }, [borrowHistory]);

  const addBook = () => {
    if (newBook.title.trim() && newBook.category.trim()) {
      const book = {
        id: Date.now(),
        title: newBook.title.trim(),
        category: newBook.category.trim(),
        isBorrowed: false,
      };
      setBooks((prevBooks) => [...prevBooks, book]);
      setNewBook({ title: "", category: "" });
      location.reload();
    }
  };

  const deleteBook = (id) => {
    setBooks((prevBooks) => prevBooks.filter((book) => book.id !== id));
  };

  const borrowBook = (id) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) => {
        if (book.id === id) {
          const isBorrowing = !book.isBorrowed;
          if (isBorrowing) {
            // Add to borrow history only if the book is being borrowed
            setBorrowHistory((prevHistory) => [
              ...prevHistory,
              { id: Date.now(), title: book.title, date: new Date().toLocaleDateString() },
            ]);
          }
          location.reload();
          return { ...book, isBorrowed: isBorrowing };
        }
        return book;
      })
    );
  };
  

  const deleteBorrowHistory = (id) => {
    setBorrowHistory((prevHistory) => prevHistory.filter((entry) => entry.id !== id));
  };

  const filterBooks = books.filter((book) =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filterBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filterBooks.length / booksPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Personal Book Library</h1>

      {/* Add New Book */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Add a New Book</h2>
        <div className="flex flex-col lg-flex-row gap-6 lg-gap-2 mb-4 lg-mb-2">
          <input
            type="text"
            className="border-b border-gray-600 p-2 w-full rounded-lg"
            placeholder="Book Title"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
          />
          <input
            type="text"
            className="border-b border-gray-600 p-2 w-full rounded-lg"
            placeholder="Category"
            value={newBook.category}
            onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
          />
        </div>
        <button
          onClick={addBook}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add Book
        </button>
      </div>

      {/* Search Books */}
      <div className="mb-6">
        <input
          type="text"
          className="border p-2 w-full rounded-lg"
          placeholder="Search books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Display Books */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div
              key={book.id}
              className="p-4 border border-gray-600 rounded-lg shadow hover:shadow-lg transition-shadow bg-gradient-to-br from-indigo-50 to-indigo-100"
            >
              <h2 className="font-semibold text-xl mb-2 text-indigo-700">
                {book.title}
              </h2>
              <p className="text-gray-700 mb-2 font-medium">
                Category: {book.category}
              </p>
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => borrowBook(book.id)}
                  className={`px-4 py-2 rounded text-white shadow ${
                    book.isBorrowed
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {book.isBorrowed ? "Return Book" : "Borrow Book"}
                </button>
                <button
                  onClick={() => deleteBook(book.id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
                >
                  Delete Book
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No books found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 mx-1 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700 hover:bg-gray-400"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Borrow History */}
      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Borrow History</h2>
        {borrowHistory.length > 0 ? (
          <ul>
            {borrowHistory.map((entry) => (
              <li key={entry.id} className="flex justify-between items-center mb-2">
                <span>
                  {entry.title} - {entry.date}
                </span>
                <button
                  onClick={() => deleteBorrowHistory(entry.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No borrow history available.</p>
        )}
      </div>
    </div>
  );
};

export default App;