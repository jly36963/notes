import { randomUUID } from "crypto";
import { pickBy } from "lodash-es";
import { getConnection } from "./connection.js";
import collections from "./collections.js";

/** Get a jutsu from the database */
const get = async (_id) => {
  const db = await getConnection();
  return db.collection(collections.JUTSUS).findOne({ _id });
};

/** Insert a jutsu in the database */
const insert = async ({ name, chakraNature, description }) => {
  const db = await getConnection();
  const { insertedId } = await db.collection(collections.JUTSUS).insertOne({
    _id: randomUUID(),
    name,
    chakraNature,
    description,
    createdAt: new Date(),
  });
  return get(insertedId);
};

/** Update an existing jutsu in the database */
const update = async (_id, updates) => {
  updates = pickBy(
    updates,
    (v, k) =>
      ["name", "chakraNature", "description"].includes(k) && v !== undefined,
  );
  const db = await getConnection();
  const result = await db.collection(collections.JUTSUS).findOneAndUpdate(
    { _id },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" },
  );
  return result?.value;
};

/** Delete an existing jutsu in the database */
const del = async (_id) => {
  const db = await getConnection();
  const result = await db.collection(collections.JUTSUS).findOneAndDelete({
    _id,
  });
  return result?.value;
};

export default { get, insert, update, del };
