const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { notFoundError } = require("../utils/errors");
const {
  validateUserBody,
  validateAuthentication,
} = require("../middlewares/validation");

router.post("/signup", validateUserBody, createUser);
router.post("/signin", validateAuthentication, login);
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res.status(notFoundError).send({ message: "Not Found" });
});

module.exports = router;
