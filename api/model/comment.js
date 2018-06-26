const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
        name: {type: String, required: true},
        email: {type: String, required: true},
        comment: {type: String, required: true},
        article: {type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true},
        date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);