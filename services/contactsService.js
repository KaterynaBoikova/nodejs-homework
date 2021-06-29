const { Contact } = require('../model/contactsSchema')

const listContacts = async () => {
  try {
    const contacts = await Contact.find({})
    return contacts
  } catch (err) { return err.message }
}

const getContactById = async (contactId) => {
  try {
    const contactFound = await Contact.findById(contactId)
    return contactFound
  } catch (err) { return err.message }
}

const removeContact = async (contactId) => {
  try {
    await Contact.findByIdAndRemove(contactId)
  } catch (err) { return err.message }
}

const addContact = async (body) => {
  const newContact = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    favorite: body.favorite || false,
  }

  try {
    const contact = new Contact(newContact)
    await contact.save()
  } catch (err) { return err.message }
}

const updateContact = async (contactId, body) => {
  try {
    await Contact.findByIdAndUpdate(contactId, { ...body }, { new: true })
    return getContactById(contactId)
  } catch (err) { return err.message }
}

const updateStatusContact = async (contactId, body) => {
  try {
    await Contact.findByIdAndUpdate(contactId,
      { $set: { favorite: body.favorite } })
    return getContactById(contactId)
  } catch (err) {
    return err.message
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
}
