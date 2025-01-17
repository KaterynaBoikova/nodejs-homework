const express = require('express')
const router = express.Router()
const auth = require('../../controller/authController')
const { authMiddleware } = require('../../middleware/authMiddleware')
const { userDataValidation, verificationValidation } = require('../../services/authValidation')
const { asyncWrapper } = require('../../services/asyncWrapper')
const { avatarMiddleware } = require('../../middleware/avatarMiddleware')

router.post('/signup', userDataValidation, asyncWrapper(auth.registrationController))
router.get('/verify/:verificationToken', asyncWrapper(auth.verificationController))
router.post('/verify', verificationValidation, asyncWrapper(auth.ifFirstFailedVerificationController))
router.post('/login', userDataValidation, asyncWrapper(auth.loginController))
router.post('/logout', authMiddleware, asyncWrapper(auth.logoutController))
router.get('/current', authMiddleware, asyncWrapper(auth.getCurrentUserController))
router.patch('/', authMiddleware, asyncWrapper(auth.updateSubscriptionController))
router.patch('/avatar', authMiddleware, avatarMiddleware.single('avatar'), asyncWrapper(auth.updateAvatarController))
module.exports = router
