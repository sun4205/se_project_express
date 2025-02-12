const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const {validateClothingItem,validatedId} = require("../middlewares/validation");
const auth = require("../middlewares/auth");

router.get("/", getItems);
router.post("/", auth, validateClothingItem, createItem);
router.delete("/:itemId", auth, validatedId, deleteItem);

router.put("/:itemId/likes", auth, validatedId, likeItem);
router.delete("/:itemId/likes", auth, validatedId, dislikeItem);

module.exports = router;
