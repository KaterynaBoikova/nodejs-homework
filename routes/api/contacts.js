const express = require('express')
const router = express.Router()
const contacts = require('../../model/index')
const yup = require('yup')

const schema = yup.object().shape({
  name: yup.string().required(),
  phone: yup.number().required().positive().integer().min(8),
  email: yup.string().email(),
})

var schemaUpdate = yup.object().shape({
  name: yup.string().when(['phone', 'email'], {
    is: (b, c) => !b && !c,
    then: yup.string().required()
  }),
  phone: yup.number().positive().integer().min(8).when(['name', 'email'], {
    is: (a, c) => !a && !c,
    then: yup.number().required()
  }),
  email: yup.string().email().when(['name', 'phone'], {
    is: (a, b) => !a && !b,
    then: yup.string().required()
  })
}, [['name', 'phone'], ['name', 'email'], ['phone','email']])


router.get('/', async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts()
    res.status(200).json({ status: 'ok', code: 200, messsage: 'Success Request', data: allContacts })
  } catch (err) { return err }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
      return res.status(200).json({ status: 'ok', code: 200, messsage: `Success Request for ${req.params.contactId}`, data: foundContact })
    } return res.status(404).json({ messsage: 'Not found' })
  } catch (err) { return err }
})

router.post('/', async (req, res, next) => {
  try {
    const validated = await schema.isValid({ name: req.body.name, email: req.body.email, phone: req.body.phone })
    if (validated) {
      await contacts.addContact(req.body)
      return res.status(201).json({ status: 'ok', code: 200, messsage: 'Added', data: req.body })
    } return res.status(400).json({ messsage: 'missing required name field' })
  } catch (err) { return err }
})

router.delete('/:contactId', async (req, res, next) => {
  try {
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
      await contacts.removeContact(req.params.contactId)
      return res.status(200).json({ status: 'ok', code: 200, messsage: 'contact deleted' })
    } return res.status(404).json({ messsage: 'Not found' })
  } catch (err) { return err }
})

router.patch('/:contactId', async (req, res, next) => {
  try {
    const validated = await schemaUpdate.isValid({ name: req.body.name, email: req.body.email, phone: req.body.phone })
    if (!validated){
      return res.status(400).json({ messsage: 'missing field' })
    }
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
     const updated = await contacts.updateContact(req.params.contactId, req.body)
      return res.status(200).json({ status: 'ok', code: 200, messsage: 'contact updated', data: updated })
    } return res.status(404).json({ messsage: 'Not found' })
  } catch (err) { return err }
})

module.exports = router
