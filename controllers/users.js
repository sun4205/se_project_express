const User = require("../models/user");

const getUsers = (req, res) => {
  User
    .find({})
    .then((users) => {
        res.status(200).send(users)
      
    })
    .catch((err) => {
      console.err(err);
      return res.status(500).send({ message: err.message });
    });
};

const createUser = (req,res) => {
    const {name, avatar} = req.body;
    console.log(name,avatar);
    if (!name || !avatar) {
        return res.status(400).send({ message: "Both 'name' and 'avatar' are required." });
    }
    User.create({name,avatar})
    .then((user)=>res.status(201).send(user))
    .catch((err)=>{
        console.error(err);
        return res.status(500).send({ message: err.message });
    });
}

module.exports = { getUsers, createUser };
