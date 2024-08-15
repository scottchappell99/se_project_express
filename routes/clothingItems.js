const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const {
  validateClothingItemBody,
  validateItemId,
} = require("../middlewares/validation");

router.get("/", getClothingItems);

router.post("/", validateClothingItemBody, auth, createClothingItem);

router.delete("/:itemId", validateItemId, auth, deleteClothingItem);

router.put("/:itemId/likes", validateItemId, auth, likeItem);

router.delete("/:itemId/likes", validateItemId, auth, unlikeItem);

module.exports = router;
