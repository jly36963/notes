// -----------
// twilio (nodejs)
// -----------

// quickstart
  // https://www.twilio.com/docs/sms/quickstart/node

// setup steps
  // sign up for twilio
  // if first time user:
    // validate a phone number you own to prove you're a non-spamming human
    // follow project creation wizard in twilio console
  // get a twilio phone number (purchase)
    // go to main console
    // navigate to 'buy a number' page.
    // check 'sms' box and click 'search' to find a usable, SMS-capable phone number.
  // save credentials
    // 'account sid' and 'auth token' are found in twilio.com/console

// install
`
npm i --save twilio
`

// -----------
// set up client
// -----------

// imports
const accountSid = process.env.TWILIO_ACCOUNT_SID; // 'ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
const authToken = process.env.TWILIO_AUTH_TOKEN; // 'your_auth_token'
const client = require('twilio')(accountSid, authToken);

// content
const body = 'This is the ship that made the Kessel Run in fourteen parsecs?'
const from = '+15017122661'; // E.164 formatting
const to = '+15558675310';

// send message (promise)
client.messages
  .create({ body, from, to })
  .then(message => console.log(message.sid));

// send message (async / await)
const message = await client.messages.create({ body, from, to });
console.log(message.sid);

// -----------
// twilio message server
// -----------

// https://www.twilio.com/docs/sms/quickstart/node#receive-and-reply-to-inbound-sms-messages-with-express

// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



// -----------
// 
// -----------



