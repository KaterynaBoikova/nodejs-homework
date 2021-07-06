const express = require('express')
const router = express.Router()
const contacts = require('../../controller/contactsController')
const { authMiddleware } = require('../../middleware/authMiddleware')

router.use(authMiddleware)

router.get('/', contacts.listContactsController)
router.get('/:contactId', contacts.getContactByIdController)
router.post('/', contacts.addContactController)
router.delete('/:contactId', contacts.removeContactController)
router.patch('/:contactId', contacts.updateContactController)
router.patch('/:contactId/favorite', contacts.updateStatusContactController)

module.exports = router
