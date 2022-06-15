// imports
import mongoose from "mongoose";
// connection string parts
const host = process.env.MONGO_HOST;
const port = process.env.MONGO_PORT;
const user = process.env.MONGO_USER;
const pw = process.env.MONGO_PW;
const dbName = process.env.MONGO_DB;
// connection string
const url = `mongodb://${user}:${pw}@${host}:${port}/`;
// get connection (mongoose)
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, dbName });
// export
export default mongoose;
