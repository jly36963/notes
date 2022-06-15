'use strict';
const auth = (req, res, next) => {
  const { authState } = req.body;
  if (!authState) return res.status(401).json({ message: 'Improper auth' });
  next();
};
module.exports = auth;
//# sourceMappingURL=auth.js.map
