const express = require('express');
const router = express.Router();

const Comment = require('../model/comment');

const checkAuth = require('../middleware/check-auth');


// Get all comment of a given Article ID
router.get('/:articleId', (req, res, next) => {

    // Find the comment by ID
    Comment.find({
        article: req.params.articleId
    })
    .exec((err, data) => {
        // Error handeling
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            // Send response
            res.status(200).json(data);
        }
    });
});

// Add a comment
router.post('/', (req, res, next) => {
    // Set the values of the comment SCHEMA
    let comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
        article: req.body.articleId
    });

    // Create the element
    comment.save((err) => {
        // Handle Errors
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            res.status(200).json({
                message: 'Comment inserted successfuly'
            });
        }
    });

});

// Get ALL Comments
router.get('/', (req, res, next) => {
    Comment.find({}).exec((err, data) => {
        // Error Handeling
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            })
        }else {
            res.status(200).json(data);
        }
    });
});

// Delete Comment by ID
router.delete('/:commentId', checkAuth.checkAuthNormal,(req, res, next) => {
    Comment.findOne({   
        _id : req.params.commentId
    }).exec((err, data) => {
        // Error handeling
        if (err) {
            return res.status(400).json({
                error: 'Something went wrong'
            });
        }else {
            if (data) { 
                // See if the comment exists
                Comment.remove({ 
                    // If So . Delete comment
                    _id : req.params.commentId
                }).exec((err) => {
                    // Error Handeling
                    if (err) { 
                        return res.status(400).json({
                            error: 'Something went wrong'
                        })
                    }else {
                        // Send response
                        res.status(200).json({
                            message: 'Comment deleted Successfuly'
                        })
                    }
                });
            }else { 
                // If Comment dosen't exist
                res.status(500).json({
                    message: 'This comment doesn\'t exist'
                });
            }
        }
    });
});

module.exports = router;
