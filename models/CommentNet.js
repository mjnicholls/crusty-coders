const mongoose = require('mongoose');

const CommentNetSchema = new mongoose.Schema({
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

const CommentNet = mongoose.model('commentnet', CommentNetSchema);

module.exports = CommentNet;