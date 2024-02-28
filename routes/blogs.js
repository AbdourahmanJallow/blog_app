const express = require('express');
const router = express.Router();
const {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    uploadBlogImage
} = require('../controllers/blogs');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Blog = require('../models/Blog');

router
    .route('/')
    .get(advancedResults(Blog), getAllBlogs)
    .post(protect, createBlog);

router
    .route('/:id')
    .get(getBlog)
    .put(protect, authorize('admin', 'user'), updateBlog)
    .delete(protect, authorize('admin', 'user'), deleteBlog);

// Uplaod blog image
router
    .route('/:id/photo')
    .put(protect, authorize('admin', 'user'), uploadBlogImage);
module.exports = router;
