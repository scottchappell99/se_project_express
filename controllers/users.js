const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// POST new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res.status(201).send({
        name: user.name,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data."));
      } else if (err.code === 11000) {
        next(new ConflictError("Another user already exists with that email"));
      } else {
        next(err);
      }
    });
};

// POST login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Incorrect user name or password"));
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      if (err.message === "401") {
        next(new UnauthorizedError("Incorrect user name or password."));
      } else {
        next(err);
      }
    });
};

// GET current user
const getCurrentUser = (req, res) => {
  const _id = req.user;

  User.findById(_id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Requested user not found."));
      } else {
        next(err);
      }
    });
};

// PATCH current user
const updateCurrentUser = (req, res) => {
  const { user } = req;
  const { name, avatar } = req.body;

  User.findOneAndUpdate(
    user,
    { name, avatar },
    { runValidators: true, new: true }
  )
    .then((updatedUser) => res.send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data."));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
