const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title: {type: String, required: true},
    image: String,
    auther: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    inImg : [String],
    type: String, 
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Article', articleSchema);