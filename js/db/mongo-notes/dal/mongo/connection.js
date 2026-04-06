import { MongoClient } from 'mongodb'

const URL = process.env.MONGO_URL || 'mongodb://root:example@localhost:27017?maxPoolSize=10'
const DB = process.env.MONGO_DB || 'practice'

let client = new MongoClient(URL)
let connection = null

const getConnection = async () => {
  if (!connection) {
    connection = (await client.connect()).db(DB)
  }
  return connection
}

const close = () => {
  if (client) {
    client.close()
  }
  connection = null
  client = null
}

export {
  getConnection,
  close,
}
