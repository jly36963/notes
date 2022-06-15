import { Ninja as NinjaModel, Jutsu as JutsuModel } from "../models";
import { Schema } from "mongoose";
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
// ninjas
// ---

const getNinja = async (_id: Schema.Types.ObjectId): Promise<Ninja> => {
  const ninja = await NinjaModel.findOne({ _id });
  return ninja;
};

const getNinjas = async (conditions: NinjaConditions): Promise<Ninja[]> => {
  const ninjas: Ninja[] = await NinjaModel.find(conditions);
  return ninjas;
};

const insertNinja = async (ninja: NinjaNew): Promise<Ninja> => {
  const newNinja = new NinjaModel(ninja);
  const { _id } = await newNinja.save();
  const insertedNinja = await NinjaModel.findOne({ _id });
  return insertedNinja;
};

const updateNinja = async (_id: Schema.Types.ObjectId, updates: NinjaUpdates): Promise<Ninja> => {
  const updatedNinja = await NinjaModel.findOneAndUpdate(
    { _id }, // conditions
    updates, // updates
    { new: true, upsert: true }, // options
  );
  return updatedNinja;
};

const deleteNinja = async (_id: Schema.Types.ObjectId): Promise<Ninja> => {
  const deletedNinja = await NinjaModel.findOneAndDelete({ _id });
  return deletedNinja;
};

// ---
// jutsus
// ---

const getJutsu = async (_id: Schema.Types.ObjectId): Promise<Jutsu> => {
  const ninja = await JutsuModel.findOne({ _id });
  return ninja;
};

const getJutsus = async (conditions: JutsuConditions): Promise<Jutsu[]> => {
  const ninjas: Jutsu[] = await JutsuModel.find(conditions);
  return ninjas;
};

const insertJutsu = async (ninja: JutsuNew): Promise<Jutsu> => {
  const newJutsu = new JutsuModel(ninja);
  const { _id } = await newJutsu.save();
  const insertedJutsu = await JutsuModel.findOne({ _id });
  return insertedJutsu;
};

const updateJutsu = async (_id: Schema.Types.ObjectId, updates: JutsuUpdates): Promise<Jutsu> => {
  const updatedJutsu = await JutsuModel.findOneAndUpdate(
    { _id }, // conditions
    updates, // updates
    { new: true, upsert: true }, // options
  );
  return updatedJutsu;
};

const deleteJutsu = async (_id: Schema.Types.ObjectId): Promise<Jutsu> => {
  const deletedJutsu = await JutsuModel.findOneAndDelete({ _id });
  return deletedJutsu;
};

// ---
// ninjas_jutsus
// ---

const getNinjaWithRelatedJutsus = async (_id: Schema.Types.ObjectId): Promise<Ninja> => {
  const ninjaWithRelatedJutsus = await NinjaModel.findOne({ _id }).populate("jutsus");
  return ninjaWithRelatedJutsus;
};

const getJutsuWithRelatedNinjas = async (_id: Schema.Types.ObjectId): Promise<Jutsu> => {
  const jutsuWithRelatedNinjas = await JutsuModel.findOne({ _id }).populate("ninjas");
  return jutsuWithRelatedNinjas;
};

const addKnownJutsu = async (
  ninjaId: Schema.Types.ObjectId,
  jutsuId: Schema.Types.ObjectId,
): Promise<void> => {
  await NinjaModel.updateOne({ _id: ninjaId }, { $push: { jutsuIds: jutsuId } });
  await JutsuModel.updateOne({ _id: jutsuId }, { $push: { ninjaIds: ninjaId } });
};

const removeKnownJutsu = async (
  ninjaId: Schema.Types.ObjectId,
  jutsuId: Schema.Types.ObjectId,
): Promise<void> => {
  await NinjaModel.updateOne({ _id: ninjaId }, { $pull: { jutsuIds: jutsuId } });
  await JutsuModel.updateOne({ _id: jutsuId }, { $pull: { ninjaIds: ninjaId } });
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
