const router = require("express").Router();
const { getUser } = require("../controllers/users");


router.get("/:id", getUser);

module.exports = router;
