const { usecase, step, Ok, Err } = require('@herbsjs/herbs')
const { herbarium } = require('@herbsjs/herbarium')
const User = require('../../entities/user')
const UserRepository = require('../../../infra/data/repositories/userRepository')

const dependency = { UserRepository }

const deleteUser = injection =>
  usecase('Delete User', {
    request: {
      id: String
    },

    response: Boolean,

    authorize: () => Ok(),

    setup: ctx => (ctx.di = Object.assign({}, dependency, injection)),

    'Check if the User exist': step(async ctx => {
      const repo = new ctx.di.UserRepository(injection)
      const [user] = await repo.findByID(ctx.req.id)
      ctx.user = user

      if (user) return Ok()
      return Err.notFound({
          message: `User ID ${ctx.req.id} does not exist`,
          payload: { entity: 'User' }
      })
    }),

    'Delete the User': step(async ctx => {
      const repo = new ctx.di.UserRepository(injection)
      ctx.ret = await repo.delete(ctx.user)
      return Ok(ctx.ret)
    })
  })

module.exports =
  herbarium.usecases
    .add(deleteUser, 'DeleteUser')
    .metadata({ group: 'User', operation: herbarium.crud.delete, entity: User })
    .usecase