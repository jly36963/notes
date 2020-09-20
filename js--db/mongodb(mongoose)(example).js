// -------------
// mongoose
// -------------


// -------------
// connection
// -------------


// imports
const mongoose = require('mongoose');

// connection
// https://mongoosejs.com/docs/connections.html

const mongoConn = async () => {
  // connection params
  const db = process.env.MONGO_DATABASE;
  const db_user = process.env.MONGO_USERNAME;
  const db_pw = process.env.MONGO_PASSWORD;
  const port = process.env.MONGO_PORT;
  const host = (process.env.IN_DOCKER === 'yes') ? 'mongo' : 'localhost';
  // attempt connection
  try {
    // const connectionString = `mongodb://${db_user}:${db_pw}@${host}:${port}/${db}`
    const connectionString = `mongodb://${db_user}:${db_pw}@${host}:${port}/`
    //// console.log(connectionString);
    await mongoose.connect(
      connectionString,
      {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      }
    );
    console.log('Mongoose connected!')
  } catch (err) {
    console.error(err.message);
  }
}

module.exports = {
  mongoConn
};

// -------------
// models
// -------------

// user model
  // subdocuments
    // https://mongoosejs.com/docs/subdocs.html
  // timestamps
    // https://stackoverflow.com/questions/12669615/add-created-at-and-updated-at-fields-to-mongoose-schemas

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    // '_id' generated automatically
    // 'createdAt', 'updatedAt' generated automatically (timestamps)
    email: {
      type: String,
      required: true,
      unique: true
    },
    uid: {
      type: String,
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    programs: [
      {
        id: { type: String, required: true },
        dateAdded: { type: Date, required: true }
      }
    ],
    shoppingCart: [
      {
        id: { type: String, required: true },
        dateAdded: { type: Date, required: true }
      }
    ],
  },
  { timestamps: true }
);

module.exports = User = mongoose.model('user', UserSchema);


// program model
  // subdocuments
    // https://mongoosejs.com/docs/subdocs.html
  // timestamps
    // https://stackoverflow.com/questions/12669615/add-created-at-and-updated-at-fields-to-mongoose-schemas
  // enum 
    // https://intellipaat.com/community/34313/how-to-create-and-use-enum-in-mongoose

const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');
// centralized options
const storeFormOptions = require('../../data/storeFormOptions');

