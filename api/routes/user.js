const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');


// Import models
const User = require('../model/user');

//Multer Confguration 
let storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, './uploads/');
    },
    filename: (req, file, callback) => {
        callback(null, new Date().toISOString() + file.originalname);
    }
});

// File filters 
const fileFilter = (req, file, callback) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    }else {
        callback(null, false);
    }
}

// UPLOAD Multer 
const upload = multer({
    storage: storage, 
    limits: {
        fileSize: 1024*1024*10
    }, 
    fileFilter : fileFilter
});


// Get All Users
router.get('/', (req, res, next) => {
   
    User.find({}).exec( (err, data)=> {
        if (err) {
            return res.status(400).json({
                message: 'Something went wrong'
            });
        }else {
            res.status(200).json(data);
        }
    });

});

// Get a User by ID
router.get('/:userId', (req, res, next) => {
    User.find({
        _id : req.params.userId
    }).exec((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            if (data.length > 0) {
                res.status(200).json(data[0]);
            }else {
                res.status(200).json({
                    message: 'No user with this ID'
                })
            }
        }
    });
});

// Add user
router.post('/', upload.single('userImage'), (req, res, next) => {

    User.find({
        email: req.body.email 
    })
    .exec((err, data) => {
        if (data.length > 0) {
            return res.status(500).json({
                error: 'User already exists'
            });
        }else {
                // Insert new User
                let user = new User({

                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    type: req.body.type,
                    image: req.file.path,
                    description: req.body.description, 
                    facebookAccount: req.body.fbUrl, 
                    twitterAccount: req.body.tUrl,
                    instaAccount: req.body.iUrl,

                });

            user.save((err, data) => {
                if (err) {
                    return res.status(500).json({
                        error: 'Something went wrong'
                    });
                }else {

                    res.status(200).json({
                        message: 'User insert went successful'
                    });

                }
            });

        }
    });

});

// Update User by ID
router.patch('/:userId', upload.single('userImage'), (req, res, next) => {

    User.find({
        _id : req.params.userId
    }).exec((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            if (data.length > 0){
                User.update(
                {
                    _id: req.params.userId
                },{
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    type: req.body.type,
                    image: req.file.path,
                    description: req.body.description, 
                    facebookAccount: req.body.fbUrl, 
                    twitterAccount: req.body.tUrl,
                    instaAccount: req.body.iUrl,
                })
            .exec((err, data) => {
                    if (err) {
                        res.status(400).json({
                            error: 'Something went wrong'
                        });
                    }else {
                        res.status(200).json({
                            message: 'User updated successfuly'
                        });
                    }
                });
            }
        }
    });
    
});

// Delete a user by ID
router.delete('/:userId', (req, res, next) => {
    User.find({
        _id : req.params.userId
    }).exec((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            if (data.length > 0){
                User.remove({_id : req.params.userId})
                .exec((err, data) => {
                    if (err) {
                        res.status(400).json({
                            error: 'Something went wrong'
                        });
                    }else {
                        res.status(200).json({
                            message: 'User deleted successfuly'
                        });
                    }
                });
            }else {
                res.status(500).json({
                    message: 'No such user with this ID'
                })
            }
        }
    });
})

module.exports = router;

