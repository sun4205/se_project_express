const Item = require("../models/clothingItem");


const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "Internal server error." });
    });
};


const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id; 

  if (!name || !weather || !imageUrl || !owner) {
    return res.status(400).send({ message: "All fields (name, weather, imageUrl, owner) are required." });
  }

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Internal server error." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .then((item) => {
      if (!item) {
        return res.status(404).send({ message: "Item not found." });
      }
      res.status(200).send({ message: "Item deleted successfully." });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid item ID." });
      }
      return res.status(500).send({ message: "Internal server error." });
    });
};

module.exports = { getItems, createItem, deleteItem };
