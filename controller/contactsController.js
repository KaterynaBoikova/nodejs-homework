const contacts = require('../services/contactsService')
const validation = require('../services/contactsValidation.js')

const listContactsController = async (req, res, next) => {
  try {
    const allContacts = await contacts.listContacts()
    res.status(200).json({ status: 'ok', code: 200, message: 'Success Request', data: allContacts })
  } catch (err) { return err }
}

const getContactByIdController = async (req, res, next) => {
  try {
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
      return res.status(200).json({ status: 'ok', code: 200, message: `Success Request for ${req.params.contactId}`, data: foundContact })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}

const removeContactController = async (req, res, next) => {
  try {
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
      await contacts.removeContact(req.params.contactId)
      return res.status(200).json({ status: 'ok', code: 200, message: 'contact deleted' })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}

const addContactController = async (req, res, next) => {
  try {
    const validated = await validation.schema.isValid({ name: req.body.name, email: req.body.email, phone: req.body.phone, favorite: req.body.favorite })
    if (validated) {
      await contacts.addContact(req.body)
      return res.status(201).json({ status: 'ok', code: 200, message: 'Added', data: req.body })
    } return res.status(400).json({ message: 'missing required name field' })
  } catch (err) { return err }
}

const updateContactController = async (req, res, next) => {
  try {
    const validated = await validation.schemaUpdate.isValid({ name: req.body.name, email: req.body.email, phone: req.body.phone })
    if (!validated) {
      return res.status(400).json({ message: 'missing field' })
    }
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
      const updated = await contacts.updateContact(req.params.contactId, req.body)
      return res.status(200).json({ status: 'ok', code: 200, message: 'contact updated', data: updated })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}
const updateStatusContactController = async (req, res, next) => {
  try {
    console.log(req.body.favorite)
    console.log(!req.body.favorite)
    if (req.body.favorite === undefined) {
      return res.status(400).json({ message: 'missing field favorite' })
    }
    const validated = await validation.schemaFav.isValid({ favorite: req.body.favorite })
    if (!validated) {
      return res.status(400).json({ message: 'bad request' })
    }
    const foundContact = await contacts.getContactById(req.params.contactId)
    if (foundContact) {
      const updated = await contacts.updateStatusContact(req.params.contactId, req.body)
      return res.status(200).json({ status: 'ok', code: 200, message: 'contact updated', data: updated })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}
module.exports = {
  listContactsController,
  getContactByIdController,
  removeContactController,
  addContactController,
  updateContactController,
  updateStatusContactController,
}
