const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const User = require('../../entities/user')
const UserRepository = require('../../../infra/data/repositories/userRepository')

const dependency = { UserRepository }

const findUser = injection =>
  usecase('Find a User', {
    request: {
      id: String,
    },

    response: User,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Find and return the User': step(async ctx => {
      const id = ctx.req.id
      const repo = new ctx.di.UserRepository(injection)
      const [user] = await repo.findByID(id)
      if (!user) return Err.notFound({ 
        message: `User entity not found by ID: ${id}`,
        payload: { entity: 'User', id }
      })
      return Ok(ctx.ret = user)
    })
  })

module.exports =
  herbarium.usecases
    .add(findUser, 'FindUser')
    .metadata({ group: 'User', operation: herbarium.crud.read, entity: User })
    .usecase