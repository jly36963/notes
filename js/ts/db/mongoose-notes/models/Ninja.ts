import { Schema } from "mongoose";
import mongoose from "../connections/mongo";
import { NinjaMongoose } from "../types";

const NinjaSchema = new Schema(
  {
    // _id: Schema.Types.ObjectId, // automatic
    // createdAt: Date, // automatic (timestamps)
    // updatedAt: Date, // automatic (timestamps)
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    jutsuIds: [Schema.Types.ObjectId],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

// virtual (more complicated relations)
NinjaSchema.virtual("jutsus", {
  ref: "Jutsu",
  localField: "jutsuIds",
  foreignField: "_id",
});

const Ninja = mongoose.model<NinjaMongoose>("Ninja", NinjaSchema);

export default Ninja;

// ---
// relations
// ---

// I separated jutsuIds/jutsus, which requires virtuals for populate to work.
// below shows how it would look without the separation/virtuals

// jutsus field:
// jutsus: [{ type: Schema.Types.ObjectId, ref: "Jutsu" }]

// populate usage:
// await NinjaModel.findOne({ _id }).populate("jutsus")

// schema
// remove `toJSON: { virtuals: true }`
