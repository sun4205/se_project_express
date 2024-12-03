const mongoose = require("mongoose");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error("Error fetching users:", err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};


const getUser = (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID format." });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};


const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Both 'name' and 'avatar' are required." });
  }

  return User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error("Error creating user:", err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for user creation." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};

module.exports = { getUsers, getUser, createUser };
