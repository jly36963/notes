const polka = require('polka');
const app = polka();
const port = process.env.PORT || 3000;
const json = require('body-parser');

// global middleware
app.use(json());

// add routes
app.use('/api', require('./routes/api/index'));

// listen
app.listen(port); // synchronous? (not a promise)
console.log(`app listening on port ${port}`);
