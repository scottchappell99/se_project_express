const router = require("express").Router();

const { createUser, login } = require("../controllers/users");
const userRouter = require("../routes/users");
const clothingItemRouter = require("./clothingItems");
const { notFoundError } = require("../utils/errors");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res.status(notFoundError).send({ message: "Not Found" });
});

module.exports = router;
