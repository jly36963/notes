// imports
const express = require('express');
const router = express.Router();

// @route -- POST /api/user/get-post/:id
// @desc -- return post
// @access -- public

router.get('/:id', (req, res) => {
  const { id } = req.params;
  try {
    const post = { message: 'Hello there!', author: 'Kakashi', id }; // pretend db Response
    return res.json({ data: post, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
});
module.exports = router;
