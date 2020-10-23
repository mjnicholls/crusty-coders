const mongoose = require('mongoose');

const CommentAppSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	comment: {
		type: String,
		required: true
    },
    date: {
   type: Date,
    default: Date.now
    }
});

const CommentApp = mongoose.model('commentapp', CommentAppSchema);

module.exports = CommentApp;