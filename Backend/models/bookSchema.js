const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
    bookId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true    
    },
    genre: {
        type: String,
        required: true
    },
    publicationYear: {
        type: Number,
        required: true
    },
    availableCopies: {
        type: Number,
        required: true
    }
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;