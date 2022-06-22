const { entity, id, field, validate } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const User =
        entity('User', {
          id: id(String),
          name: field(String, { validation: { allowNull: false, length: { minimum: 3, maximum: 36 } } }),
          email: field(String, { validation: { allowNull: false, email: true } }),
          document: field(String, { validation: { allowNull: false } })
        })

module.exports =
  herbarium.entities
    .add(User, 'User')
    .entity
