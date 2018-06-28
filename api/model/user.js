const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    type: Number,
    image: {type: String, default: undefined},
    description: String, 
    facebookAccount: String, 
    twitterAccount: String,
    instaAccount: String,
    dateOfJoin: {type: Date, default: Date.now}, 
}); 

module.exports = mongoose.model('User', userSchema);