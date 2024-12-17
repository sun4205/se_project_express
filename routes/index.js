const express = require("express");
const auth = require("../middlewares/auth");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");
const { NOT_FOUND } = require("../utils/errors");

const router = express.Router();

router.post("/signin", login);
router.post("/signup", createUser);
router.get("/items", itemRouter);

router.use(auth);

router.use("/users", userRouter);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found." });
});

module.exports = router;
