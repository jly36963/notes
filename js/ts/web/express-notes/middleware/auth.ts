import express from 'express';

const auth = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const { token } = req.headers;
  if (!token) return res.status(401).json({ message: 'Improper auth' });
  next();
};

export default auth;
