const { Repository } = require("@herbsjs/herbs2knex")
const { herbarium } = require('@herbsjs/herbarium')
const Payment = require('../../../domain/entities/payment')
const connection = require('../database/connection')

class PaymentRepository extends Repository {
    constructor(injection) {
        super({
            entity: Payment,
            table: "payments",
            knex: connection
        })
    }
}

module.exports =
    herbarium.repositories
        .add(PaymentRepository, 'PaymentRepository')
        .metadata({ entity: Payment })
        .repository