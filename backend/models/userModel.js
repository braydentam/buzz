const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const { createBloomFilter, updateBloomFilter, existsInBloomFilter} = require("../utils/bloomFilter");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.statics.signup = async function (name, username, password) {
  if (!name || !username || !password) {
    throw Error("All fields must be filled");
  }
  const exists = await existsInBloomFilter(username);
  if (exists) {
    console.log("Caught by bloom filter")
    const existsInDB = await this.findOne({ username });
    if (existsInDB) {
      throw Error("Username already in use");
    }
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await this.create({ name, username, password: hash });
  updateBloomFilter(username);

  return user;
};

userSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw Error("All fields must be filled");
  }
  const user = await this.findOne({ username });
  if (!user) {
    throw Error("Incorrect username");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }
  return user;
};

userSchema.statics.setupBloomFilter = async function () {
  const users = await this.find();
  createBloomFilter(users);
};


module.exports = mongoose.model("User", userSchema);
