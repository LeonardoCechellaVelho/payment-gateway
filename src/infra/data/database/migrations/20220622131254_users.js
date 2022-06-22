
exports.up = async function (knex) {
    knex.schema.hasTable('users')
        .then(function (exists) {
            if (exists) return
            return knex.schema
                .createTable('users', function (table) {
                    table.uuid('id').primary()
                    table.string('name')
                    table.string('email')
                    table.string('document')
                    table.timestamps()
                })
        })
}

exports.down = function (knex) {
    return knex.schema
    .dropTableIfExists('users')
}
