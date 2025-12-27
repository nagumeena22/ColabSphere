const mongoose = require('mongoose');

// Schema for currently borrowed books
const activeBooksSchema = new mongoose.Schema({
    bookId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    borrowedDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    }
}, { _id: false });

// Schema for book borrowing history (returned books)
const bookHistorySchema = new mongoose.Schema({
    bookId: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    borrowedDate: {
        type: Date,
        required: true
    },
    returnedDate: {
        type: Date,
        default: Date.now
    }
}, { _id: false });

const userSchema = new mongoose.Schema({
    regNo: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
     password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    // User role: 'user' or 'admin'
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
   
    // Currently borrowed books (active)
    activeBooks: {
        type: [activeBooksSchema],
        default: []
    },
    // History of returned books
    bookHistory: {
        type: [bookHistorySchema],
        default: []
    },
    // Maximum books a user can borrow at once
    maxBooksAllowed: {
        type: Number,
        default: 5
    },
    // User settings and preferences
    settings: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;