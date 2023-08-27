const { faker } = require("@faker-js/faker");
const jwt = require("jsonwebtoken");
const User = require("../../models/userModel");
const Profile = require("../../models/profileModel");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const fake_user = {
  name: faker.person.fullName(),
  username: faker.internet.userName(),
  password: "test",
};

const generateFakeUser = async (user_info) => {
  const user = await User.signup(
    user_info.name,
    user_info.username,
    user_info.password
  );
  const token = createToken(user._id);
  const id = user._id;
  const profile = new Profile({
    user: user._id,
    name: user.name,
    username: user.username,
  });
  Promise.all([profile.save()]);
};

module.exports = { fake_user, generateFakeUser };
