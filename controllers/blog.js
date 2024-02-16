const { StatusCodes } = require('http-status-codes');
const Blog = require('../models/Blog');
const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');

// @description     Create a new blog
// routes           POST api/v1/blogs
// @access          public
const createNewBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.create(req.body);

    if (!blog) {
        return next(new ErrorResponse(`Failed to create new blog.`, 400));
    }

    res.status(201).json({ success: true, data: blog });
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

// @description     Get all blog
// routes           GET api/v1/blogs
// @access          public
const getAllBlogs = asyncHandler(async (req, res, next) => {
    const blogs = await Blog.find();

    res.status(200).json({ success: true, data: blogs });
});

// @description     Update a new blog
// routes           PUT api/v1/blogs/:id
// @access          private
const updateBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog)
        return next(
            new ErrorResponse(`Blog with id ${req.params.id} not found.`, 404)
        );

    res.status(200).json({ success: true, data: blog });
});

// @description     Delete blog
// routes           DELETE api/v1/blogs/:id
// @access          private
const deleteBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findByIdAndDelete(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!blog)
        return next(
            new ErrorResponse(`Blog with id ${req.params.id} not found.`, 404)
        );

    res.status(200).json({ success: true, data: {} });
});

module.exports = {
    createNewBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog
};
