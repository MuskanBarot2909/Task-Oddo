// app/models/session.js

const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  accessToken: String,
});

const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
