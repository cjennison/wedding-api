
exports.up = function(knex) {
  return knex.schema.createTable('rsvps', (table) => {
    table.increments('id')
    table.string('email')
    table.string('phone')
    table.integer('party_size')
    table.boolean('attending').defaultTo(true)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('rsvps')
};
