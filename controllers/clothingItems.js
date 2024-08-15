const ClothingItem = require("../models/clothingItem");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../utils/errors");

// GET items
const getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

// POST new item
const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid Data."));
      } else {
        next(err);
      }
    });
};

// DELETE an item by id
const deleteClothingItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id) {
        next(new ForbiddenError("You are not authorized to delete this item."));
      } else {
        return item
          .deleteOne()
          .then(() => res.send({ message: "Item deleted." }));
      }
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item Not Found."));
      } else {
        next(err);
      }
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
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item Not Found."));
      } else {
        next(err);
      }
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
      console.log(err.name);
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid Data."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item Not Found."));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
};
