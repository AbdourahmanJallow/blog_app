const express = require('express');
const router = express.Router();
const {
    getUser,
    getAllUsers,
    updateUser,
    deleteUser
} = require('../../controllers/user');
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/rolesList');

router
    .route('/')
    .get(verifyRoles(ROLES_LIST.Admin), getAllUsers)
    .put(updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteUser);

router.route('/:id').get(verifyRoles(ROLES_LIST.Admin), getUser);

module.exports = router;
