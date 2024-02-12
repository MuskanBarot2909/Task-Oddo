// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const webRoutes = require('./routes/webRoutes');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/courseApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use express-session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

// Serve static files from the 'views' directory
app.use(express.static('views'));

// Middleware to parse JSON
app.use(bodyParser.json());

// Use web routes
app.use('/', webRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
