const Blog = require('../models/Blog');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorHandler');
const path = require('path');

// @description     Create a new blog
// routes           POST api/v1/blogs
// @access          public
const createBlog = asyncHandler(async (req, res, next) => {
    req.body.author = req.user._id;
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

// @description     Get all blogs
// routes           GET api/v1/blogs
// @access          public
const getAllBlogs = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
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

// @description     Upload blog image
// routes           POST api/v1/blogs/:id/photo
// @access          private
const uploadBlogImage = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
        return next(
            new ErrorResponse(`Blog with id ${req.params.id} not found.`, 404)
        );
    }

    // Make sure user is blog author
    if (
        blog.author.toString() !== req.user._id.toString() &&
        req.user.role !== 'admin'
    ) {
        return next(new ErrorResponse('Not authorized to update blog.', 401));
    }

    // check if user has uploaded an image
    if (!req.files) {
        return next(new ErrorResponse(`Provide image to be uploaded.`, 400));
    }

    const file = req.files.file;

    // Make sure image is uploaded
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image.', 400));
    }

    // Make sure size is not more than max size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(
            new ErrorResponse(
                `Image size is greater than max size: ${process.env.MAX_FILE_UPLOAD}`,
                400
            )
        );
    }

    // add custome photo name
    file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            console.log(err.message);

            return next(new ErrorResponse('Error while uploading image.', 500));
        }
        const blog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                featuredImage: file.name
            },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, data: blog.featuredImage });
    });
});

module.exports = {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    uploadBlogImage
};
