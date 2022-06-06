
// ------------
// sequelize
// ------------

// mysql2 -- mysql client (works with sequelize) (mostly compatible with mysql)
  // https://www.npmjs.com/package/mysql2
// sequelize -- mysql ORM (like SQLAlchemy)
  // https://sequelize.org/master/manual/getting-started
  // https://sequelize.readthedocs.io/en/1.7.0/docs/usage/

// install
'npm install --save mysql2 sequelize'

// ------------
// docker 
// ------------

// persisting data
// windows and OSX can't mount local volumes
// use named volume

'docker volume create mysqldata'

  // docker-compose
  `
services:
  mysql:
    container_name: mysql
    image: mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: 'example'
      MYSQL_DATABASE: 'db'
      MYSQL_USER: 'user'
      MYSQL_PASSWORD: 'password'
    ports:
      - "3306:3306"
    volumes:
      - mysqldata:/var/lib/mysql
    
volumes:
  mysqldata:
    external: true
`

// ------------
// example usage (promises)
// ------------

const Sequelize = require('sequelize');
// connection v1
const sequelize = new Sequelize('database', 'username', 'password', { dialect: 'mysql' });
// connection v2
let user = 'user';
let password = 'password';
let host = 'mysql';
let port = '3306';
let db = 'db1';
const connectionUrl = `mysql://${user}:${password}@${host}:${port}/${db}`;
const sequelize = new Sequelize(connectionUrl);

// define table / model
const Jonin = sequelize.define('jonin', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER
});
// drop table
Jonin.drop().then(() => {
  console.log('table deleted');
}).finally(() => {
  sequelize.close();
})
// create record
sequelize.sync().then(() => {
  return Jonin.create({
    name: 'Kakashi',
    age: 46
  });
}).then((kakashi) => {
  console.log(kakashi.get({
    plain: true
  }));
});
// bulk create records
let jonin = [
  { name: "Kakashi", age: 46},
  { name: "Iruka", age: 44},
  { name: "Konohamaru", age: 28}
];
sequelize.sync({ force: true }).then(() => {
  Jonin.bulkCreate(jonin, { validate: true }).then(() => {
    console.log('recors created');
  }).catch((err) => {
    console.log(err.message);
  }).finally(() => {
    sequelize.close();
  });
});
// find by id
Jonin.findById(2).then((jonin) => {
  console.log(jonin.get({ plain: true }));
  console.log(`Name: ${jonin.name}`);
}).finally(() => {
  sequelize.close();
})
// find one
Jonin.findOne({ where: { id: 2} }).then((jonin) => {
  console.log(jonin.get({ plain: true }));
  console.log(`Name: ${jonin.name}`);
}).finally(() => {
  sequelize.close();
})


// ------------
// sequelize (async/await)
// ------------

const Sequelize = require('sequelize');
// connection v1
const sequelize = new Sequelize('database', 'username', 'password', { dialect: 'mysql' });
// connection v2
let user = 'user';
let password = 'password';
let host = 'mysql';
let port = '3306';
let db = 'db1';
const connectionUrl = `mysql://${user}:${password}@${host}:${port}/${db}`;
const sequelize = new Sequelize(connectionUrl);
// define table / model
const Jonin = sequelize.define('jonin', {
  name: Sequelize.STRING,
  age: Sequelize.INTEGER
});

// CRUD
  // async/await examples -- http://zetcode.com/javascript/sequelize/
  // async/await (transactions) -- https://stackoverflow.com/questions/42870374/node-js-7-how-to-use-sequelize-transaction-with-async-await
  // transaction
    // https://dev.mysql.com/doc/refman/8.0/en/commit.html
    // can't be rolled back -- create/drop databases, create/drop/alter tables

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
      where: { [field]: { [Op.in]: memberList }},
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
  // example -- where: { age: { [OP.in]: [18, 80] }}
const getRowsBetween = async (field, min, max) => {
  try {
    let jonin = await Jonin.findAll({ 
      where: { [field]: { [Op.between]: [min, max] }},
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


