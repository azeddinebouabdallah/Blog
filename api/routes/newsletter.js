const express = require('express');
const router = express.Router();

const checkAuth = require('../middleware/check-auth');

// Import model
const Newsletter = require('../model/newsletter');

router.get('/', checkAuth.checkAuthNormal, (req, res, next) => {

    Newsletter.find().exec((err, docs) => {
        if (err) {
            return res.status(500).json({
                error : 'Something went wrong'
            });
        }else {
            res.status(200).json(docs);
            }
        }
    );
    

});

router.post('/', (req, res, next) => {
     
    // get the data from the client 
    let Uname = req.body.name;
    let Uemail = req.body.email;

    // Insert Data
    let newNewsletter = new Newsletter({
        name: Uname,
        email: Uemail 
    });
    
    newNewsletter.save(err => {
        if (err) {
            return res.status(500).json({msg: 'Something went wrong'});
        }else {
            res.status(200).json({
                msg: 'Insert successful',
            });
        }
    });

});

router.delete('/:subId', checkAuth.checkAuthAdmin,(req, res, next) => {
    let id = req.params.subId; 

    Newsletter.remove({
        _id : id
    }, 
    (err, result) => {
        if (err) {
            return res.status(500).json({
                error: 'Something went wrong'
            })
        }else {
            res.status(200).json(result);
        }
    });
});

module.exports = router;
