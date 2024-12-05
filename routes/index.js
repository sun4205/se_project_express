const express = require("express");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");
const { NOT_FOUND } = require("./utils/errors");

const router = express.Router();

router.use("/users", userRouter);
router.use("/items", itemRouter);

app.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found." });
});

module.exports = router;
