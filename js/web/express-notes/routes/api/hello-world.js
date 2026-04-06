// imports
const express = require('express');
const router = express.Router();

// @route -- GET /api/hello-world
// @desc -- return 'Hello World'
// @access -- public

router.get('/', (req, res) => {
  try {
    const hello = 'Hello world!';
    return res.json({ data: hello, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
});
module.exports = router;
