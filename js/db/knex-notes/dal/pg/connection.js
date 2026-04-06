import Knex from 'knex';
import KnexStringcase from 'knex-stringcase';

const knex = Knex(
  KnexStringcase({
    client: 'pg',
    connection: 'postgresql://postgres:postgres@localhost:5432/practice',
    pool: { min: 2, max: 10 },
  }),
);

export default knex;
