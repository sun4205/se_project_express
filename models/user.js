const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: [true, "The avatar field is required."],
    validate: {
      validator(value) {
        return validator.isURL(value, {
          protocols: ["http", "https"],
          require_protocol: true,
        });
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: [true, "The email field is required."],
    unique: true, 
    validate: {
      validator(value) {
        return validator.isEmail(value); 
      },
      message: "You must enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "The password field is required."],
    minlength: 6, 
  },
});
module.exports = mongoose.model("user", userSchema);
