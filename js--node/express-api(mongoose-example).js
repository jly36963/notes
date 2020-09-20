// ------------
// express
// ------------

// ------------
// server (./server.js)
// ------------

// express
const express = require("express");
const path = require("path");
// dotenv
// https://www.npmjs.com/package/dotenv
require("dotenv").config();
// create app
const app = express();
// db
// mongodb modularized
// https://stackoverflow.com/questions/28966901/mongoose-connection-automatically-shared-in-express-js-application
const { mongoConn } = require("./utils/mongoConn");
mongoConn();
// middleware
app.use(express.json({ extended: false }));

// Routes

// user
app.use("/api/user/signup", require("./routes/api/user/signup"));
app.use(
  "/api/user/get-current-user",
  require("./routes/api/user/getCurrentUser")
);
app.use(
  "/api/user/get-shopping-cart",
  require("./routes/api/user/getShoppingCart")
);
app.use(
  "/api/user/update-shopping-cart",
  require("./routes/api/user/updateShoppingCart")
);
app.use(
  "/api/user/purchase-program",
  require("./routes/api/user/purchaseProgram")
);

// serve static files (React app build)

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// ------------
// model (user)
// ------------

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    // '_id' generated automatically
    // 'createdAt', 'updatedAt' generated automatically (timestamps)
    email: {
      type: String,
      required: true,
      unique: true,
    },
    uid: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    programs: [
      {
        id: { type: String, required: true },
        dateAdded: { type: Date, required: true },
      },
    ],
    shoppingCart: [
      {
        id: { type: String, required: true },
        dateAdded: { type: Date, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = User = mongoose.model("user", UserSchema);

// subdocuments
// https://mongoosejs.com/docs/subdocs.html

// timestamps
// https://stackoverflow.com/questions/12669615/add-created-at-and-updated-at-fields-to-mongoose-schemas

// ------------
// routes (user)
// ------------

// get current user (./routes/api/user/getCurrentUser.js)

// express
const express = require("express");
const router = express.Router();
// db
const User = require("../../../mongo/models/User");
const { getCurrentUser } = require("../../../utils/mongoUtils");
// @route -- POST api/user/get-current-user/
// @desc -- get specific user
// @access -- public
router.post("/", async (req, res) => {
  try {
    console.log("api/user/get-current-user/ has received a request");
    const properties = req.body;
    const { uid, authState } = properties;
    const mongodbResponse = await getCurrentUser(User, uid);
    const { error, data: user } = mongodbResponse;
    if (error) return res.json({ data: null, error: error });
    return res.json({ data: user, error: null });
  } catch (err) {
    console.log(err);
    return res.json({ data: null, error: err.message });
  }
});

module.exports = router;

// get shopping cart (./routes/api/user/getShoppingCart.js)

const express = require("express");
const router = express.Router();
// db
const User = require("../../../mongo/models/User");
const { getShoppingCart } = require("../../../utils/mongoUtils");
// @route -- POST api/user/get-shopping-cart/
// @desc -- get shopping cart for current user
// @access -- public
router.post("/", async (req, res) => {
  try {
    console.log("api/user/get-shopping-cart/ has received a request");
    const properties = req.body;
    const { currentUser } = properties;
    const { uid } = currentUser;
    const mongodbResponse = await getShoppingCart(User, uid);
    const { error, data: shoppingCart } = mongodbResponse;
    if (error) return res.json({ data: null, error: error });
    return res.json({ data: shoppingCart, error: null });
  } catch (err) {
    console.log(err);
    return res.json({ data: null, error: err.message });
  }
});
module.exports = router;

// purchase program (./routes/api/user/purchaseProgram.js)

// express
const express = require("express");
const router = express.Router();
// db
const User = require("../../../mongo/models/User");
const { purchaseProgram } = require("../../../utils/mongoUtils");
// @route -- POST api/user/purchase-program/
// @desc -- add program to current user
// @access -- public
router.post("/", async (req, res) => {
  try {
    console.log("/api/user/purchase-program has received a request");
    const { uid, purchasedProgram } = req.body;
    const mongodbResponse = await purchaseProgram(User, uid, purchasedProgram);
    const { error, data: updatedUser } = mongodbResponse;
    if (error) return res.json({ data: null, error: error });
    return res.json({ data: updatedUser, error: null });
  } catch (err) {
    console.log(err);
    return res.json({ data: null, error: err.message });
  }
});
module.exports = router;

// signup (./routes/api/user/signup.js)

// express
const express = require("express");
const router = express.Router();
// db
const User = require("../../../mongo/models/User");
const { createUser } = require("../../../utils/mongoUtils");
// @route -- POST api/user/signup/
// @desc -- add user to 'user' collection in mongodb
// @access -- public
router.post("/", async (req, res) => {
  try {
    console.log("api/user/signup has received a request");
    const properties = req.body;
    const {
      firstName,
      lastName,
      email,
      shoppingCart,
      firebaseUser,
    } = properties;
    const { uid } = firebaseUser;
    const newUser = { firstName, lastName, email, uid, shoppingCart };
    let dbResponse = await createUser(User, newUser);
    return res.json(dbResponse);
  } catch (err) {
    console.log(err);
    return res.json({ data: null, error: err.message });
  }
});
module.exports = router;

// update shopping cart (./routes/api/user/updateShoppingCart)

// express
const express = require("express");
const router = express.Router();
// db
const User = require("../../../mongo/models/User");
const { updateShoppingCart } = require("../../../utils/mongoUtils");
// @route -- POST api/user/update-shopping-cart/
// @desc -- update cart for current user
// @access -- public
router.post("/", async (req, res) => {
  try {
    console.log("api/user/update-shopping-cart/ has received a request");
    const { uid, newShoppingCart } = req.body;
    const mongodbResponse = await updateShoppingCart(
      User,
      uid,
      newShoppingCart
    );
    const { error, data: updatedUser } = mongodbResponse;
    if (error) return res.json({ data: null, error: error });
    return res.json({ data: updatedUser, error: null });
  } catch (err) {
    console.log(err);
    return res.json({ data: null, error: err.message });
  }
});
module.exports = router;

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------

// ------------
//
// ------------
