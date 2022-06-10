// ------------
// postgres
// ------------

// pg -- postgres client (like psycopg2)
// sequelize -- postgres ORM (like SQLAlchemy)


// ------------
// docker
// ------------

// persisting data
  // windows and OSX can't mount local volumes
  // use named volume

`
docker volume create pgdata
`

// docker-compose
`
services:
  pg:
    container_name: pg
    build:
      context: ./postgres
      dockerfile: Dockerfile
    ports: 
      - "5432:5432"
    environment:
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: 'postgres'
      POSTGRES_DB: 'db_name'
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: always

volumes:
  pgdata:
    external: true
`


// ------------
// sequelize (async/await)
// ------------

// api reference
  // https://sequelize.org/master/manual/getting-started

const Sequelize = require('sequelize');
// connection v1
const sequelize = new Sequelize('database', 'username', 'password', { dialect: 'postgres' });
// connection v2 (ocnnection string)
let user = 'user';
let password = 'password';
let host = 'mysql';
let port = '3306';
let db = 'db1';
const connectionUrl = `postgres://${user}:${password}@${host}:${port}/${db}`;
const sequelize = new Sequelize(connectionUrl);
// connection v3
const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  { 
    dialect: 'postgres',
    host: 'localhost', // localhost
    host: 'postgres', // docker-compose service
    pool: {
      max: 10,
      min: 0,
      idle: 10000
    }
  }
)
// define model / table
const Jonin = sequelize.define('jonin', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER
});

// CRUD
  // async/await examples -- http://zetcode.com/javascript/sequelize/
  // async/await (transactions) -- https://stackoverflow.com/questions/42870374/node-js-7-how-to-use-sequelize-transaction-with-async-await
  // transaction
    // https://www.postgresql.org/docs/current/tutorial-transactions.html
    // can you roll back?
      // https://stackoverflow.com/questions/4692690/is-it-possible-to-roll-back-create-table-and-alter-table-statements-in-major-sql/4736346


// create
  // create() or build() & save()
const createJonin = async (joninObject) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    let jonin = await Jonin.create(joninObject, { transaction });
    await transaction.commit();
    console.log(jonin.name);
    return jonin;
  } catch (err) {
    console.log(err.message);
    if (transaction) await transaction.rollback();
  } finally {
    sequelize.close();
  }
}
// find all
  // 'raw' turns off metadata
const getAllJonin = async () => {
  try {
    let jonin = await Jonin.findAll({ raw: true });
    console.log(jonin);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// find all (specify columns)
const getSelectedColumns = async (listOfColumns) => {
  try {
    let jonin = await Jonin.findAll({ attributes: listofColumns, raw: true });
    console.log(jonin);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// find all (order by)
  // example -- Jonin.findAll({ order: [['name', 'ASC'], ['age', 'DESC']] })
const getOrderedRows = async (listOfOrderCriteria) => {
  try {
    let jonin = await Jonin.findAll({ order: listOfOrderCriteria, raw: true });
    console.log(jonin);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// find all (limit)
const getLimitedRows = async (n) => {
  try {
    let jonin = await Jonin.findAll({ limit: n, raw: true });
    console.log(jonin);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// find all (in operator)
  // example -- where: { name: { [OP.in]: ['Kakashi', 'Hiruzen', 'Konohamaru', 'Iruka'] }}
const getRowsIn = async (field, memberList) => {
  try {
    let jonin = await Jonin.findAll({
      where: { [field]: { [Op.in]: memberList } },
      raw: true
    });
    console.log(jonin);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// find all (between operator)
  // example -- where: { age: { [OP.between]: [18, 80] }}
const getRowsBetween = async (field, min, max) => {
  try {
    let jonin = await Jonin.findAll({
      where: { [field]: { [Op.between]: [min, max] } },
      raw: true
    });
    console.log(jonin);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// find by id
const getOneJoninById = async (joninId) => {
  try {
    let jonin = await Jonin.findById(joninId);
    console.log(jonin.name);
    return jonin;
  } catch (err) {
    console.log(err.message);
  } finally {
    sequelize.close();
  }
}
// count records
const countJonin = async () => {
  try {
    let n = await Jonin.count();
    console.log(`Jonin has ${n} records.`);
    return n;
  } catch (err) {
    console.log(err.message)
  } finally {
    sequelize.close();
  }
}
// update
  // https://sequelize.org/master/manual/instances.html#creating-persistent-instances
  // update does not return updated record, must use work around
const updateJonin = async (updatedFieldsObject, joninId) => {
  let transaction;
  try {
    transaction = await sequelize.transaction();
    await Jonin.update(updatedFieldsObject, { where: { id: joninId }, transaction });
    await transaction.commit();
    let updatedJonin = await Jonin.findById(joninId);
    console.log(`Name of updated Jonin: ${updatedJonin.name}`);
    return updatedJonin;
  } catch (err) {
    console.log(err.message);
    if (transaction) await transaction.rollback();
  } finally {
    sequelize.close();
  }
}
// delete
  // destroy does not return record, must use work around
  // paranoid option -- if true:
  // delete will only add 'deletedAt' timestamp.
  // to force delete -- Item.destroy({ force: true });
const deleteJonin = async (joninId) => {
  let transaction;
  try {
    let deletedJonin = await Jonin.findById(joninId);
    transaction = await sequelize.transaction();
    await Jonin.destroy({ where: { id: joninId } });
    await transaction.commit();
    console.log(`Jonin ${deletedJonin.name} was deleted`);
    return deletedJonin;
  } catch (err) {
    console.log(err.message);
    if (transaction) await transaction.rollback();
  } finally {
    sequelize.close();
  }
}



// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




// ------------
//
// ------------




