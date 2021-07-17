const auth = require('../services/authServices')
const { User } = require('../model/userSchema')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Jimp = require('jimp')

const registrationController = async (req, res, next) => {
  const createdUser = await auth.registration(req.body)
  return res.status(201).json({ user: createdUser })
}
const verificationController = async (req, res, next) => {
  await auth.verification(req.params.verificationToken)
  return res.status(200).json({ message: 'Verification successful' })
}
const ifFirstFailedVerificationController = async (req, res, next) => {
  await auth.ifFirstFailedVerification(req.body)
  return res.status(200).json({ message: 'Verification email sent' })
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
const updateAvatarController = async (req, res, next) => {
  const [, extension] = req.file.originalname.split('.')
  const rename = `${uuidv4()}.${extension}`
  Jimp.read(req.file.path, (err, file) => {
    if (err) throw err
    file
      .resize(250, 250)
      .write(path.resolve(`./public/avatars/${rename}`))
  })
  fs.unlink(req.file.path, (err) => {
    if (err) throw err
  })
  const updatedUser = await auth.updateAvatarURl(req.user._id, `/avatars/${rename}`)
  res.status(200).json({ avatarURL: updatedUser.avatarURL })
}

module.exports = {
  registrationController,
  verificationController,
  ifFirstFailedVerificationController,
  loginController,
  logoutController,
  getCurrentUserController,
  updateSubscriptionController,
  updateAvatarController
}
