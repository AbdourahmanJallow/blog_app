const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema.Types;

const blogSchema = new Schema({
    title: {
        type: String,
        required: [
            function () {
                return this.isBlog;
            },
            'Please provide a blog title.'
        ],
        maxlength: [50, 'Title cannot exceed 50 characters.']
    },
    content: {
        type: String,
        required: [true, 'Please provide blog content.'],
        maxlength: [1000, 'Content cannot exceed 1000 characters.']
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Please provide blog author.']
    },
    category: {
        type: [String],
        required: [
            function () {
                return this.isBlog;
            },
            'Please provide blog categorie(s).'
        ],
        enum: [
            'technology',
            'coding',
            'food',
            'business',
            'travel',
            'health & fitness',
            'education',
            'fashion'
        ]
    },
    slug: String,
    featuredImage: {
        type: String,
        default: 'no-featuredImage.jpg'
    },
    parentBlogId: ObjectId,
    comments: [{ type: ObjectId, ref: 'Blog' }],
    tags: [String],
    likes: [{ type: ObjectId, ref: 'User' }],
    dislikes: [{ type: ObjectId, ref: 'User' }],
    isBlog: {
        type: Boolean,
        default: false,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    // lastUpdatedAt: { type: Date, default: Date.now}
});

// Save slug information
blogSchema.pre('save', function (next) {
    this.isBlog ? (this.slug = slugify(this.title, { lower: true })) : next();

    next();
});

module.exports = mongoose.model('Blog', blogSchema);
