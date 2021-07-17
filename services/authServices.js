const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../model/userSchema')
const errors = require('../services/errors')
const gravatar = require('gravatar')
const { v4: uuidv4 } = require('uuid')
require('dotenv').config()
const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const registration = async (body) => {
  const userExist = await User.findOne({ email: body.email })
  if (userExist) {
    throw new errors.EmailInUseError('Email in use')
  }
  const newUser = {
    email: body.email,
    password: body.password,
    subscription: body.subscription || 'starter',
    avatarURL: gravatar.url(body.email),
    verifyToken: uuidv4()
  }
  const user = new User(newUser)
  await user.save()
  const msg = {
    to: body.email,
    from: 'dfrancon.r@gmail.com',
    subject: 'Thank you for registration!',
    text: `Please, <a href="http://localhost:8081/api/users/verify/${user.verifyToken}">confirm </a> your email address`,
    html: `Please, <a href="http://localhost:8081/api/users/verify/${user.verifyToken}">confirm </a> your email address`,
  }
  await sgMail.send(msg)

  return User.findOne({ email: newUser.email }, { subscription: 1, email: 1, _id: 0 })
}
const verification = async (token) => {
  const verifyUser = await User.findOne({ verifyToken: token })

  if (!verifyUser) {
    throw new errors.NotAuthorizedError('User not found')
  }
  verifyUser.verified = true
  verifyUser.verifyToken = 'null'
  await verifyUser.save()
}
const ifFirstFailedVerification = async (body) => {
  const verifyUser = await User.findOne({ email: body.email })

  if (!verifyUser) {
    throw new errors.NotAuthorizedError('User not found')
  }
  if (verifyUser.verified) {
    throw new errors.NotAuthorizedError('Verification has already been passed')
  }
  const msg = {
    to: verifyUser.email,
    from: 'dfrancon.r@gmail.com',
    subject: 'Thank you for registration!',
    text: `Please, <a href="http://localhost:8081/api/users/verify/${verifyUser.verifyToken}">confirm </a> your email address`,
    html: `Please, <a href="http://localhost:8081/api/users/verify/${verifyUser.verifyToken}">confirm </a> your email address`,
  }
  await sgMail.send(msg)
}

const login = async (body) => {
  const userExist = await User.findOne({ email: body.email, verified: true })
  if (!userExist) {
    throw new errors.NotAuthorizedError('Email or pass not valid')
  }
  if (!await bcrypt.compare(body.password, userExist.password)) {
    throw new errors.NotAuthorizedError('Email or pass not valid')
  }
  const token = jwt.sign({ _id: userExist._id, }, process.env.JWT_SECRET)
  await User.updateOne({ email: body.email }, { $set: { token: token } })
  return token
}

const logout = async (userId) => {
  await User.updateOne({ _id: userId }, { $set: { token: null } })
}

const getCurrentUser = async (userId) => {
  return User.findOne({ _id: userId })
}

const updateSubscription = async (userId, body) => {
  if (!User.schema.paths.subscription.enumValues.includes(body.subscription)) {
    throw new errors.ValidationError('Subscription Plan not valid')
  }
  await User.updateOne({ _id: userId }, { $set: { subscription: body.subscription } })
  return User.findOne({ _id: userId })
}
const updateAvatarURl = async (userId, path) => {
  await User.updateOne({ _id: userId }, { $set: { avatarURL: path } })
  return User.findOne({ _id: userId })
}

module.exports = {
  registration,
  verification,
  ifFirstFailedVerification,
  login,
  logout,
  getCurrentUser,
  updateSubscription,
  updateAvatarURl
}
