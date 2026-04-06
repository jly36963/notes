// -----------
// postgres (sequelize) (example)
// -----------

// -----------
// connection
// -----------

// imports
const Sequelize = require('sequelize');

pgConn = () => {
  // connection params
  const db = process.env.PG_DATABASE;
  const db_user = process.env.PG_USER;
  const db_pw = process.env.PG_PASSWORD;
  const port = process.env.PG_PORT;
  const host = (process.env.IN_DOCKER === 'yes') ? 'pg' : 'localhost';

  // connection
  const sequelize = new Sequelize({
    database: db,
    username: db_user,
    password: db_pw,
    host: host,
    port: port,
    dialect: 'postgres',
    options: {
      host: host,
      port: port,
      pool: {
        max: 10,
        min: 0,
        idle: 10000
      }
    }
  })

  // connction
  // const connectionUrl = `postgres://${db_user}:${db_pw}@${host}:${port}/${db}`;
  // const sequelize = new Sequelize(connectionUrl);

  // return connection (must be closed after use)
  return sequelize;
}

module.exports = {
  pgConn
};

// -----------
// models
// -----------

// imports
const Sequelize = require('sequelize');
const Model = Sequelize.Model;
// connection
const { pgConn } = require('../utils/pgConn');
// connection
const sequelize = pgConn();

// model 
  // https://sequelize.org/master/manual/getting-started.html
  // https://sequelize.org/master/manual/model-basics.html
  // https://sequelize.org/master/manual/data-types.html
class Transaction extends Model { }
Transaction.init({
  // no 'primaryKey' specified, sequelize generates 'id'
  // sequelize automaticaly creates 'createdAt' and 'updatedAt' columns
  uid: Sequelize.STRING,
  ip: Sequelize.CIDR,
  amount: Sequelize.FLOAT,
  time: Sequelize.DATE
})

// sync (create table if DNE)
sequelize.sync()

module.exports = { Transaction };


// -----------
// CRUD functions
// -----------

// TODO