// ------------
// MONGOOSE (manually set properties)
// ------------

// imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// connect
mongoose.connect('mongodb://mongo:27017/', { useNewUrlParser: true });

// schema
  // types -- https://mongoosejs.com/docs/schematypes.html
  // types -- String, Number, Date, Buffer, Boolean, Mixed, ObjectId, Array, Decimal128, Map
  // ObjectId will look like `ObjectId('57bf38394b39d2a557e98')`

const UserSchema = new Schema({
  name: String,
  email: String,
  living: Boolean,
  age: { type: Number, min: 18, max: 100 },
  lastUpdated: { type: Date, default: Date.now },
  hobbies: [],
  _customId = Schema.Types.ObjectId,
  mixed: Schema.Types.Mixed,
});
// model / class
const User = mongoose.model('user', UserSchema);
// instantiate model
let user1 = new User;
// update values
user1.name = "Kakashi";
user1.email = "kakashi@gmail.com";
user1.living = true;
user1.age = 46;
user1.lastUpdated = new Date;
user1.hobbies = ['reading', 'training', 'teaching'];
user1._customId = new mongoose.Types.ObjectId;
user1.mixed = { anything: { i: ['want', 'it', 'to', 'be'] } };

// ------------
// mongoose model (instantiate model with values)
// ------------

// imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// connect
mongoose.connect('mongodb://mongo:27017/', { useNewUrlParser: true });
// schema
  // options -- required, default, select, validate, get, set, alias
const JoninSchema = new Schema({
  name: {
    type: String,
    required: true,
    set: s => s.trim(),
    validate: {
      validator: s => s !== '', // must return true
      message: props => `${props.value} is not a valid name`
    }
  },
  age: {
    type: Number,
    set: n => Math.round(n),
    required: true
  }
})
// model / class
  // if model is in its own class: 
  // module.exports = Jonin;
  // const Jonin = require('../models/Jonin');
const Jonin = mongoose.model('jonin', JoninSchema);

// ------------
// CRUD
// ------------

// uses model from above

let joninId; // to be used in queries

// create
const newJonin = new Jonin({
  name: "Kakashi Hatake",
  age: 46
});
newJonin.save(); // asynchronous -- use async/await or promises
// read
Jonin.find({}); // return all documents
Jonin.find({ _id: joninId }); // return all documents matching condition
Jonin.findOne({ _id: joninId }); // returns first match or null
Jonin.findById(joninId); // return document matching id or null
Jonin.countDocuments({}); // count documents (filter)
Jonin.distinct('age'); // array of distinct values (for field)
Jonin.exists({ name: 'Kakashi' }); // returns true if at least one document matches
// update
  // also updateOne, updateMany (they don't return documents)
Jonin.findByIdAndUpdate(joninId, { age: 47 }, { new: true }); // args: id, update values, options
Jonin.findOneAndUpdate({ _id: joninId }, { age: 47 }, { new: true }); // args: condition, update values, options
// delete 
  // also Model.remove({}) // removes all that match condition
  // also `...Remove`
  // also deleteOne, deleteMany (they don't return documents)
Jonin.findByIdAndDelete(joninId)
Jonin.findOneAndDelete({ _id: joninId })

// ------------
// promise
// ------------

// uses model from above

Jonin.findById(joninId)
  .then((jonin) => {
    if (!jonin) {
      console.log('No match found.');
    } else {
      console.log(`Jonin: ${jonin.name}`);
    }
  })
  .catch((e) => console.log(`Error: ${e}`)); // handle promise

// ------------
// populate
// ------------

// https://mongoosejs.com/docs/populate.html

// imports
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// schemas
const personSchema = Schema({
  _id: Schema.Types.ObjectId,
  name: String,
  age: Number,
  stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});
const storySchema = Schema({
  author: { type: Schema.Types.ObjectId, ref: 'Person' },
  title: String,
  fans: [{ type: Schema.Types.ObjectId, ref: 'Person' }]
});
// models
const Story = mongoose.model('Story', storySchema);
const Person = mongoose.model('Person', personSchema);
// documents
const author = new Person({
  _id: new mongoose.Types.ObjectId(),
  name: 'Ian Fleming',
  age: 50
});
author.save(function (err) {
  if (err) return handleError(err);

  const story1 = new Story({
    title: 'Casino Royale',
    author: author._id    // assign the _id from the person
  });

  story1.save(function (err) {
    if (err) return handleError(err);
    // thats it!
  });
});
// document (story will be populated with author)
Story.
  findOne({ title: 'Casino Royale' }).
  populate('author').
  exec(function (err, story) {
    if (err) return handleError(err);
    console.log(`The author is ${story.author.name}`);
    // prints "The author is Ian Fleming"
  });
// manually set populated field
Story.findOne({ title: 'Casino Royale' }, function (error, story) {
  if (error) {
    return handleError(error);
  }
  story.author = author;
  console.log(story.author.name); // prints "Ian Fleming"
});

// ------------
// MONGOOSE (async/await) (CRUD)
// ------------

// create
const createJonin = async (firstName, lastName, age) => {
  try {
    // check if exists
    let jonin = await Jonin.findOne({ firstName, lastname });
    if (jonin) {
      console.log(`Error: Jonin ${firstName} ${lastName} already exists.`)
    }
    // create new jonin
    jonin = new Jonin({
      firstName,
      lastName,
      age
    });
    // save
    await jonin.save();
    console.log(`Jonin ${jonin.firstName} created.`);
  } catch (err) {
    console.error(err.message);
  }
}
// read
const readJonin = async (joninId) => {
  try {
    let jonin = await Jonin.findOne({ _id: joninId });
    if (!jonin) {
      console.log(`No Jonin with id: ${joninId}.`);
    } else {
      console.log(`Jonin's name: ${jonin.firstName}.`);
    }
  } catch (err) {
    console.error(err.message);
  }
}
// update
const updateJonin = async (joninId, updateValuesDict) => {
  try {
    let jonin = await Jonin.findByIdAndUpdate(
      joninId,
      updateValuesDict, // ie -- { name: "Kakashi" }
      { new: true, upsert: true }
    );
    console.log("Updated Jonin", jonin);
  } catch (err) {
    console.error(err.message);
  }
}
// delete
const deleteJonin = async (joninId) => {
  try {
    let jonin = await Jonin.findByIdAndDelete(joninId);
    if (jonin) {
      console.log(`Jonin ${jonin.firstName} deleted.`);
    } else {
      console.log(`No match found, no Jonin deleted.`);
    }
  } catch (err) {
    console.error(err.message);
  }
}

// ------------
// 
// ------------