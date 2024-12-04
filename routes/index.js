const express = require("express");
const userRouter = require("./users");
const itemRouter = require("./clothingItems");

const router = express.Router();

router.use("/users", userRouter);
router.use("/items", itemRouter);

module.exports = router;
