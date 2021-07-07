const { Contact } = require('../model/contactsSchema')

const listContacts = async ({ skip, limit }, owner, query) => {
  try {
    const contacts = await Contact.find({ owner })
      .find(query)
      .skip(skip)
      .limit(limit)
    return contacts
  } catch (err) { return err.message }
}

const getContactById = async (contactId, owner) => {
  try {
    const contactFound = await Contact.findOne({ _id: contactId, owner })
    return contactFound
  } catch (err) { return err.message }
}

const removeContact = async (contactId, owner) => {
  try {
    await Contact.findOneAndRemove({ _id: contactId, owner })
  } catch (err) { return err.message }
}

const addContact = async (body, owner) => {
  const newContact = {
    name: body.name,
    email: body.email,
    phone: body.phone,
    favorite: body.favorite || false,
    owner: owner
  }

  try {
    const contact = new Contact(newContact)
    await contact.save()
  } catch (err) { return err.message }
}

const updateContact = async (contactId, body, owner) => {
  try {
    await Contact.findOneAndUpdate({ _id: contactId, owner }, { ...body }, { new: true })
    return getContactById(contactId, owner)
  } catch (err) { return err.message }
}

const updateStatusContact = async (contactId, body, owner) => {
  try {
    await Contact.findOneAndUpdate({ _id: contactId, owner }, { ...body },)
    return getContactById(contactId, owner)
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
