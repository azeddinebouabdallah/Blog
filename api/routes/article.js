const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');

const checkAuth =  require('../middleware/check-auth');

// Error handling 
let errorHandle = (res) => {
    return res.status(400).json({
        error: 'Something went wrong'
    })
}

// ********* MULTER CONFIG ***********
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

    if (!file){
        callback(null, true);
    }else {

    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
        callback(null, true);
    }else {
        callback(null, false);
    }
    
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

// ********* END MULTER CONFIG ***********

const Article = require('../model/article');


// Get all articles
router.get('/', (req, res, next) => {
    
    Article.find({}).select('title image auther type date').exec((err, data) => {
        if (err) {
            return errorHandle(res);
        }else {
            res.status(200).json(data);
        }
    });

});

// Get article by ID
router.get('/:articleId', (req, res, next) => {
    
    Article.find({
        _id : req.params.articleId
    }).exec((err, data) => {
        if (err) {
            return errorHandle(res);
        }else {
            res.status(200).json(data);
        }
    });

});

// Get Article by category
router.get('/category/:category', (req, res, next) => {

    Article.find({
        type : req.params.category
    }).exec((err, data) => {
        if (err) {
            return errorHandle(res);
        }else {
            res.status(200).json(data);
        }
    });

});

// Get article bu auther
router.get('/auther/:autherId', (req, res, next) => {
    Article.find({
        auther : req.params.autherId
    }).exec((err, data) => {
        if (err) {
            return errorHandle(res);
        }else {
            res.status(200).json(data);
        }
    });
})

// Add article
router.post('/', 
    checkAuth.checkAuthNormal
    ,
    upload.fields([
        {name : 'thumbnail' , maxCount: 1},
        {name : 'photos', maxCount: 5}
    ]),
    (req, res) => {
        console.dir(req.files);
        let imagesPath = [];

        req.files['photos'].map(file => {
             console.log('$$$$$ === > Item : ' + file);
            imagesPath.push(file.path);
            });
   

         let article = new Article({
            title: req.body.title,
            image: req.files['thumbnail'][0].path,
            auther: req.body.autherId,
            content: req.body.content,
            inImg : imagesPath,
            type: req.body.category, 
        });

    

    // Create the article
    article.save((err, data) => {
        if (err) {
            console.log(err);
            return errorHandle(res);
        }else {
            res.status(200).json({
                message: 'Article created'
            });
        }
    });
});



// Update article by ID
router.patch('/:articleId', 
    checkAuth.checkAuthNormal,
    upload.fields(
    [
    { name: 'thumbnail', maxCount : 1}, 
    { name: 'photos', maxCount : 5}
    ])
    ,(req, res, next) => {
    
    Article.findOne({_id : req.params.articleId}).exec((err, data) => {
        if (err) {
            return errorHandle(res);
        }else {
            if (data) {
                
                let imagesPath = req.files['photos'].map(file => file.path);

                Article.update({_id : req.params.articleId}, {
                    $set : {
                        title: req.body.title,
                        image: req.files['thumbnail'][0].path,
                        auther: req.body.autherId,
                        content: req.body.content,
                        inImg : imagesPath,
                        type: req.body.category, 
                    }
                }).exec((err, data) => {
                    if (err) {
                        return errorHandle(res);
                    }else {
                        res.status(200).json({
                            message : 'Item Updated Successfuly'
                        })
                    }
                });
            }
        }
    });

});

// Delete article by ID
router.delete('/:articleId', 
    checkAuth.checkAuthNormal,
    (req, res, next) => {
    Article.findById(req.params.articleId, (err, data) => {
        if (err) {
            return errorHandle(res);
        }else {
            if (data) {

                if (data.image){
                    fs.unlinkSync(data.image);
                }
                data.inImg.map((img) => {
                    if (img){
                        fs.unlinkSync(img);
                    }
                });

                Article.remove({_id : req.params.articleId}, (err, data) => {
                    if (err) {
                        return errorHandle(res);
                    }else {
                        res.status(200).json({
                            message: 'Article removed Successfuly'
                        });
                    }
                })
            }else {
                res.status(500).json({
                    message: 'Article doesn\'t exist'
                });
            }
        }
    });

   
})

module.exports = router;
