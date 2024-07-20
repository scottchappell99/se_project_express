const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  invalidError,
  unauthError,
  notFoundError,
  defaultError,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// GET all users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST new user
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then(User.create({ name, avatar, email, hash }))
    .then((user) => {
      if (user === "11000") {
        throw new Error("This email is already attached to a user.");
      }
      res.status(201).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidError).send({ message: "Invalid Data" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

//POST login
const login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(unauthError)
        .send({ message: "Incorrect user name or password." });
    });
};

// GET user by _id
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: "Invalid Data" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Not Found" });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getUsers, createUser, getUserById };
