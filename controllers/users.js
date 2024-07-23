const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  invalidError,
  notFoundError,
  conflictError,
  defaultError,
  unauthError,
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidError).send({ message: "Invalid Data." });
      }
      if (err.code === 11000) {
        return res
          .status(conflictError)
          .send({ message: "Another user already exists with that email." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST login
const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(invalidError)
      .send({ message: "Incorrect user name or password." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "401") {
        return res
          .status(unauthError)
          .send({ message: "Incorrect user name or password." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET current user
const getCurrentUser = (req, res) => {
  const userId = req.user;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(notFoundError)
          .send({ message: "Requested user not found." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
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
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidError).send({ message: "Invalid Data." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateCurrentUser,
};
