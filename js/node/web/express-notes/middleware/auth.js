// middleware
// get authState from request body
// if falsey, return error response
// if truthy, continue to handler (or next middleware)
const auth = (req, res, next) => {
  const { authState } = req.body;
  if (!authState)
    return res.status(401).json({ data: null, error: 'Improper Auth' });
  next();
};
module.exports = auth;
