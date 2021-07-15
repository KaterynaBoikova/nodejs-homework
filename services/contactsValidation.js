const yup = require('yup')

const schema = yup.object().shape({
  name: yup.string().required(),
  phone: yup.number().positive().integer().min(8),
  email: yup.string().email(),
  favorite: yup.boolean(),
})

const schemaUpdate = yup.object().shape({
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
}, [['name', 'phone'], ['name', 'email'], ['phone', 'email']])

const schemaFav = yup.object().shape({
  favorite: yup.boolean(),
})

module.exports = { schema, schemaUpdate, schemaFav }
