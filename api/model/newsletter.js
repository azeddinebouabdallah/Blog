const mongoose = require('mongoose');

const newsletterSchema = mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true}, 
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Newsletter', newsletterSchema);