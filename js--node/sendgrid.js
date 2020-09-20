// -----------
// sendgrid
// -----------

// install
`
# send mail
npm i --save @sendgrid/mail 
# use all other twilio sendgrid v3 web api endpoints
npm i --save @sendgrid/client 
`

// -----------
// send email (@sendgrid/mail)
// -----------

// import
const sgMail = require('@sendgrid/mail');
// use key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// content
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with Twilio SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
// send message (promises)
sgMail
  .send(msg)
  .then(() => { }, error => {
    console.error(error);
    if (error.response) {
      console.error(error.response.body)
    }
  }
);
// send message (async / await)
try {
  await sgMail.send(msg);
} catch (err) {
  console.error(err);
}

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



