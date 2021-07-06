const express = require('express')
const router = express.Router()
const auth = require('../../controller/authController')
const { authMiddleware } = require('../../middleware/authMiddleware')
const { userDataValidation } = require('../../services/authValidation')
const { asyncWrapper } = require('../../services/asyncWrapper')

router.post('/signup', userDataValidation, asyncWrapper(auth.registrationController))
router.post('/login', userDataValidation, asyncWrapper(auth.loginController))
router.post('/logout', authMiddleware, asyncWrapper(auth.logoutController))
router.get('/current', authMiddleware, asyncWrapper(auth.getCurrentUserController))
router.patch('/', authMiddleware, asyncWrapper(auth.updateSubscriptionController))
module.exports = router
