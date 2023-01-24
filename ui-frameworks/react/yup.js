// ------------
// yup
// ------------

// TODO: update/refactor

// install
`
npm i --save yup
`;

// ------------
// yup api
// ------------

// docs
// https://github.com/jquense/yup

// validate
schema.isValid(object1); // validate object against schema

// string
yup.string(); // test if string
yup.string().length(); // set required length
yup.string().min(6); // min length
yup.string().max(20); // max length
yup.string().matches(regex); // matches regex
yup.string().email(); // match email (regex)

// number
yup.number(); // test if number
yup.number().integer(); // test if integer
yup.number().min(0); // set min number
yup.number().max(100); // set max number
yup.number().positive(); // must be positive
yup.number().negative(); // must be negative

// boolean
yup.boolean(); // must be boolean

// date
yup.date(); // must be date (new Date())

// array
yup.array(); // must be array

// *** TODO -- array methods ***

// object
yup.object(); // must be object

// *** TODO -- object methods ***

// mixed (any)
yup.mixed().default(value); // set default value
yup.mixed().nullable(); // can have null values
yup.mixed().required(); // must be provided
yup.mixed().defined(); // any except undefined
yup.mixed().when(); // conditional based on other property
yup.mixed().oneOf(["Kakashi", "Yamato", "Iruka"]); // whitelist values

// ------------
// yup example
// ------------

// import

const yup = require("yup");

// schema

// phone number regex
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

// schema
let userSchema = yup.object().shape({
  name: yup.string().required("Please provide a name"),
  age: yup.number().required().positive().integer(),
  email: yup.string().email(),
  phoneNumber: yup.string().matches(
    phoneRegExp, // regex
    "Phone number is not valid" // error message on fail
  ),
  // phoneNumber ? (phoneType is required) : (phoneType is optional/nullable)
  phoneType: yup.string().when("phoneNumber", {
    is: (val) => !!val,
    then: yup.string().required("Please enter phone type."),
    otherwise: yup.string().nullable().default(null),
  }),
  website: yup.string().url(),
  createdOn: yup.date().default(() => new Date()),
});

// objects to validate

const kakashi1 = {
  name: "Kakashi",
  age: 27,
};

const kakashi2 = {
  name: "Kakashi",
  age: 27,
  phoneNumber: "456-456-4565",
  phoneType: "home",
};

// check validity
// function to validate object against schema
// ASYNCHRONOUS

const yupValidate = async (obj) => {
  const passesValidation = await userSchema.isValid(obj);
  return console.log(passesValidation) || passesValidation;
};

yupValidate(kakashi1);
yupValidate(kakashi2);
