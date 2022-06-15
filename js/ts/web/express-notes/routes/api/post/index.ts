// imports
import express from 'express';
import auth from '../../../middleware/auth';
const router = express.Router();

// @route -- GET /api/post/:id
// @desc -- return post
// @access -- protected

interface Author {
  id: number | string;
  firstName: string;
  lastName: string;
}

interface Post {
  id: number | string;
  message: string;
  author: Author;
}

router.get(
  '/:id',
  auth, // use auth middleware
  async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
      // *** authorization logic here (can user view post) ***
      // *** db fetch logic here ***
      // pretend data from fetch (author, post)
      const author: Author = {
        firstName: 'Kakashi',
        lastName: 'Hatake',
        id: 1,
      };
      const post: Post = { message: 'Hello there!', author, id };
      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ message: 'Error while fetching post' });
    }
  },
);

export default router;
