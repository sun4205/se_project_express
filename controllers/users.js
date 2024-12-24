const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  BAD_REQUEST,
  CONFLICT,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(BAD_REQUEST).send({ message: "Invalid user ID format." });
  }

  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error("Error fetching user:", err);
      if (err.name === "ValidationeError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for user creation." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST).send({
      message:
        "All fields ('name', 'avatar', 'email', and 'password') are required.",
    });
  }

  return User.findOne({ email }).then((existingUser) => {
    if (existingUser) {
      return res.status(CONFLICT).send({
        message: "A user with this email already exists.",
      });
    }

    return bcrypt
      .hash(password, 10)
      .then((hashedPassword) =>
        User.create({
          name,
          avatar,
          email,
          password: hashedPassword,
        })
      )
      .then((user) => {
        const userResponse = {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
          email: user.email,
        };
        return res.status(201).send(userResponse);
      })
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
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(BAD_REQUEST)
      .send({ message: "Email and password are required." });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch((err) => {
      console.error("Login error:", err.message);

      if (err.message === "Incorrect email or password") {
        return res
          .status(UNAUTHORIZED)
          .send({ message: "Invalid data provided" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};

const updateProfile = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res.status(BAD_REQUEST).send({
      message: "Both 'name' and 'avatar' fields are required.",
    });
  }

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(NOT_FOUND).send({ message: "User not found." });
      }
      return res.send(updatedUser);
    })
    .catch((err) => {
      console.error("Error updating user profile:", err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid data provided for profile update." });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error occurred on the server." });
    });
};
module.exports = { getCurrentUser, createUser, login, updateProfile };
