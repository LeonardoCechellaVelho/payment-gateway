const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const User = require('../../entities/user')
const UserRepository = require('../../../infra/data/repositories/userRepository')
const uuid = require('uuid')
const jwtTokens = require('../../utils/jwtHelpers')
const { cpf, cnpj } = require('cpf-cnpj-validator')

const dependency = { UserRepository }

const createUser = injection =>
  usecase('Create User', {
    request: {
      name: String,
      email: String,
      document: String
    },

    response: User,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the User is valid': step(ctx => {
      ctx.user = User.fromJSON(ctx.req)
      ctx.user.id = uuid.v4();
      
      if (!ctx.user.isValid()) 
        return Err.invalidEntity({
          message: 'The User entity is invalid', 
          payload: { entity: 'User' },
          cause: ctx.user.errors 
        })

      if (!cpf.isValid(ctx.user.document) && !cnpj.isValid(ctx.user.document))
        return Err.invalidEntity({
          message: 'The User Document is invalid', 
          payload: { entity: 'User' },
          cause: ctx.user.errors 
        })

      return Ok() 
    }),

    'Save the User': step(async ctx => {
      const repo = new ctx.di.UserRepository(injection)
      const user = ctx.user
      await repo.insert(user)
      return (ctx.ret = { "user_id": user.id, "token": jwtTokens(user)})
    })
  })

module.exports =
  herbarium.usecases
    .add(createUser, 'CreateUser')
    .metadata({ group: 'User', operation: herbarium.crud.create, entity: User })
    .usecase