import dotenv from 'dotenv';
dotenv.config();

export default {
  development: {
    client: 'pg',
    connection: process.env.PG_URI,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './dal/pg/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.PG_URI,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './dal/pg/migrations',
    },
  },
};
