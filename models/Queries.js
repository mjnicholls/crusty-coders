const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
	term: {
		type: String,
		required: true
	},
	help: {
		type: String,
		required: true
	},
});

const Queries = mongoose.model('queries', PostSchema);

module.exports = Queries;