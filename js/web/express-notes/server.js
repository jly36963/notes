// imports
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const pino = require('express-pino-logger');
// dotenv
require('dotenv').config(); // loads .env file
// instantiate app
const app = express();
// middleware
app.use(helmet());
app.use(express.json());
app.use(morgan(':method | :url | :status'));
app.use(pino({ prettyPrint: true }));

// import routes
app.use('/api/hello-world', require('./routes/api/hello-world'));
app.use('/api/user/get-profile', require('./routes/api/user/get-profile'));
app.use('/api/user/get-post', require('./routes/api/user/get-post'));
app.use('/api/store/search', require('./routes/api/store/search'));
app.use('/api/file/save-file', require('./routes/api/file/save-file'));
app.use('/api/file/save-files', require('./routes/api/file/save-files'));

// static files (public)
app.use(express.static('public'));

// Serve static assets in production (post-build react app)
if (true || process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
// start app
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`),
);
