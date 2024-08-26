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

router.post("/", auth, validateClothingItemBody, createClothingItem);

router.delete("/:itemId", auth, validateItemId, deleteClothingItem);

router.put("/:itemId/likes", auth, validateItemId, likeItem);

router.delete("/:itemId/likes", auth, validateItemId, unlikeItem);

module.exports = router;
