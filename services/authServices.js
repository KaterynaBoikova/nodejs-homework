const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../model/userSchema')
const errors = require('../services/errors')

const registration = async (body) => {
  const userExist = await User.findOne({ email: body.email })
  if (userExist) {
    throw new errors.EmailInUseError('Email in use')
  }
  const newUser = {
    email: body.email,
    password: body.password,
    subscription: body.subscription || 'starter',
  }
  const user = new User(newUser)
  await user.save()
  return User.findOne({ email: newUser.email }, { subscription: 1, email: 1, _id: 0 })
}

const login = async (body) => {
  const userExist = await User.findOne({ email: body.email })
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

module.exports = {
  registration,
  login,
  logout,
  getCurrentUser,
  updateSubscription
}
