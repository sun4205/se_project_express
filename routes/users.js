const router = require("express").Router();
const { getUsers, getUser, createUser } = require("../controllers/users");
const User = require("../models/user");


router.get("/users", getUsers);


router.get("/users/:userId", getUser);


router.post("/users", createUser);
module.exports = router;