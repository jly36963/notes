import mongodb, { Db } from "mongodb";
import { getConnection } from "../connections/mongo";
import {
  Ninja,
  NinjaConditions,
  NinjaNew,
  NinjaUpdates,
  Jutsu,
  JutsuConditions,
  JutsuNew,
  JutsuUpdates,
} from "../types";

// ---
// collections
// ---

const collections = {
  NINJAS: "ninjas",
  JUTSUS: "jutsus",
};

// ---
// ninjas
// ---

const getNinja = async (_id: mongodb.ObjectID): Promise<Ninja> => {
  const db = await getConnection();
  const ninja = await db.collection(collections.NINJAS).findOne({ _id });
  return ninja;
};

const getNinjas = async (conditions: NinjaConditions): Promise<Ninja[]> => {
  const db = await getConnection();
  const ninjas = await db.collection(collections.NINJAS).find(conditions).toArray();
  return ninjas;
};

const insertNinja = async (ninja: NinjaNew): Promise<Ninja> => {
  const db = await getConnection();
  const result = await db.collection(collections.NINJAS).insertOne({
    ...ninja,
    createdAt: new Date(),
  });
  const insertedNinja: Ninja = await db
    .collection(collections.NINJAS)
    .findOne({ _id: result.insertedId });
  return insertedNinja;
};

const updateNinja = async (_id: mongodb.ObjectID, updates: NinjaUpdates): Promise<Ninja> => {
  const db = await getConnection();
  const now = new Date();
  const updatedNinja = (await db.collection(collections.NINJAS).findOneAndUpdate(
    { _id }, // filter
    { $set: { ...updates, updatedAt: now } }, // updates
    { returnOriginal: false }, // options
  )) as Ninja;
  return updatedNinja;
};

const deleteNinja = async (_id: mongodb.ObjectID): Promise<Ninja> => {
  const db = await getConnection();
  const deletedNinja = (await db.collection(collections.NINJAS).findOneAndDelete({ _id })) as Ninja;
  return deletedNinja;
};

// ---
// jutsus
// ---

const getJutsu = async (_id: mongodb.ObjectID): Promise<Jutsu> => {
  const db = await getConnection();
  const jutsu = await db.collection(collections.JUTSUS).findOne({ _id });
  return jutsu;
};

const getJutsus = async (conditions: JutsuConditions): Promise<Jutsu[]> => {
  const db = await getConnection();
  const jutsus = await db.collection(collections.JUTSUS).find(conditions).toArray();
  return jutsus;
};

const insertJutsu = async (jutsu: JutsuNew): Promise<Jutsu> => {
  const db = await getConnection();
  const result = await db.collection(collections.JUTSUS).insertOne({
    ...jutsu,
    createdAt: new Date(),
  });
  const insertedJutsu: Jutsu = await db
    .collection(collections.JUTSUS)
    .findOne({ _id: result.insertedId });
  return insertedJutsu;
};

const updateJutsu = async (_id: mongodb.ObjectID, updates: JutsuUpdates): Promise<Jutsu> => {
  const db = await getConnection();
  const now = new Date();
  const response = (await db.collection(collections.JUTSUS).findOneAndUpdate(
    { _id }, // filter
    { $set: { ...updates, updatedAt: now } }, // updates
    { returnOriginal: false }, // options
  )) as Jutsu;
  return response;
};

const deleteJutsu = async (_id: mongodb.ObjectID): Promise<Jutsu> => {
  const db = await getConnection();
  const deletedJutsu = (await db.collection(collections.JUTSUS).findOneAndDelete({ _id })) as Jutsu;
  return deletedJutsu;
};

// ---
// ninjas_jutsus
// ---

const getNinjaWithRelatedJutsus = async (_id: mongodb.ObjectID): Promise<Ninja> => {
  const db = await getConnection();
  const [ninjaWithRelatedJutsus] = await db
    .collection(collections.NINJAS)
    .aggregate([
      { $match: { _id } }, // condition
      {
        $lookup: {
          from: "jutsus",
          localField: "jutsuIds",
          foreignField: "_id",
          as: "jutsus",
        },
      },
    ])
    .toArray();
  return ninjaWithRelatedJutsus;
};

const getJutsuWithRelatedNinjas = async (_id: mongodb.ObjectID): Promise<Jutsu> => {
  const db = await getConnection();
  const [jutsuWithRelatedNinjas] = await db
    .collection(collections.NINJAS)
    .aggregate([
      { $match: { _id } }, // condition
      {
        $lookup: {
          from: "ninjas",
          localField: "ninjaIds",
          foreignField: "_id",
          as: "ninjas",
        },
      },
    ])
    .toArray();
  return jutsuWithRelatedNinjas;
};

const addKnownJutsu = async (
  ninjaId: mongodb.ObjectID,
  jutsuId: mongodb.ObjectID,
): Promise<void> => {
  const db = await getConnection();
  const now = new Date();
  await db.collection(collections.NINJAS).findOneAndUpdate(
    { _id: ninjaId }, // filter
    { $push: { jutsuIds: jutsuId }, $set: { updatedAt: now } }, // updates
  );
  await db.collection(collections.JUTSUS).findOneAndUpdate(
    { _id: jutsuId }, // filter
    { $push: { ninjaIds: ninjaId }, $set: { updatedAt: now } }, // updates
  );
};

const removeKnownJutsu = async (
  ninjaId: mongodb.ObjectID,
  jutsuId: mongodb.ObjectID,
): Promise<void> => {
  const db = await getConnection();
  const now = new Date();
  await db
    .collection(collections.NINJAS)
    .findOneAndUpdate({ _id: ninjaId }, { $pull: { jutsuIds: jutsuId }, $set: { updatedAt: now } });
  await db
    .collection(collections.JUTSUS)
    .findOneAndUpdate({ _id: jutsuId }, { $pull: { ninjaIds: ninjaId }, $set: { updatedAt: now } });
};

// ---
// export
// ---

const mongoDAL = {
  // ninjas
  getNinja,
  getNinjas,
  insertNinja,
  updateNinja,
  deleteNinja,
  // jutsus
  getJutsu,
  getJutsus,
  insertJutsu,
  updateJutsu,
  deleteJutsu,
  // ninjas_jutsus
  addKnownJutsu,
  removeKnownJutsu,
  getNinjaWithRelatedJutsus,
  getJutsuWithRelatedNinjas,
};

export default mongoDAL;
