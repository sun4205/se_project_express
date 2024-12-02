const Item = require("../models/clothingItem");
const { BAD_REQUEST, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/errors");


const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};


const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id; 
  console.log("User ID:", owner);

  if (!name || !weather || !imageUrl || !owner) {
    return res.status(BAD_REQUEST).send({ message: "All fields (name, weather, imageUrl, owner) are required." });
  }

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
    console.log("User ID in deleteItem:", req.user._id);
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
  .orFail(() => {
    const error = new Error("Item not found.");
    error.statusCode = NOT_FOUND;
    throw error;
  })
    .then((item) => {
      if (!item) {
        return res.status(NOT_FOUND).send({ message: "Item not found." });
      }
      res.status(200).send({ message: "Item deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(BAD_REQUEST).send({ message: "Invalid item ID." });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, deleteItem };
