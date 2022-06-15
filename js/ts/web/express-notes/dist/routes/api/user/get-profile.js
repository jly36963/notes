'use strict';
const express = require('express');
const auth = require('../../../middleware/auth');
const router = express.Router();
router.post('/', auth, (req, res) => {
  const { authState } = req.body;
  try {
    const { id } = authState;
    const user = { name: 'Kakashi', id };
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: 'Error while fetching user' });
  }
});
module.exports = router;
//# sourceMappingURL=get-profile.js.map
