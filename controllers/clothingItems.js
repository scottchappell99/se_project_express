const ClothingItem = require("../models/clothingItem");
const {
  invalidError,
  forbiddenError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

// GET items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

// POST new item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
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

// DELETE an item by id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        return res
          .status(forbiddenError)
          .send({ message: "You are not authorized to delete this item." });
      }
      return item
        .deleteOne()
        .then(() => res.send({ message: "Item deleted." }));
    })
    .catch((err) => {
      console.error(err.name);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: "Invalid Data." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Not Found." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

// PUT like an item
const likeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: user } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: "Invalid Data." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Not Found." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

// DELETE unlike an item
const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: user } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: "Invalid Data." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: "Not Found." });
      }
      return res
        .status(defaultError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
