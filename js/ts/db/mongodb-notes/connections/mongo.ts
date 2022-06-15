// imports
import mongodb, { MongoClient } from "mongodb";
// connection string
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const user = process.env.MONGO_USER;
const pw = process.env.MONGO_PW;
const dbName = process.env.MONGO_DB;
// url
const url = `mongodb://${user}:${pw}@${host}:${port}/`;
// db
let client: mongodb.MongoClient;
let db: mongodb.Db;
// get connection
export const getConnection = async () => {
  if (!db) {
    client = await MongoClient.connect(url);
    db = client.db(dbName);
  }
  return db;
};
