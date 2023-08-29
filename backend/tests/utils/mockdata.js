const { faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Profile = require("../../models/profileModel");
const Buzz = require("../../models/buzzModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const fake_user = {
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  password: "test",
  id: null,
};

const fake_buzz = {
  userID: fake_user.id,
  name: fake_user.name,
  username: fake_user.username,
  message: faker.word.words(),
};

const generateFakeUser = async (user_info) => {
  const user = await User.signup(
    user_info.name,
    user_info.username,
    user_info.password
  );
  const token = createToken(user._id);
  const id = user._id;
  fake_user.id = id;
  fake_buzz.userID = id;
  const profile = new Profile({
    user: user._id,
    name: user.name,
    username: user.username,
  });
  Promise.all([user.save(), profile.save()]);
  return token;
};

const generateFakeBuzz = async (buzz_info) => {
  const buzz = new Buzz({
    userID: buzz_info.userID,
    name: buzz_info.name,
    username: buzz_info.username,
    message: buzz_info.message,
  });
  Promise.all([buzz.save()]);
  return buzz;
};

module.exports = { fake_user, fake_buzz, generateFakeUser, generateFakeBuzz };
