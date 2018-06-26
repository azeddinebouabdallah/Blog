const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

//Routes
const userRoutes = require('./api/routes/user');
const articleRoutes = require('./api/routes/article');
const commentRoutes = require('./api/routes/comment');
const newsletterRoutes = require('./api/routes/newsletter');

//Set connection to Mongodb 
mongoose.connect('mongodb://localhost/blog');

// Filters
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Controle access
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET POST PATCH DELETE');
        return res.status(200).json({Okey: 'OKey'});
    }
    next();
});


app.use('/user', userRoutes);
app.use('/article', articleRoutes);
app.use('/manageComment', commentRoutes);
app.use('/subs', newsletterRoutes);

// Handle errors or other routes 
app.use((req, res, next)=> {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        Msg: error.message,
    })
});

module.exports = app;