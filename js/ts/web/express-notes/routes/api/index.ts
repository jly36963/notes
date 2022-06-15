// imports
import express from 'express';
const router = express.Router();

// @route -- GET /api
// @desc -- return 200 OK
// @access -- public

router.get('/', (req: express.Request, res: express.Response) => {
  return res.status(200).json({});
});

// @route -- GET /api/hello-world
// @desc -- return 'Hello World'
// @access -- public

router.get('/hello-world', (req: express.Request, res: express.Response) => {
  try {
    return res.status(200).json({ message: 'Hello world!' });
  } catch (err) {
    return res.status(500).json({ message: 'Error while handling request' });
  }
});

export default router;
