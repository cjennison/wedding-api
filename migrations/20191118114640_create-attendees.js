
exports.up = function(knex) {
  return knex.schema.createTable('attendees', (table) => {
    table.increments('id')
    table.string('first_name')
    table.string('last_name')
    table.boolean('confirmed').defaultTo(false)
    table.integer('rsvp_id')
    table.boolean('vegetarian').defaultTo(false)
    table.boolean('vegan').defaultTo(false)
    table.boolean('gluten_free').defaultTo(false)
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable('attendees')
};
