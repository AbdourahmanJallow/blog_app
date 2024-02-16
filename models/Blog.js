const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide blog title.'],
        maxlength: [50, 'Title cannot exceed 50 characters.']
    },
    content: {
        type: String,
        required: [true, 'Please provide blog content.'],
        maxlength: [500, 'Content cannot exceed 500 characters.']
    },
    // author: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //     required: [true, 'Please provide blog owner.']
    // },
    category: {
        type: [String],
        required: [true, 'Please provide blog categorie(s).'],
        enum: [
            'Technology',
            'Lifestyle',
            'Food & Cooking',
            'Business & Entrepreneurship',
            'Travel',
            'Health & Fitness',
            'Education'
        ]
    },
    slug: String,
    featuredImage: {
        type: String,
        default: 'no-featured-image.jpg'
    },
    tags: [String],
    createdAt: {
        type: Date,
        default: Date.now
    }
    // lastUpdatedAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Blog', blogSchema);
