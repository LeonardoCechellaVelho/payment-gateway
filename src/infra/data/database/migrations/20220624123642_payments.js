
exports.up = async function (knex) {
    knex.schema.hasTable('payments')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('payments', function (table) {
                    table.uuid('id').primary()
                    table.float('value')
                    table.string('method')
                    table.timestamps(true, true)
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('payments')
}
