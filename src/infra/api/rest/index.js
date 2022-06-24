const express = require('express')
const cors = require('cors')
const { json } = require('body-parser')
const { generateRoutes } = require('@herbsjs/herbs2rest')
const { herbarium } = require('@herbsjs/herbarium')
const jwt = require('jsonwebtoken')

function uc2Controllers(injection) {

    function findEntitiesAndGroups() {
        const items = Array.from(herbarium.usecases.all.values()).map(e => ({ id: e.entity, group: e.group }))
        const distinctItems = items.filter(({ entity, group }, index, self) =>
            self.findIndex(e => e.entity === entity && e.group === group) === index
        )
        return distinctItems
    }

    function findUsecases(entity) {
        const usecases = herbarium.usecases
        const getAll = usecases.findBy({ entity: entity, operation: herbarium.crud.readAll })[0]?.usecase
        const getById = usecases.findBy({ entity: entity, operation: herbarium.crud.read })[0]?.usecase
        const post = usecases.findBy({ entity: entity, operation: herbarium.crud.create })[0]?.usecase
        const put = usecases.findBy({ entity: entity, operation: herbarium.crud.update })[0]?.usecase
        const del = usecases.findBy({ entity: entity, operation: herbarium.crud.delete })[0]?.usecase
        return { getAll, getById, post, put, del }
    }

    const entities = findEntitiesAndGroups()

    const controllers = entities.map(entity => {
        const usecases = findUsecases(entity.id)
        const controllers = { name: entity.group }
        if (usecases.getAll) controllers.getAll = { usecase: usecases.getAll }
        if (usecases.getById) controllers.getById = { usecase: usecases.getById, id: 'id' }
        if (usecases.post) controllers.post = { usecase: usecases.post }
        if (usecases.put) controllers.put = { usecase: usecases.put }
        if (usecases.del) controllers.delete = { usecase: usecases.del }

        return controllers
    })

    return controllers
}

function authenticateToken(req) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return req.user = "Unauthorized";
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
        if(error) return req.user = "Forbidden";
        return req.user = "Authorized";
    })
}

function server(controllers, app, config) {
    app.use((req, res, next) => {
        authenticateToken(req);
        next();
    })
    app.use(json({ limit: '50mb' }))
    app.use(cors())

    const routes = new express.Router()
    const showEndpoints = !config.isProd
    generateRoutes(controllers, routes, showEndpoints)
    app.use(routes)
}

async function rest(app, config) {

    const controllers = uc2Controllers(app, config)

    server(controllers, app, config)
}

module.exports = { rest }