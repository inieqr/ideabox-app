const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const pool = require('./config/db'); // Require the PostgreSQL connection pool
const ideasRouter = require('./routes/ideas'); // Require the ideas route

const app = express();

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cors middleware
app.use(
  cors({
    origin: ['http://localhost:5000', 'http://localhost:3000'],
    credentials: true,
  })
);

// Mount the ideas route
app.use('/api/ideas', ideasRouter);

// Define the root route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the IdeaBox API' });
});

// Start the server
app.listen(port, () => console.log(`Server listening on port ${port}`));
