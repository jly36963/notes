// imports
import express from 'express';
import auth from '../../../middleware/auth';
const router = express.Router();

// @route -- GET /api/user/profile
// @desc -- get user profile
// @access -- protected

router.get(
  '/profile',
  auth, // use auth middleware
  async (req: express.Request, res: express.Response) => {
    try {
      // *** db fetch logic here ***
      const user: object = { firstName: 'Kakashi', lastName: 'Hatake', id: 1 }; // pretend db fetch response
      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ message: 'Error while fetching user' });
    }
  },
);

// @route -- POST /api/user/create
// @desc -- create new user, return db response
// @access -- public

interface NewUser {
  firstName: string;
  lastName: string;
}

router.post('/create', async (req: express.Request, res: express.Response) => {
  const { firstName, lastName }: NewUser = req.body;
  try {
    // *** validation logic here ***
    // *** db insert logic here ***
    const user: object = { firstName, lastName, id: 1 }; // pretend response from insert
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Error while creating user' });
  }
});

export default router;
