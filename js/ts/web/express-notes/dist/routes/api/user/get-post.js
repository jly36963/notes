'use strict';
const express = require('express');
const router = express.Router();
router.get('/:id', (req, res) => {
  const id = req.params;
  try {
    const post = { message: 'Hello there!', author: 'Kakashi', id };
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ message: 'Error while fetching post' });
  }
});
module.exports = router;
//# sourceMappingURL=get-post.js.map
