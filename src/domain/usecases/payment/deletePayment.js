const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Payment = require('../../entities/payment')
const PaymentRepository = require('../../../infra/data/repositories/paymentRepository')
const UserStatus = require('../../enums/userStatus')

const dependency = { PaymentRepository }

const deletePayment = injection =>
  usecase('Delete Payment', {
    request: {
      id: String
    },

    response: Boolean,

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

    'Check if the Payment exist': step(async ctx => {
      const repo = new ctx.di.PaymentRepository(injection)
      const [payment] = await repo.findByID(ctx.req.id)
      ctx.payment = payment

      if (payment) return Ok()
      return Err.notFound({
          message: `Payment ID ${ctx.req.id} does not exist`,
          payload: { entity: 'Payment' }
      })
    }),

    'Delete the Payment': step(async ctx => {
      const repo = new ctx.di.PaymentRepository(injection)
      ctx.ret = await repo.delete(ctx.payment)
      return Ok()
    })
  })

module.exports =
  herbarium.usecases
    .add(deletePayment, 'DeletePayment')
    .metadata({ group: 'Payment', operation: herbarium.crud.delete, entity: Payment })
    .usecase