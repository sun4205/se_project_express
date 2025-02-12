const express = require("express");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const {
  validateUserInfo,
  validateUserLogin,
} = require("../middlewares/validation");
const NotFoundError = require("../utils/errors/NotFoundError");

const router = express.Router();

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserInfo, createUser);

router.use("/items", itemRouter);
router.use("/users", userRouter);

router.use((_req, _res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
