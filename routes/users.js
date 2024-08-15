const router = require("express").Router();
const { getCurrentUser, updateCurrentUser } = require("../controllers/users");
const { auth } = require("../middlewares/auth");
const { validateUserId } = require("../middlewares/validation");

router.get("/me", validateUserId, auth, getCurrentUser);
router.patch("/me", validateUserId, auth, updateCurrentUser);

module.exports = router;
