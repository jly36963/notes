'use strict';
const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  const query = req.query;
  try {
    return res.status(200).json({ query });
  } catch (err) {
    return res.status(500).json({ message: 'Error while executing search.' });
  }
});
module.exports = router;
//# sourceMappingURL=search.js.map
