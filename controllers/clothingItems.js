const mongoose = require("mongoose");
const Item = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error("Error in getItems", err.message);
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  if (!req.user || !req.user._id) {   
    const error = new Error("User is not authenticated.");
    error.statusCode = UNAUTHORIZED;
    console.error("Authentication error:", error);
    return next(error);
  }

  const owner = req.user._id;

  return Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error("Error in createItem:", err.message);
      const error = new Error(err.message);
      err.statusCode =
        err.name === "ValidationError" ? BAD_REQUEST : INTERNAL_SERVER_ERROR;
      next(err);
    });
};

const getItem = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    console.error("Invalid ID format:", id);
    const err = new Error("ID is invalid.");
    err.statusCode = BAD_REQUEST; 
    return next(err);
    
  }

  return Item.findById(id)
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found.");
        error.statusCode = NOT_FOUND;
        throw error;
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error("Error in getItems:",err.message);
      next(err)
});
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    console.error("Invalid ID format:", itemId);
    const error = new Error("Invalid item ID.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return Item.findById(itemId)

    .then((item) => {
      if (!item) {
        const error = new Error("Item not found.");
        error.statusCode = NOT_FOUND;
        throw error;
      }
      if (item.owner.toString() !== req.user._id) {
        const error = new Error(
          "You do not have permission to delete this item."
        );
        error.statusCode = FORBIDDEN;
        throw error;
      }

      return Item.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Item deleted successfully." })
      );
    })
    .catch((error) =>{
      console.error("Error in deleteItems", error.message);
     next(error)
});
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    console.error("Invalid ID format:", itemId);
    const error = new Error("Invalid item ID.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found.");
        error.statusCode = NOT_FOUND;
        throw error;
      }
      return res.send(item);
    })
    .catch((error) => {
      console.error("Error in likeItem", error.message);
      next(error)
});
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    console.error("Invalid ID format:", itemId);
    const error = new Error("Invalid item ID.");
    error.statusCode = BAD_REQUEST;
    return next(error);
  }

  return Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        const error = new Error("Item not found.");
        error.statusCode = NOT_FOUND;
        throw error;
      }
      return res.send(item);
    })
    .catch((error) =>{
      console.error("Error in dislikeItem", error.message);
      next(error);
});
};

module.exports = {
  getItems,
  createItem,
  getItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
