const fs = require('fs/promises')
const shortid = require('shortid')
const path = require('path')
const contactsPath = path.resolve('./model/contacts.json')

const listContacts = async () => {
  try {
    const allContacts = await fs.readFile(contactsPath)
    return JSON.parse(allContacts)
  } catch (err) { return err.message }
}

const getContactById = async (contactId) => {
  try {
    const allContacts = await fs.readFile(contactsPath, 'utf8')
    const contactFound = JSON.parse(allContacts).find(({ id }) => id === Number(contactId))
    return contactFound
  } catch (err) { return err.message }
}

const removeContact = async (contactId) => {
  try {
    const allContacts = await fs.readFile(contactsPath, 'utf8')
    const editedList = JSON.parse(allContacts).filter(({ id }) => id !== Number(contactId))
    fs.writeFile(contactsPath, JSON.stringify(editedList), 'utf8')
  } catch (err) { return err.message }
}

const addContact = async (body) => {
  const newContact = {
    id: shortid.generate(),
    name: body.name,
    email: body.email,
    phone: body.phone
  }

  try {
    const allContacts = await fs.readFile(contactsPath, 'utf8')
    const jsonData = JSON.parse(allContacts)
    const list = jsonData
    const updatedList = list.push(newContact)
    fs.writeFile(contactsPath, JSON.stringify(list), 'utf8')
  } catch (err) { return err.message }
}

const updateContact = async (contactId, body) => {
  let updatedContact
  try {
    const allContacts = await fs.readFile(contactsPath, 'utf8')
    const updatedList = JSON.parse(allContacts).map(contact => {
      if (contact.id === Number(contactId)) {
        updatedContact = { ...contact, ...body }
        return updatedContact
      } return contact
    })
    fs.writeFile(contactsPath, JSON.stringify(updatedList), 'utf8')
    return updatedContact
  } catch (err) { return err.message }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
