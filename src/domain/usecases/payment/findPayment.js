const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Payment = require('../../entities/payment')
const PaymentRepository = require('../../../infra/data/repositories/paymentRepository')
const UserStatus = require('../../enums/userStatus')

const dependency = { PaymentRepository }

const findPayment = injection =>
  usecase('Find a Payment', {
    request: {
      id: String,
    },

    response: Payment,

    authorize: (user) => {
      switch (user) {
        case UserStatus.Authorized.key:
          return Ok();
        case UserStatus.Unauthorized.key:
          return Err.permissionDenied({
            message: 'Invalid token'
          });
        case UserStatus.Forbidden.key:
          return Err.permissionDenied({
            message: 'Invalid token'
          });
      }
    },

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Random generated error': step(() => {
      if (getRandom(0,100) >= 80)
        return Err.unknown({
          payload: { entity: 'Payment' },
          cause: 'Random generated error'
        })
      return Ok() 
    }),

    'Find and return the Payment': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.PaymentRepository(injection)
      const [payment] = await repo.findByID(id)
      return Ok(ctx.ret = payment)
    })
  })

module.exports =
  herbarium.usecases
    .add(findPayment, 'FindPayment')
    .metadata({ group: 'Payment', operation: herbarium.crud.read, entity: Payment })
    .usecase