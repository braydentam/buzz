const mongoose = require("mongoose");
const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../server");
const { fake_user, generateFakeUser } = require("./utils/fakeusers");
const clearDatabase = require("./utils/clearDatabase");

require("dotenv").config();

beforeEach(async () => {
  await mongoose.connect(process.env.MONGO_URI);
});

beforeEach(async () => {
  await clearDatabase();
});

afterEach(async () => {
  await mongoose.connection.close();
});

describe("POST /signup", () => {
  it("matching usernames should fail", async () => {
    await generateFakeUser(fake_user);
    const res = await request(app).post("/user/signup").send({
      name: faker.person.fullName(),
      username: fake_user.username,
      password: faker.internet.password(),
    });
    expect(res.statusCode).toBe(400);
  });
  it("successfully signup a user", async () => {
    const res = await request(app).post("/user/signup").send({
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("token");
  });
});

describe("POST /login", () => {
  it("non-existent username should fail", async () => {
    await generateFakeUser(fake_user);
    const res = await request(app).post("/user/login").send({
      username: "nonexistent-username",
      password: fake_user.password,
    });
    expect(res.statusCode).toBe(400);
  });
  it("wrong password should fail", async () => {
    await generateFakeUser(fake_user);
    const res = await request(app).post("/user/login").send({
      username: fake_user.username,
      password: "wrong-password",
    });
    expect(res.statusCode).toBe(400);
  });
  it("successfully login a user", async () => {
    await generateFakeUser(fake_user);
    const res = await request(app).post("/user/login").send({
      username: fake_user.username,
      password: fake_user.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("username");
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("token");
  });
});
