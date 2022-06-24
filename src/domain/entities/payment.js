const { entity, id, field, validate } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')

const Payment =
        entity('Payment', {
          id: id(String),
          value: field(Number, { validation: { allowNull: false } }),
          method: field(String, { validation: { allowNull: false } })
        })

module.exports =
  herbarium.entities
    .add(Payment, 'Payment')
    .entity
