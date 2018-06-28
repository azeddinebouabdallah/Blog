const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/user');

let errorHandling = (res) => {

    return res.status(400).json({
        error: 'Something went wrong'
    });

} 

let signInFailed = (res) => {
    return res.status(500).json({
        message : 'Email or password incorrect'
    });
}


router.post('/', (req, res, next) => {

    User.find({
        email : req.body.email
    }).exec((err, data) => {
        if (err) {
            return errorHandling(res);
        }else {
            if (data.length > 0) {
                bcrypt.compare(req.body.password, data[0].password , (err, result)=> {
                        console.log(result);
                        if (err) {
                            return signInFailed(res);
                        }else {
                            if (result) {
                                let token = jwt.sign({
                                email: data[0].email,
                                firstname : data[0].firstName,
                                lastname : data[0].lastName
                            }, 
                            'test'
                            );
                            res.status(200).json({
                                message: 'Sign In went successful',
                                token : token
                            })
                        }else {
                           return signInFailed(res);
                        }
                        }
                })
                
            }else {
                return signInFailed(res);
            }
        }
    });

});

module.exports = router;