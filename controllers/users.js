const User = require("../models/user");


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: "Internal server error." });
    });
};


const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID." });
      }
      return res.status(500).send({ message: "Internal server error." });
    });
};


const createUser = (req, res) => {
  console.log("Request body:", req.body);
  const { name, avatar } = req.body;
  if (!name || !avatar) {
    return res.status(400).send({ message: "Both 'name' and 'avatar' are required." });
  }
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: "Internal server error." });
    });
};

module.exports = { getUsers, getUser, createUser };
