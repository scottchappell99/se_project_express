const User = require("../models/user");
const {
  invalidError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

// GET /users
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "Requested resource not found." });
    });
};

// POST /users
const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(invalidError).send({ message: err.message });
      } 
        return res
          .status(defaultError)
          .send({ message: "Requested resource not found." });
      
    });
};

// GET /users/:userId
const getUserById = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: err.message });
      } if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: err.message });
      } 
        return res
          .status(defaultError)
          .send({ message: "Requested resource not found." });
      
    });
};

module.exports = { getUsers, createUser, getUserById };
