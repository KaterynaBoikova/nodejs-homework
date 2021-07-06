const contacts = require('../services/contactsService')
const validation = require('../services/contactsValidation.js')

const listContactsController = async (req, res, next) => {
  try {
    const options = {
      skip: parseInt(req.query.skip) || 0,
      limit: parseInt(req.query.limit) <= 20 && parseInt(req.query.limit) ? parseInt(req.query.limit) : 20,
    }
    const { _id: owner } = req.user
    const query = req.query.favorite ? { favorite: req.query.favorite } : {}

    const allContacts = await contacts.listContacts(options, owner, query)
    res.status(200).json({ status: 'ok', code: 200, message: 'Success Request', data: allContacts })
  } catch (err) { return err }
}

const getContactByIdController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user
    const foundContact = await contacts.getContactById(req.params.contactId, owner)
    if (foundContact) {
      return res.status(200).json({ status: 'ok', code: 200, message: `Success Request for ${req.params.contactId}`, data: foundContact })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}

const removeContactController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user
    const foundContact = await contacts.getContactById(req.params.contactId, owner)

    if (foundContact) {
      await contacts.removeContact(req.params.contactId, owner)
      return res.status(200).json({ status: 'ok', code: 200, message: 'contact deleted' })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}

const addContactController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user
    const validated = await validation.schema.isValid({ name: req.body.name, email: req.body.email, phone: req.body.phone, favorite: req.body.favorite })
    if (validated) {
      await contacts.addContact(req.body, owner)
      return res.status(201).json({ status: 'ok', code: 200, message: 'Added', data: req.body })
    } return res.status(400).json({ message: 'missing required name field' })
  } catch (err) { return err }
}

const updateContactController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user
    const validated = await validation.schemaUpdate.isValid({ name: req.body.name, email: req.body.email, phone: req.body.phone })
    if (!validated) {
      return res.status(400).json({ message: 'missing field' })
    }
    const foundContact = await contacts.getContactById(req.params.contactId, owner)
    if (foundContact) {
      const updated = await contacts.updateContact(req.params.contactId, req.body, owner)
      return res.status(200).json({ status: 'ok', code: 200, message: 'contact updated', data: updated })
    } return res.status(400).json({ message: 'Not found' })
  } catch (err) { return err }
}
const updateStatusContactController = async (req, res, next) => {
  try {
    const { _id: owner } = req.user
    if (req.body.favorite === undefined) {
      return res.status(400).json({ message: 'missing field favorite' })
    }
    const validated = await validation.schemaFav.isValid({ favorite: req.body.favorite })
    if (!validated) {
      return res.status(400).json({ message: 'bad request' })
    }
    const foundContact = await contacts.getContactById(req.params.contactId, owner)
    if (foundContact) {
      const updated = await contacts.updateStatusContact(req.params.contactId, req.body, owner)
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
