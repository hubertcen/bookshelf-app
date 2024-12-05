const STORAGE_KEY = "BOOKSHELF_APPS";
let books = [];

// Fungsi memeriksa ketersediaan localStorage
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// Fungsi menyimpan data ke localStorage
function saveData() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

// Fungsi memuat data dari localStorage
function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  if (serializedData) {
    books = JSON.parse(serializedData);
  }
}

// Fungsi menghasilkan ID unik untuk buku
function generateId() {
  return +new Date();
}

// Fungsi membuat objek buku
function createBookObject(id, title, author, year, isComplete) {
  return { id, title, author, year, isComplete };
}

// Fungsi menambahkan buku
function addBook() {
  const title = document.getElementById("bookFormTitle").value;
  const author = document.getElementById("bookFormAuthor").value;
  const year = parseInt(document.getElementById("bookFormYear").value, 10);
  const isComplete = document.getElementById("bookFormIsComplete").checked;

  const bookId = generateId();
  const newBook = createBookObject(bookId, title, author, year, isComplete);
  books.push(newBook);

  saveData();
  renderBooks();
}

// Fungsi menghapus buku
function removeBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  saveData();
  renderBooks();
}

// Fungsi memindahkan buku antar rak
function toggleBookCompletion(bookId) {
  const book = books.find((book) => book.id === bookId);
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    renderBooks();
  }
}

// Fungsi membuat elemen buku
function createBookElement(book) {
  const bookElement = document.createElement("div");
  bookElement.setAttribute("data-bookid", book.id);
  bookElement.setAttribute("data-testid", "bookItem");

  bookElement.innerHTML = `
    <h3 data-testid="bookItemTitle">${book.title}</h3>
    <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
    <p data-testid="bookItemYear">Tahun: ${book.year}</p>
    <div>
      <button data-testid="bookItemIsCompleteButton">${
        book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"
      }</button>
      <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      <button data-testid="bookItemEditButton">Edit Buku</button>
    </div>
  `;

  // Event listener untuk tombol
  const completeButton = bookElement.querySelector(
    '[data-testid="bookItemIsCompleteButton"]'
  );
  const deleteButton = bookElement.querySelector(
    '[data-testid="bookItemDeleteButton"]'
  );

  completeButton.addEventListener("click", () => toggleBookCompletion(book.id));
  deleteButton.addEventListener("click", () => removeBook(book.id));

  return bookElement;
}

// Fungsi render buku ke rak
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of books) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Fungsi mencari buku berdasarkan judul
function searchBook() {
  const searchTitle = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTitle)
  );

  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  for (const book of filteredBooks) {
    const bookElement = createBookElement(book);

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  }
}

// Event listener untuk form tambah buku
document.getElementById("bookForm").addEventListener("submit", (event) => {
  event.preventDefault();
  addBook();
});

// Event listener untuk form pencarian buku
document.getElementById("searchBook").addEventListener("submit", (event) => {
  event.preventDefault();
  searchBook();
});

// Load data dan render buku saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
    renderBooks();
  }
});
