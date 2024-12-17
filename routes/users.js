const router = require("express").Router();
const { getCurrentUser } = require("../controllers/users");


router.get("/me", auth, getCurrentUser);

module.exports = router;
