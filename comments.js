// Create web server using express.js
// Create router for comments
// Create function for comments
// Export module

var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var Comment = require('../models/comment');
var Verify = require('./verify');

router.use(bodyParser.json());

router.route('/')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.find({})
    .populate('postedBy')
    .exec(function(err, comment){
        if(err) throw err;
        res.json(comment);
    });
})

.post(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.create(req.body, function(err, comment){
        if(err) throw err;
        console.log('Comment created!');
        var id = comment._id;
        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the comment with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req,res,next){
    Comment.remove({}, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

router.route('/:commentId')
.get(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.findById(req.params.commentId)
    .populate('postedBy')
    .exec(function(err, comment){
        if(err) throw err;
        res.json(comment);
    });
})

.put(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.findByIdAndUpdate(req.params.commentId, {
        $set: req.body
    }, {
        new: true
    }, function(err, comment){
        if(err) throw err;
        res.json(comment);
    });
})

.delete(Verify.verifyOrdinaryUser, function(req,res,next){
    Comment.findByIdAndRemove(req.params.commentId, function(err, resp){
        if(err) throw err;
        res.json(resp);
    });
});

module.exports = router;