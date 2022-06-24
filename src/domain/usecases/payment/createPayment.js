const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const Payment = require('../../entities/payment')
const PaymentRepository = require('../../../infra/data/repositories/paymentRepository')
const uuid = require('uuid')
const getRandom = require('../../utils/getRandom')
const { response } = require('express')
const Methods = require('../../enums/paymentMethods')
const UserStatus = require('../../enums/userStatus')

const dependency = { PaymentRepository }

const createPayment = injection =>
  usecase('Create Payment', {
    request: {
      value: Number,
      method: String
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

    'Check if the Payment is valid': step(ctx => {
      ctx.payment = Payment.fromJSON(ctx.req)
      ctx.payment.id = uuid.v4();
      
      if (!ctx.payment.isValid()) 
        return Err.invalidEntity({
          message: 'The Payment entity is invalid', 
          payload: { entity: 'Payment' },
          cause: ctx.payment.errors 
        })

      // There is a implementation for enums in HerbsJS TODO list, for now, we have to resort to an object
      if (!Methods.isDefined(ctx.payment.method)) 
        return Err.invalidEntity({
          message: 'The Payment method is invalid', 
          payload: { entity: 'Payment' },
          cause: ctx.payment.errors 
        })

      return Ok() 
    }),

    'Save the Payment': step(async ctx => {
      const repo = new ctx.di.PaymentRepository(injection)
      const payment = ctx.payment
      await repo.insert(payment)
      return (ctx.ret = { "payment_id": payment.id, "status": 200})
    })
  })

module.exports =
  herbarium.usecases
    .add(createPayment, 'CreatePayment')
    .metadata({ group: 'Payment', operation: herbarium.crud.create, entity: Payment })
    .usecase