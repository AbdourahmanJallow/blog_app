const Blog = require('../models/Blog');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');
const path = require('path');
const User = require('../models/User');

// @description     Get all blogs
// routes           GET api/v1/blogs
// @access          public
const getAllBlogs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

// @description     Get a blog
// routes           GET api/v1/blogs/:id
// @access          public
const getBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id).exec();

    if (!blog) {
        return next(
            new ErrorResponse(`Blog with id ${req.params.is} not found.`, 404)
        );
    }

    res.status(200).json({ success: true, data: blog });
});

// @description     Create a new blog
// routes           POST api/v1/auth/users/:userId/blogs
// @access          public
const createBlog = asyncHandler(async (req, res, next) => {
    req.body.author = req.params.userId;
    req.body.isBlog = true;
    const blog = await Blog.create(req.body);

    if (!blog) {
        return next(new ErrorResponse(`Failed to create new blog.`, 400));
    }

    // Update this user's blogs
    await User.findByIdAndUpdate(req.params.userId, {
        $push: { blogs: blog._id }
    });

    res.status(201).json({ success: true, data: blog });
});

// @description     Update a new blog
// routes           PUT api/v1/blogs/:id
// @access          private
const updateBlog = asyncHandler(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);

    if (!blog)
        return next(
            new ErrorResponse(`Blog with id ${req.params.id} not found.`, 404)
        );

    // Make sure user is blog author
    if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new ErrorResponse('Not authorized to update blog.', 401));
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({ success: true, data: blog });
});

// @description     Delete blog
// routes           DELETE api/v1/blogs/:id
// @access          private
const deleteBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog)
        return next(
            new ErrorResponse(`Blog with id ${req.params.id} not found.`, 404)
        );

    // Make sure user is blog author
    if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new ErrorResponse('Not authorized to delete blog.', 401));
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({ success: true, data: {} });
});

// @description     Update a new blog
// routes           POST api/v1/blogs/:id/comment
// @access          public
const addCommentToBlog = asyncHandler(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);

    // Make sure blog exists
    if (!blog)
        return next(
            new ErrorResponse(`Blog with id ${req.params.id} not found.`, 404)
        );

    // Create comment
    let comment = new Blog({
        author: req.user._id,
        content: req.body.content,
        parentBlogId: blog._id
    });

    comment = await comment.save();

    // Push comment to blog comments
    blog = await Blog.findByIdAndUpdate(
        req.params.id,
        {
            $push: { comments: comment }
        },
        { new: true, runValidators: true }
    )
        .populate('comments')
        .select('content');

    res.status(200).json({ success: true, data: blog });
});

// @description     Upload blog image
// routes           POST api/v1/blogs/:id/photo
// @access          private
const uploadBlogImage = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.uploadPhoto);
});

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    uploadBlogImage,
    addCommentToBlog
};
