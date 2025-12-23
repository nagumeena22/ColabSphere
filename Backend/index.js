require('dotenv').config();
const express = require('express');
const connectDB = require('./db');
const app = express();
const port = process.env.PORT;
const cors = require("cors");

const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminroutes');



connectDB();

// -------middleware-------

app.use(cors({
  origin: "*", // Allow all origins for development
  credentials: false
}));


app.use(express.json());
const DeleteBlockMiddleware = (req, res, next) => {
    if(req.method === 'DELETE'){
        return res.status(400).json({message: "Not permitted for DELETE Request"})
    }
    next();
}
// app.use(DeleteBlockMiddleware);
    
const logger = (req, res, next) => {
    console.log('logger middleware working');
    next();
}
app.use(logger);    


app.get('/', (req, res) => {
    res.json({ message: 'Hello World!' });
});
app.use('/books', bookRoutes);
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});