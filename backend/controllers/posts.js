
const Post = require('../models/post');


module.exports.createPost = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const post = new Post({
        title : req.body.title,
        content: req.body.content,
        imageUrl: url + '/images/' + req.file.filename,
        creator: { id: req.userData.userId, name: req.userData.email }
    });
    post.save().then(result => {
        res.status(201).json(result);
    })
    .catch(error => {
        res.status(500).json({
            message: 'Failed to create new post.'
        })
    });
};

module.exports.getPosts = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPosts;
    if(pageSize && currentPage) {
        postQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    postQuery
        .then(documents => {
            fetchedPosts = documents;
            return Post.count();
        }).then(count => {
            res.status(200).json({
                message : 'success',
                data: fetchedPosts,
                maxPosts: count
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Fetching posts failed!'
            })
        });
};

module.exports.getPost = (req, res, next) => {
    Post.findById(req.params.id).then((result) => {
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({message: 'Post not found'});
        }
    })
    .catch(error => {
        res.status(500).json({
            message: 'Fetching post failed!'
        })
    });
};

module.exports.deletePost = (req, res, next) => {
    const id = req.params.id;
    Post.deleteOne({'_id': id, 'creator.id': req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json('Deletion successful');
        } else {
            res.status(401).json('Unauthorized');
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Deleting post failed!'
        })
    });
};

module.exports.updatePost = (req, res, next) => {
    let imageUrl = req.body.imageUrl;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imageUrl = url + '/images/' + req.file.filename
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.content,
        imageUrl: imageUrl,
        creator: {
            id: req.userData.userId,
            name: req.userData.email
        }
    });

    Post.updateOne({'_id': req.params.id, 'creator.id': req.userData.userId },post).then(result => {
        if (result.n > 0) {
            res.status(200).json('Update successful');
        } else { 
            res.status(401).json('Unauthorized');
        }
    }).catch(error => {
        res.status(500).json({
            message: 'Couldnt update post'
        })
    })
};