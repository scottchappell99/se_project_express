const ClothingItem = require("../models/clothingItem");
const {
  invalidError,
  notFoundError,
  defaultError,
} = require("../utils/errors");

// GET /items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(defaultError)
        .send({ message: "Requested resource not found." });
    });
};

// POST /items
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(200).send(item))
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

// DELETE /items/:itemId
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: err.message });
      } if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: err.message });
      } 
        return res
          .status(defaultError)
          .send({ message: "Requested resource not found" });
      
    });
};

// PUT /items/:itemId/likes
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
        return res.status(invalidError).send({ message: err.message });
      } if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: err.message });
      } 
        return res
          .status(defaultError)
          .send({ message: "Requested resource not found" });
      
    });
};

// DELETE /items/:itemId/likes
const unlikeItem = (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;

  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: user } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "CastError") {
        return res.status(invalidError).send({ message: err.message });
      } if (err.name === "DocumentNotFoundError") {
        return res.status(notFoundError).send({ message: err.message });
      } 
        return res
          .status(defaultError)
          .send({ message: "Requested resource not found" });
      
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
