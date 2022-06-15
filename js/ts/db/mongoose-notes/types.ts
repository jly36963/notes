import { Schema, Document } from "mongoose";

// ---
// ninja
// ---

export interface Ninja {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  jutsus?: Jutsu[];
  jutsuIds: Schema.Types.ObjectId[];
}

export interface NinjaMongoose extends Document {
  _id: Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  jutsus?: Jutsu[];
  jutsuIds: Schema.Types.ObjectId[];
}

export interface NinjaConditions {
  _id?: Schema.Types.ObjectId;
  firstName?: string;
  lastName?: string;
}

export interface NinjaNew {
  firstName: string;
  lastName: string;
}

export interface NinjaUpdates {
  firstName?: string;
  lastName?: string;
}

// ninja (args)

export interface NinjaInsertArgs {
  ninja: NinjaNew;
}

export interface NinjaUpdateArgs {
  _id: Schema.Types.ObjectId;
  updates: NinjaUpdates;
}

export interface NinjaDeleteArgs {
  _id: Schema.Types.ObjectId;
}

// ---
// jutsu
// ---

export interface Jutsu {
  _id: Schema.Types.ObjectId;
  name: string;
  chakraNature: string;
  description: string;
  ninjas?: Ninja[];
  ninjaIds: Schema.Types.ObjectId[];
}

export interface JutsuMongoose extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  chakraNature: string;
  description: string;
  ninjas?: Ninja[];
  ninjaIds: Schema.Types.ObjectId[];
}

export interface JutsuConditions {
  _id?: Schema.Types.ObjectId;
  name?: string;
  chakraNature?: string;
  description?: string;
}

export interface JutsuNew {
  name: string;
  chakraNature: string;
  description: string;
}

export interface JutsuUpdates {
  name?: string;
  chakraNature?: string;
  description?: string;
}

export interface JutsuUpdateArgs {
  _id: Schema.Types.ObjectId;
  updates: JutsuUpdates;
}

// jutsu (args)

export interface JutsuInsertArgs {
  jutsu: JutsuNew;
}

export interface JutsuUpdateArgs {
  _id: Schema.Types.ObjectId;
  updates: JutsuUpdates;
}

export interface JutsuDeleteArgs {
  _id: Schema.Types.ObjectId;
}
