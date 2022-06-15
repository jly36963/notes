import { Schema } from "mongoose";
import mongoose from "../connections/mongo";
import { JutsuMongoose } from "../types";

const JutsuSchema: Schema = new Schema(
  {
    // _id: Schema.Types.ObjectId, // automatic
    // createdAt: Date, // automatic (timestamps)
    // updatedAt: Date, // automatic (timestamps)
    name: { type: String, required: true },
    description: { type: String, required: true },
    chakraNature: { type: String, required: true },
    ninjaIds: [Schema.Types.ObjectId],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// virtual (more complicated relations)
JutsuSchema.virtual("ninjas", {
  ref: "Ninja",
  localField: "ninjaIds",
  foreignField: "_id",
});

const Jutsu = mongoose.model<JutsuMongoose>("Jutsu", JutsuSchema);

export default Jutsu;
