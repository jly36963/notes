import mongodb from "mongodb";

// ---
// ninja
// ---

export interface Ninja {
  _id: mongodb.ObjectId;
  firstName: string;
  lastName: string;
  jutsus?: Jutsu[];
}

export interface NinjaConditions {
  _id?: mongodb.ObjectId;
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
  _id: mongodb.ObjectId;
  updates: NinjaUpdates;
}

export interface NinjaDeleteArgs {
  _id: mongodb.ObjectId;
}

// ---
// jutsu
// ---

export interface Jutsu {
  _id: mongodb.ObjectId;
  name: string;
  chakraNature: string;
  description: string;
  ninjas?: Ninja[];
}

export interface JutsuConditions {
  _id?: mongodb.ObjectId;
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
  _id: mongodb.ObjectId;
  updates: JutsuUpdates;
}

// jutsu (args)

export interface JutsuInsertArgs {
  jutsu: JutsuNew;
}

export interface JutsuUpdateArgs {
  _id: mongodb.ObjectId;
  updates: JutsuUpdates;
}

export interface JutsuDeleteArgs {
  _id: mongodb.ObjectId;
}
