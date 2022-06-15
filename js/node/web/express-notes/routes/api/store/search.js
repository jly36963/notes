// imports
const express = require('express');
const router = express.Router();

// @route -- POST /api/store/search
// @desc -- return query object
// @access -- public

router.get('/', (req, res) => {
  const query = req.query;
  try {
    return res.json({ data: query, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err.message });
  }
});
module.exports = router;
