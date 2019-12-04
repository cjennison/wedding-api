let connection = {
  host : '127.0.0.1',
  user : 'postgres',
  database : 'wedding_db'
}

if (process.env.NODE_ENV === 'production') {
  connection = process.env.DATABASE_URL
}

const knex = require('knex')({
  client: 'postgresql',
  connection,
})

module.exports = knex
