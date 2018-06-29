const express = require('express');
const router = express.Router();
const multer = require('multer');
const bcrypt =require('bcrypt');
const fs = require('fs');

// Import models
const User = require('../model/user');

// Import authentification check filter
const checkAuth = require('../middleware/check-auth');

// Error handling 
let errorHandle = (res) => {
    return res.status(400).json({
        error: 'Something went wrong'
    })
}

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
router.post('/', checkAuth.checkAuthAdmin, upload.single('userImage'), (req, res, next) => {

                    let firstName       = req.body.firstName;
                    let lastName        = req.body.lastName;
                    let email           = req.body.email;
                    let type            = req.body.type;
                    let description     = req.body.description;
                    let facebookAccount = req.body.fbUrl;
                    let twitterAccount  = req.body.tUrl;
                    let instaAccount    = req.body.iUrl;

    User.find({
        email: req.body.email 
    })
    .exec((err, data) => {
        if (data.length > 0) {
            return res.status(500).json({
                error: 'User already exists'
            });
        }else {

            let img;
            if (req.file){
                img = req.file.path;
            }else {
                img = undefined;
            }

                let passwordHashed;

                bcrypt.hash(req.body.password, 10, (err , hash) => {

                    if (err) {
                        return errorHandle(res);
                    }else {
                        passwordHashed = hash;
                          // Insert new User
                    
                  let user = new User({

                    firstName:          firstName,
                    lastName:           lastName,       
                    email:              email,          
                    type:               type,           
                    description:        description, 
                    facebookAccount:    facebookAccount, 
                    twitterAccount:     twitterAccount, 
                    instaAccount:       instaAccount,   
                    password:           passwordHashed,
                    image:              img,

                });

            user.save((err, data) => {
                if (err) {
                    return errorHandle(res);
                }else {

                    res.status(200).json({
                        message: 'User insert went successful'
                    });

                }
            });
                    }
                });

        }
    });

});

// Update User by ID
router.patch('/:userId', checkAuth.checkAuthNormal, upload.single('userImage'), (req, res, next) => {

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
                },{ $set:{ 
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    type: req.body.type,
                    image: req.file.path,
                    description: req.body.description, 
                    facebookAccount: req.body.fbUrl, 
                    twitterAccount: req.body.tUrl,
                    instaAccount: req.body.iUrl,
                    }
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


// Change password
router.patch('/changePassword/:userId', checkAuth.checkAuthNormal ,(req, res, next) => {

    let passwordHashed;
    bcrypt.hash(process.env.HASH_LEFT + req.body.password + process.env.HASH_RIGHT, 10, (err, hash) => {
        if (err) {
            throw new Error(err);
        }else {

            passwordHashed = hash;

            User.findByIdAndUpdate(req.params.userId, {
                $set : {
                    password : passwordHashed
                }
            },(err, data) => {
                    if (err) {
                        return errorHandle(res);
                    }else {
                        if (data) {
                            res.status(200).json({
                                message : 'Password has been changes successfuly'
                            });
                        }else {
                            res.status(500).json({
                                message : 'No such user'
                            });
                        }
                    }
            });
        }
    });

});

// Delete a user by ID
router.delete('/:userId', checkAuth.checkAuthAdmin,(req, res, next) => {

    User.findById(req.params.userId)
    .exec((err, data) => {
        if (err) {
            res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            if (data){
                if (data.image){
                fs.unlinkSync(data.image);
                }
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

