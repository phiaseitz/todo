//This type of file is usually found in app/models/robotModel.js
var mongoose = require('mongoose');

var Todo = mongoose.Schema({
    title : String,
    completed: Boolean,
});

module.exports = mongoose.model('todo', Todo);