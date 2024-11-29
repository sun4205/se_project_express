const router = require("express").Router();
const User = require("../models/user");

router.get("/users", (req, res) => {
    console.log("GET /users called"); 
    res.send("Users route"); 
  });
  

module.exports = router;