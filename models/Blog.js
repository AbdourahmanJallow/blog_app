const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Provide author of blog.']
        },
        category: { type: String, required: true },
        tags: [String]
    },
    { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