const ProgramSchema = new mongoose.Schema(
  {
    // '_id' generated automatically
    // 'createdAt', 'updatedAt' generated automatically (timestamps)
    id: {
      // id used externally
      type: String,
      required: true,
      unique: true,
      default: uuidv4
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },

    gender: {
      type: String,
      enum: storeFormOptions.gender,
      required: true
    },
    skillLevel: {
      type: String,
      enum: storeFormOptions.skillLevel,
      required: true
    },
    goal: [
      {
        type: String,
        enum: storeFormOptions.goal,
      }
    ],
    equipmentNeeded: {
      type: String,
      enum: storeFormOptions.equipmentNeeded,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    s3Prefix: String, // prefix used to select files in bucket (used in delete operations)
    s3ImgLink: String, // s3 link to img
    hide: {
      type: Boolean,
      required: true,
      default: false
    },
    // content
      // example -- program.content.weeks[0].days[2].sets[0].movements[1].name
    content: {
      weeks: [
        {
          days: [
            {
              notes: String,
              sets: [
                {
                  movements: [
                    {
                      name: String,
                      youtubeLink: String,
                      numberOfSets: Number,
                      numberOfReps: Number,
                      restInterval: Number
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
  },
  { timestamps: true }
);

module.exports = Program = mongoose.model('program', ProgramSchema);

// store form options (used in program schema)

const storeFormOptions = {
  gender: ["male", "female", "either"],
  skillLevel: ['beginner', 'intermediate', 'advanced'],
  goal: ['muscle size', 'strength', 'weight loss', 'shred', 'skill specific', 'home fitness'],
  equipmentNeeded: ['none', 'minimum', 'full gym']
}

module.exports = storeFormOptions;

// -------------
// CRUD functions
// -------------

// @name -- createUser 
// @collection -- user
// @desc -- add user document to collection

const createUser = async (User, { firstName, lastName, email, uid, shoppingCart }) => {
  try {
    // create new user
    user = new User({
      firstName, lastName, email, uid, shoppingCart
    });
    // upsert -- https://mongoosejs.com/docs/tutorials/findoneandupdate.html#upsert
    await User.findOneAndUpdate(
      { email }, // filter
      user, // document to insert
      { upsert: true, new: true } // options
    ).exec()
    // success -- print user's name
    console.log(`user ${user.firstName} upserted.`);
    return { data: "success", error: null }
  } catch (err) {
    console.error(err.message);
    return { data: null, error: err.message }
  }
}

// @name -- getCurrentUser
// @collection -- user
// @desc -- get user object

const getCurrentUser = async (User, uid) => {
  try {
    const user = await User.findOne({ uid });
    return { data: user, error: null }
  } catch (err) {
    console.log(err);
    return { data: null, error: err }
  }
}

// @name -- getShoppingCart
// @collection -- user
// @desc -- get shopping cart for specified user (uid)

const getShoppingCart = async (User, uid) => {
  try {
    const user = await User.findOne({ uid });
    const { shoppingCart } = user;
    return { data: shoppingCart, error: null }
  } catch (err) {
    console.log(err);
    return { data: null, error: err }
  }
}

// @name -- updateShoppingCart
// @collection -- user
// @desc -- get shopping cart for specified user (uid)

const updateShoppingCart = async (User, uid, newShoppingCart) => {
  try {
    console.log('uid', uid)
    const user = await User.findOne({ uid });
    if (!user) {
      return { data: null, error: "No user found (uid)" }
    }
    const updatedUser = await User.findOneAndUpdate(
      { uid }, // condition to match
      { shoppingCart: newShoppingCart }, // properties to update
      { new: true } // return document
    );
    // const updatedShoppingCart = updatedUser.shoppingCart;
    console.log('updatedUser', updatedUser)
    return { data: updatedUser, error: null }
  } catch (err) {
    console.log(err);
    return { data: null, error: err }
  }
}

// @name -- purchaseProgram
// @collection -- user
// @desc -- add program to user

const purchaseProgram = async (User, uid, purchasedProgram) => {
  try {
    console.log('uid', uid)
    const user = await User.findOne({ uid });
    if (!user) {
      return { data: null, error: "No user found (uid)" }
    }
    let updatedUser = await User.findOneAndUpdate(
      { uid }, // condition to match
      { $pull: { shoppingCart: { id: purchasedProgram.id } } },  // remove from cart   
      { new: true } // return document
    );
    updatedUser = await User.findOneAndUpdate(
      { uid }, // condition to match
      { $push: { programs: purchasedProgram } }, // add program
      { new: true } // return document
    );
    // const updatedShoppingCart = updatedUser.shoppingCart;
    console.log('updatedUser', updatedUser)
    return { data: updatedUser, error: null }
  } catch (err) {
    console.log(err);
    return { data: null, error: err }
  }
}

// @name -- getShoppingCart
// @collection -- user
// @desc -- get shopping cart for specified user (uid)

const getPurchasedPrograms = async (User, uid) => {
  try {
    const user = await User.findOne({ uid });
    const { programs } = user;
    return { data: programs, error: null }
  } catch (err) {
    console.log(err);
    return { data: null, error: err }
  }
}


// @name -- checkProgramNameAvailability
// @collection -- program
// @desc -- check if 'name' already exists in collection


const checkProgramNameAvailability = async (Program, name) => {
  try {
    const program = await Program.findOne({ name });
    const available = !program; // available if 'program' DNE
    return ({ data: available, error: null })
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message })
  }
}

// @name -- createProgram
// @collection -- program
// @desc -- create new program

const createProgram = async (Program, { name, description, gender, skillLevel, goal, equipmentNeeded, price }) => {
  try {
    // create new Program
    program = new Program({
      name, description, gender, skillLevel, goal, equipmentNeeded, price
    });
    // save
    await program.save();
    console.log(`Program ${program.name} created.`);
    return ({ data: program, error: null })
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message })
  }
}

// @name -- addFilesToProgram
// @collection -- program
// @desc -- update program with s3 file locations (after files have been uploaded to s3)

const addFilesToProgram = async (Program, { id, filesUploaded, s3Prefix }) => {
  try {
    let s3ImgLink;
    filesUploaded.forEach(file => {
      if (file.Bucket === 'app-pdf') s3PdfLink = file.Location
      if (file.Bucket === 'app-img') s3ImgLink = file.Location
    });
    const updatedProgram = await Program.findOneAndUpdate(
      { id }, // condition to match
      { s3Prefix, s3ImgLink }, // properties to update
      { new: true } // return document
    );
    return ({ data: updatedProgram, error: null });
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message });
  }
}

// @name -- getAllPrograms
// @collection -- program
// @desc -- return all programs

const getAllPrograms = async (Program) => {
  try {
    const programs = await Program.find(
      {}, // search criteria
      { content: 0 } // exclude content
    );
    console.log('Programs:', programs.length);
    return ({ data: programs, error: null })
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message })
  }
}

// @name -- getFilteredPrograms
// @collection -- program
// @desc -- return all programs with matching params

const getFilteredPrograms = async (Program, filters) => {
  try {
    const programs = await Program.find(
      { ...filters }, // search criteria
      { content: 0 } // exclude content

    );
    console.log('Programs:', programs.length);
    return ({ data: programs, error: null })
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message })
  }
}

