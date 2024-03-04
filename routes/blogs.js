const express = require('express');

const {
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    uploadBlogImage,
    addCommentToBlog,
    addLike,
    removeLike,
    addDislike,
    removeDislike
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

// Like blog
router.route('/:id/like').put(addLike);
router.route('/:id/removelike').put(removeLike);
// Dislike blog
router.route('/:id/dislike').put(addDislike);
router.route('/:id/removedislike').put(removeDislike);

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
