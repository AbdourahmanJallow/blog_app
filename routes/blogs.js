const express = require('express');

const {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    uploadBlogImage,
    addCommentToBlog
} = require('../controllers/blogs');
const { protect, authorize } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Blog = require('../models/Blog');
const uploadPhoto = require('../middleware/uploadPhoto');

const router = express.Router({ mergeParams: true });

router
    .route('/')
    .get(
        advancedResults(Blog, {
            path: 'author',
            select: 'name email'
        }),
        getAllBlogs
    )
    .post(protect, createBlog);

// Add comment route
router.route('/:id/comment').post(protect, addCommentToBlog);

router
    .route('/:id')
    .get(getBlog)
    .put(protect, authorize('admin', 'user'), updateBlog)
    .delete(protect, authorize('admin', 'user'), deleteBlog);

// Upload blog image
router
    .route('/:id/photo')
    .put(
        protect,
        authorize('admin', 'user'),
        uploadPhoto(Blog, 'Blog', 'featuredImage'),
        uploadBlogImage
    );
module.exports = router;