// @name -- deleteProgram
// @collection -- program
// @desc -- delete program (after files have already been removed from s3)

const deleteProgram = async (Program, id) => {
  try {
    const deletedProgram = await Program.findOneAndDelete({ id });
    // no match
    if (!deletedProgram) return ({ data: null, error: 'No document found/deleted' })
    // document successfully deleted
    return ({ data: deletedProgram, error: null })
  } catch (err) {
    console.log(err.message);
    return ({ data: null, error: err.message });
  }
}

// @name -- getProgram
// @collection -- program
// @desc -- get program using 'id' (metadata only)

const getProgram = async (Program, id) => {
  try {
    const fetchedProgram = await Program.findOne(
      { id }, // search criteria
      { content: 0 } // exclude content
    );
    // no match
    if (!fetchedProgram) return ({ data: null, error: 'No document found.' })
    return ({ data: fetchedProgram, error: null })
  } catch (err) {
    console.log(err.message);
    return ({ data: null, error: err.message });
  }
}

// @name -- getProgramWithContent
// @collection -- program
// @desc -- get program using 'id', include 'content' property

const getProgramWithContent = async (Program, id) => {
  try {
    const fetchedProgram = await Program.findOne(
      { id } // search criteria
    );
    // no match
    if (!fetchedProgram) return ({ data: null, error: 'No document found.' })
    return ({ data: fetchedProgram, error: null })
  } catch (err) {
    console.log(err.message);
    return ({ data: null, error: err.message });
  }
}

// @name -- getPrograms
// @collection -- program
// @desc -- get list of programs using list of 'id' (metadata only)

const getPrograms = async (Program, listOfIDs) => {
  try {
    console.log('listOfIDs', listOfIDs);
    const fetchedPrograms = await Program.find(
      { 'id': { $in: listOfIDs } }, // search criteria
      { content: 0 } // exclude content
    );
    console.log('fetchedPrograms', fetchedPrograms)

    // no match
    // if (!fetchedPrograms.length) return ({ data: null, error: 'No documents found.' })

    return ({ data: fetchedPrograms, error: null })
  } catch (err) {
    console.log(err.message);
    return ({ data: null, error: err.message });
  }
}

// @name -- updateProgram
// @collection -- program
// @desc -- update text properties for program

const updateProgram = async (Program, id, programData) => {
  try {
    if (!Object.keys(programData).length) {
      return ({ data: null, error: "No new data provided." });
    }
    const updatedProgram = await Program.findOneAndUpdate(
      { id }, // condition to match
      programData, // properties to update
      { new: true } // return document
    );
    return ({ data: updatedProgram, error: null });
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message });
  }
}

// @name -- updateProgramFiles
// @collection -- program
// @desc -- update s3 file locations for program

const updateProgramFiles = async (Program, { id, filesUploaded, s3Prefix }) => {
  try {
    let s3ImgLink;
    filesUploaded.forEach(file => {
      if (file.Bucket === 'app-pdf') s3PdfLink = file.Location
      if (file.Bucket === 'app-img') s3ImgLink = file.Location
    });
    const linksToUpdate = {};
    if (s3ImgLink) linksToUpdate.s3ImgLink = s3ImgLink

    const updatedProgram = await Program.findOneAndUpdate(
      { id }, // condition to match
      linksToUpdate, // properties to update
      { new: true } // return document
    );
    return ({ data: updatedProgram, error: null });
  } catch (err) {
    console.error(err.message);
    return ({ data: null, error: err.message });
  }
}

module.exports = {
  // user
  createUser,
  getCurrentUser,
  getShoppingCart,
  updateShoppingCart,
  purchaseProgram,
  // program
  getPurchasedPrograms,
  checkProgramNameAvailability,
  createProgram,
  addFilesToProgram,
  getAllPrograms,
  getFilteredPrograms,
  getProgram,
  getProgramWithContent,
  getPrograms,
  updateProgram,
  updateProgramFiles,
  deleteProgram,
};