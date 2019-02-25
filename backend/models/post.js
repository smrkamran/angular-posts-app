const mongoose = require('mongoose');

const userSchema = {
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    }
};

const postSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    creator: {
        type: userSchema,
        required: true
    }
},{timestamps: true});


module.exports = mongoose.model('Post',postSchema);