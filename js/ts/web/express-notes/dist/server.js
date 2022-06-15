'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const pino = require('express-pino-logger');
require('dotenv').config();
const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan(':method | :url | :status'));
app.use(pino({ prettyPrint: true }));
app.use('/api/hello-world', require('./routes/api/hello-world'));
app.use('/api/user/get-profile', require('./routes/api/user/get-profile'));
app.use('/api/user/get-post', require('./routes/api/user/get-post'));
app.use('/api/store/search', require('./routes/api/store/search'));
app.use('/api/file/save-file', require('./routes/api/file/save-file'));
app.use('/api/file/save-files', require('./routes/api/file/save-files'));
app.use(express.static('public'));
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`),
);
//# sourceMappingURL=server.js.map
