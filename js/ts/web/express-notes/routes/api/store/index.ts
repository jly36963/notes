// imports
import express from 'express';
const router = express.Router();

// @route -- POST /api/store/search
// @desc -- return query object
// @access -- public

router.get('/search', (req: express.Request, res: express.Response) => {
  const query: object = req.query;
  try {
    return res.status(200).json({ query });
  } catch (err) {
    return res.status(500).json({ message: 'Error while executing search.' });
  }
});

export default router;
