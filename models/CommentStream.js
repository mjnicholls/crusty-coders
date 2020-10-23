const mongoose = require('mongoose');

const CommentStreamSchema = new mongoose.Schema({
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

const CommentStream = mongoose.model('commentstream', CommentStreamSchema);

module.exports = CommentStream;