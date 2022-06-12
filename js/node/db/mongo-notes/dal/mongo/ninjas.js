import { randomUUID } from "crypto";
import { first, pick, pickBy } from "lodash-es";
import { getConnection } from "./connection.js";
import collections from "./collections.js";

/** Get a ninja from the database */
const get = async (_id) => {
  const db = await getConnection();
  return db.collection(collections.NINJAS).findOne({ _id });
};

/** Insert a ninja into the database */
const insert = async ({ firstName, lastName, age }) => {
  const db = await getConnection();
  const { insertedId } = await db.collection(collections.NINJAS).insertOne({
    _id: randomUUID(),
    firstName,
    lastName,
    age,
    createdAt: new Date(),
  });
  return get(insertedId);
};

/** Update an existing ninja in the database */
const update = async (_id, updates) => {
  updates = pickBy(
    updates,
    (v, k) => ["firstName", "lastName", "age"].includes(k) && v !== undefined,
  );
  const db = await getConnection();
  const result = await db.collection(collections.NINJAS).findOneAndUpdate(
    { _id },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }, // https://stackoverflow.com/a/43474183
  );
  return result?.value;
};

/** Delete a ninja in the database */
const del = async (_id) => {
  const db = await getConnection();
  const result = await db.collection(collections.NINJAS).findOneAndDelete({
    _id,
  });
  return result?.value;
};

/** Associate a ninja and jutsu */
const associateJutsu = async (ninjaId, jutsuId) => {
  const db = await getConnection();
  await db.collection(collections.NINJAS_JUTSUS).insertOne({
    _id: randomUUID(),
    ninjaId,
    jutsuId,
    createdAt: new Date(),
  });
};

/** Dissociate a ninja and jutsu */
const disassociateJutsu = async (ninjaId, jutsuId) => {
  const db = await getConnection();
  db.collection(collections.NINJAS_JUTSUS).findOneAndDelete({
    ninjaId,
    jutsuId,
  });
};

/** Get a ninja with its associated jutsus */
const getNinjaWithJutsus = async (ninjaId) => {
  const db = await getConnection();
  const ninja = await db.collection(collections.NINJAS).aggregate([
    { $match: { "_id": ninjaId } },
    {
      $lookup: {
        from: collections.NINJAS_JUTSUS,
        localField: "_id",
        foreignField: "ninjaId",
        as: "ninjasJutsus",
      },
    },
    {
      $lookup: {
        from: collections.JUTSUS,
        localField: "ninjasJutsus.jutsuId",
        foreignField: "_id",
        as: "jutsus",
      },
    },
    { $project: { ninjasJutsus: 0 } },
  ]).toArray();
  return first(ninja);
};

export default {
  get,
  insert,
  update,
  del,
  associateJutsu,
  disassociateJutsu,
  getNinjaWithJutsus,
};
