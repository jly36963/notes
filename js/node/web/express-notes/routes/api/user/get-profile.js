// imports
const express = require('express');
const router = express.Router();
const auth = require('../../../middleware/auth');

// @route -- POST /api/user/get-profile
// @desc -- get id from req.body.authState, return user
// @access -- protected

router.post(
  '/',
  auth, // use auth middleware
  (req, res) => {
    const { authState } = req.body;
    try {
      const { id } = authState;
      const user = { name: 'Kakashi', id }; // pretend db Response
      return res.json({ data: user, error: null });
    } catch (err) {
      return res.status(500).json({ data: null, error: err.message });
    }
  },
);
module.exports = router;
