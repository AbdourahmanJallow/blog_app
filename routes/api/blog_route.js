const express = require('express');
const router = express.Router();
const {
    createNewBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog,
    search
} = require('../../controllers/blog');
const { verifyRoles } = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/rolesList');

router
    .route('/')
    .get(getAllBlogs)
    .post(createNewBlog)
    .put(updateBlog)
    .delete(deleteBlog);

router.route('/:id').get(getBlog);

router.route('/search').get(search);

module.exports = router;
