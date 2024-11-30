const router = require("express").Router();
const { getUsers, createUser } = require("../controllers/users");
const User = require("../models/user");

router.get("/users", getUsers);
  
  router.get("/:userId", ()=> console.log("get users by ID"));

  router.post("/", createUser);
module.exports = router;