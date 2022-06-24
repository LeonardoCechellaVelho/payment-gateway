const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const merge = require('deepmerge')
const User = require('../../entities/user')
const UserRepository = require('../../../infra/data/repositories/userRepository')
const { cpf, cnpj } = require('cpf-cnpj-validator')

const dependency = { UserRepository }

const updateUser = injection =>
  usecase('Update User', {
    request: {
      id: String,
      name: String,
      email: String,
      document: String
    },

    response: User,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Retrieve the User': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.UserRepository(injection)
      const [user] = await repo.findByID(id)
      ctx.user = user
      if (user === undefined) return Err.notFound({
        message: `User not found - ID: ${id}`,
        payload: { entity: 'User' }
      })

      return Ok(user)
    }),

    'Check if it is a valid User before update': step(ctx => {
      const oldUser = ctx.user
      const newUser = User.fromJSON(merge.all([ oldUser, ctx.req ]))
      ctx.user = newUser

      if (!cpf.isValid(ctx.user.document) && !cnpj.isValid(ctx.user.document))
        return Err.invalidEntity({
          message: 'The User Document is invalid', 
          payload: { entity: 'User' },
          cause: ctx.user.errors 
        })

      return newUser.isValid() ? Ok() : Err.invalidEntity({
        message: `User is invalid`,
        payload: { entity: 'User' },
        cause: newUser.errors
      })

    }),

    'Update the User': step(async ctx => {
      const repo = new ctx.di.UserRepository(injection)
      return (ctx.ret = await repo.update(ctx.user))
    })

  })

module.exports =
  herbarium.usecases
    .add(updateUser, 'UpdateUser')
    .metadata({ group: 'User', operation: herbarium.crud.update, entity: User })
    .usecase