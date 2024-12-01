const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");
const User = require("../models/user");

router.get("/", getUsers);


router.get("/:userId", getUser);


router.post("/", createUser);
module.exports = router;