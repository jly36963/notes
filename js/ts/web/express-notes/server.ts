// imports
import path from 'path';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import pino from 'express-pino-logger';
// dotenv
require('dotenv').config(); // use .env
// instantiate app
const app = express();
// server startup function
const start = async (app: any) => {
  // middleware
  app
    .use(helmet())
    .use(express.json())
    .use(morgan(':method | :url | :status'))
    .use(pino({ prettyPrint: true }));
  // import & use routes
  const routes: Array<string> = [
    '/api',
    '/api/user',
    '/api/store/',
    '/api/file/',
    '/api/post/',
  ];
  await (async () => {
    for (const route of routes) {
      console.log(`Adding router to application: "${route}"`);
      import(`./routes/${route}`).then((router) =>
        app.use(route, router.default),
      );
    }
  })();
  // static files (public)
  app.use(express.static('public'));
  // Serve static assets in production (post-build react app)
  if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
  }
  // port
  const port: string | number = process.env.PORT || 5000;
  // listen
  app.listen(port, (): void =>
    console.log(`App listening at http://localhost:${port}`),
  );
};

start(app);
