const jwt = require("jsonwebtoken");

const { UnauthorizedError } = require("../utils/errors/UnauthorizedError");
const { JWT_SECRET } = require("../utils/config");

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new UnauthorizedError("Authorization Required"));
    // return res.status(unauthError).send({ message: "Authorization Required." });
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new UnauthorizedError("Authorization Required"));
    // return res.status(unauthError).send({ message: "Authorization Required." });
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
