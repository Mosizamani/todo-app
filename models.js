const mongoose = require('mongoose');

const ToDoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required: true,
        default: false
    },
    createdDate: {
        type: Date,
        required: true,
        default: Date.now
    }
});

const ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = ToDo

