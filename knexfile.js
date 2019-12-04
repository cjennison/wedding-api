// Update with your config settings.
let connection = {
  host : '127.0.0.1',
  user : 'postgres',
  database : 'wedding_db'
}

if (process.env.NODE_ENV === 'production') {
  connection = process.env.DATABASE_URL
}

module.exports = {

  development: {
    client: 'postgresql',
    connection,
  },

  staging: {
    client: 'postgresql',
    connection,
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection,
    migrations: {
      tableName: 'knex_migrations'
    }
  }
};
