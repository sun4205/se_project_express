const mongoose = require("mongoose");
const Item = require("../models/clothingItem");
const {
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,  
  BadRequestError,
    ConflictError,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
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
    console.error("Authentication error: User is not authenticated.");
    return next(new UnauthorizedError("User is not authenticated."));
  }

  const owner = req.user._id;

  return Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error("Error in createItem:", err.message);
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Invalid data."));
      }

      return next(new InternalServerError("An unexpected error occurred."));
    });
};

const getItem = (req, res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    console.error("Invalid ID format:", id);
    
    return next(new BadRequestError("Invalid Id"));
  }

  return Item.findById(id)
    .then((item) => {
      if (!item) {
       return next(new NotFoundError("Item is not found"))
      }
      return res.send(item);
    })
    .catch((err) => {
      console.error("Error in getItems:", err.message);
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    console.error("Invalid ID format:", itemId);
    
    return next(new BadRequestError("Invalid item Id"));
  }

  return Item.findById(itemId)

    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item not found."));
      }
      if (item.owner.toString() !== req.user._id) {
        return next(new ForbiddenError("You do not have permission to delete this item."))
      }

      return Item.findByIdAndDelete(itemId).then(() =>
        res.send({ message: "Item deleted successfully." })
      );
    })
    .catch((error) => {
      console.error("Error in deleteItems", error.message);
      next(error);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    console.error("Invalid ID format:", itemId);
    
    return next(new BadRequestError("Invalid item ID."));
  }

  return Item.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item is not found"))
      }
      return res.send(item);
    })
    .catch((error) => {
      console.error("Error in likeItem", error.message);
      next(error);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;

  if (!isValidObjectId(itemId)) {
    console.error("Invalid ID format:", itemId);
    return next(new BadRequestError("Invalid Id format"));
  }

  return Item.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((item) => {
      if (!item) {
        return next(new NotFoundError("Item is not found"));
      }
      return res.send(item);
    })
    .catch((error) => {
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
