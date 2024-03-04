const express = require('express');

const {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    uploadBlogImage,
    addCommentToBlog,
    likeBlog,
    unlikeBlog
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

router.use(protect);

// Add comment route
router.route('/:id/comment').post(addCommentToBlog);

// Like and unlike a blog
router.route('/:id/like').put(likeBlog);
router.route('/:id/unlike').put(unlikeBlog);

router
    .route('/:id')
    .get(getBlog)
    .put(authorize('admin', 'user'), updateBlog)
    .delete(authorize('admin', 'user'), deleteBlog);

// Upload blog image
router
    .route('/:id/photo')
    .put(
        authorize('admin', 'user'),
        uploadPhoto(Blog, 'Blog', 'featuredImage'),
        uploadBlogImage
    );
module.exports = router;
