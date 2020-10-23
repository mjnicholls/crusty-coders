const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
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

const Comment = mongoose.model('comment', CommentSchema);

module.exports = Comment;