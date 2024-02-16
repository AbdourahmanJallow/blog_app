const express = require('express');
const router = express.Router();
const {
    createNewBlog,
    updateBlog,
    deleteBlog,
    getAllBlogs,
    getBlog
} = require('../../controllers/blog');
const { verifyRoles } = require('../../middleware/verifyRoles');
const { ROLES_LIST } = require('../../config/rolesList');

router.route('/').get(getAllBlogs).post(createNewBlog);

router.route('/:id').get(getBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
