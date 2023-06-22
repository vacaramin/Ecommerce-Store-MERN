const express = require('express')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')
const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateProfile,
    allUsers,
    getUserDetails,
    updateUser,
    deleteUser
} = require('../controllers/userController')

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

router.route('/logout').get(logoutUser)
router.route('/password/forgot').post(forgotPassword)

router.route('/password/reset/:token').post(resetPassword)
router.route('/me').get(isAuthenticatedUser, getUserProfile)
router.route('/password/update').post(isAuthenticatedUser, updatePassword)
router.route('/me/update').post(isAuthenticatedUser, updateProfile)

//admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), allUsers)

router.route('/admin/user/:id')
.get(isAuthenticatedUser, authorizeRoles('admin'), getUserDetails)
.put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
.delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);
module.exports = router;