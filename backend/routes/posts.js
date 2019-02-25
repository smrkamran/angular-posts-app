const express = require('express');
const router = express.Router();
const extractFile = require('../middleware/file');
const PostsController = require('../controllers/posts');
const checkAuth = require('../middleware/check-auth');


router.post(
    '', 
    checkAuth, 
    extractFile, 
    PostsController.createPost
    );

router.get(
    '', 
    PostsController.getPosts
    );

router.get(
    '/:id', 
    PostsController.getPost
    );

router.delete(
    '/:id', 
    checkAuth, 
    PostsController.deletePost
    );

router.put(
    '/:id', 
    checkAuth, 
    extractFile, 
    PostsController.updatePost
    );

module.exports = router;