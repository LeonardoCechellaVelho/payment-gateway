const { usecase, step, Ok } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const User = require('../../entities/user')
const UserRepository = require('../../../infra/data/repositories/userRepository')

const dependency = { UserRepository }

const findAllUser = injection =>
  usecase('Find all Users', {
    request: {
      limit: Number,
      offset: Number
    },

    response: [User],

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return all the Users': step(async ctx => {
      const repo = new ctx.di.UserRepository(injection)
      const users = await repo.findAll(ctx.req)
      return Ok(ctx.ret = users)
    })
  })

module.exports =
  herbarium.usecases
    .add(findAllUser, 'FindAllUser')
    .metadata({ group: 'User', operation: herbarium.crud.readAll, entity: User })
    .usecase
