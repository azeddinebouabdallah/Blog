const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
    title: {type: String, required: true},
    image: {type: String, default: undefined},
    auther: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    content: {type: String, required: true},
    inImg : [{type: String, default: undefined}],
    type: String, 
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Article', articleSchema);