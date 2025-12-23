const express = require('express');
const router = express.Router();
const Book = require('../models/bookSchema');

// ============== CRUD ROUTES WITH MONGODB ==============

// CREATE - Add a new book
router.post('/', async (req, res) => {
    try {
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// READ - Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// READ - Get book by bookId
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: parseInt(req.params.id) });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// UPDATE - Update book by bookId (PUT - full update)
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({ bookId: parseInt(req.params.id) }, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// UPDATE - Update book by bookId (PATCH - partial update)
router.patch('/:id', async (req, res) => {
    try {
        const book = await Book.findOneAndUpdate({ bookId: parseInt(req.params.id) }, req.body, { new: true, runValidators: true });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - Delete book by bookId
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findOneAndDelete({ bookId: parseInt(req.params.id) });
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// SEARCH - Search books by title
router.get('/search/title', async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({ message: 'Book name query parameter is required' });
        }
        const books = await Book.find({ title: { $regex: name, $options: 'i' } });
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books found' });
        }
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// ============== COMMENTED DUMMY DATA ROUTES ==============

/*
const books= [
    { id: 1, title: 'Rich Dad Poor Dad', author: 'Robert Kiyosaki' , availableCount: 10 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', availableCount:10 },
    { id: 3, title: '1984', author: 'George Orwell',  availableCount:10 },
    { id: 4, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', availableCount:8 },
];

router.get('/', (req, res) => {
    res.status(200).json(books);
});

router.put('/:id', (req,res)=>{
    const bookId = parseInt(req.params.id);
    const {title, author, availableCount} = req.body;

    const book = books.findIndex(b => b.id === bookId);
    if(book === -1){
        return res.status(404).json({message: 'Book not found'});
    }
    books[book] = {
        id: bookId,
        title: title,
        author: author,
        availableCount: availableCount
    }
        
    res.json({message: 'Book updated successfully'});
});

router.delete('/:id', (req,res)=>{
    const bookId = parseInt(req.params.id);
    const bookIndex = books.findIndex(b => b.id === bookId);
    if(bookIndex === -1){
        return res.status(404).json({message: 'Book not found'});
    }
    books.splice(bookIndex, 1);
    res.json({message: 'Book deleted successfully'});
});

router.get('/search/:id', (req, res) => {
    const bookId = parseInt(req.params.id);
    const book = books.find(b => b.id === bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
});

// Get book by name (title) using query
router.get('/search', (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json({ message: 'Book name is required' });
    }
    const foundBooks = books.filter(book => 
        book.title.toLowerCase().includes(name.toLowerCase())
    );
    if (foundBooks.length === 0) {
        return res.status(404).json({ message: 'No books found' });
    }
    res.json(foundBooks);
});
*/

module.exports = router;