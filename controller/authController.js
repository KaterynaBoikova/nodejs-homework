const auth = require('../services/authServices')
const { User } = require('../model/userSchema')

const registrationController = async (req, res, next) => {
  const createdUser = await auth.registration(req.body)
  return res.status(201).json({ user: createdUser })
}

const loginController = async (req, res, next) => {
  const token = await auth.login(req.body)
  const userLogged = await User.findOne({ email: req.body.email })
  res.status(200).json({ token: token, user: { email: userLogged.email, subscription: userLogged.subscription } })
}
const logoutController = async (req, res, next) => {
  await auth.logout(req.user._id)
  res.status(204).json({})
}
const getCurrentUserController = async (req, res, next) => {
  const currentUser = await auth.getCurrentUser(req.user._id)
  res.status(200).json({ user: { email: currentUser.email, subscription: currentUser.subscription } })
}

const updateSubscriptionController = async (req, res, next) => {
  const currentUser = await auth.updateSubscription(req.user._id, req.body)
  res.status(200).json({ user: { email: currentUser.email, subscription: currentUser.subscription } })
}
module.exports = {
  registrationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController
}
