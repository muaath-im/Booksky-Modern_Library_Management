document.addEventListener('DOMContentLoaded', () => {
    let books = JSON.parse(localStorage.getItem('books')) || [];
    let currentTheme = localStorage.getItem('theme') || 'light';
    let editingIndex = -1;

    const elements = {
        bookGrid: document.getElementById('book-grid'),
        addPopupButton: document.getElementById('add-popup-button'),
        popupOverlay: document.querySelector('.popup-overlay'),
        popupBox: document.querySelector('.popup-box'),
        closeButtons: document.querySelectorAll('.close-btn, #cancel-popup'),
        bookForm: document.getElementById('book-form'),
        searchInput: document.getElementById('search-input'),
        themeToggle: document.getElementById('theme-toggle'),
        totalBooks: document.getElementById('total-books'),
        totalCategories: document.getElementById('total-categories'),
        toast: document.querySelector('.toast')
    };

    // Initialize theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    elements.themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';

    // Event Listeners
    elements.addPopupButton.addEventListener('click', () => {
        elements.bookForm.reset();
        togglePopup();
    });
    elements.closeButtons.forEach(btn => btn.addEventListener('click', togglePopup));
    elements.popupOverlay.addEventListener('click', togglePopup);
    elements.bookForm.addEventListener('submit', handleFormSubmit);
    elements.searchInput.addEventListener('input', (e) => filterBooks(e.target.value.toLowerCase()));
    elements.themeToggle.addEventListener('click', toggleTheme);

    // Initial render
    renderBooks();
    updateStats();

    function renderBooks() {
        elements.bookGrid.innerHTML = '';
        books.forEach((book, index) => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <span class="category-tag">${book.category}</span>
                <h2>${book.title}</h2>
                <h5>${book.author}</h5>
                <p>${book.description}</p>
                <div class="actions">
                    <button onclick="editBook(${index})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button onclick="deleteBook(${index})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            `;
            elements.bookGrid.appendChild(bookCard);
        });
    }

    function togglePopup() {
        const isOpen = elements.popupOverlay.style.display === 'block';
        elements.popupOverlay.style.display = isOpen ? 'none' : 'block';
        elements.popupBox.style.display = isOpen ? 'none' : 'block';
        
        if (isOpen) {
            elements.bookForm.reset();
            editingIndex = -1;
        }
    }

    function handleFormSubmit(e) {
        e.preventDefault();
        const newBook = {
            title: document.getElementById('book-title-input').value,
            author: document.getElementById('book-author-input').value,
            category: document.getElementById('book-category-input').value,
            description: document.getElementById('book-description-input').value
        };

        if (editingIndex >= 0) {
            books[editingIndex] = newBook;
            showToast('Book updated successfully!');
        } else {
            books.push(newBook);
            showToast('Book added successfully!');
        }

        localStorage.setItem('books', JSON.stringify(books));
        renderBooks();
        updateStats();
        togglePopup();
    }

    function filterBooks(searchTerm) {
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm) ||
            book.description.toLowerCase().includes(searchTerm)
        );
        elements.bookGrid.innerHTML = '';
        filteredBooks.forEach((book, index) => {
            const bookCard = document.createElement('div');
            bookCard.className = 'book-card';
            bookCard.innerHTML = `
                <span class="category-tag">${book.category}</span>
                <h2>${book.title}</h2>
                <h5>${book.author}</h5>
                <p>${book.description}</p>
                <div class="actions">
                    <button onclick="editBook(${index})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button onclick="deleteBook(${index})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            `;
            elements.bookGrid.appendChild(bookCard);
        });
    }

    function updateStats() {
        elements.totalBooks.textContent = books.length;
        const categories = [...new Set(books.map(book => book.category))];
        elements.totalCategories.textContent = categories.length;
    }

    function toggleTheme() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        localStorage.setItem('theme', currentTheme);
        elements.themeToggle.innerHTML = currentTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    function showToast(message) {
        elements.toast.textContent = message;
        elements.toast.style.display = 'block';
        setTimeout(() => {
            elements.toast.style.display = 'none';
        }, 3000);
    }

    window.deleteBook = function(index) {
        if (confirm('Are you sure you want to delete this book?')) {
            books.splice(index, 1);
            localStorage.setItem('books', JSON.stringify(books));
            renderBooks();
            updateStats();
            showToast('Book deleted successfully!');
        }
    };

    window.editBook = function(index) {
        const book = books[index];
        document.getElementById('book-title-input').value = book.title;
        document.getElementById('book-author-input').value = book.author;
        document.getElementById('book-category-input').value = book.category;
        document.getElementById('book-description-input').value = book.description;
        editingIndex = index;
        togglePopup();
    };
});