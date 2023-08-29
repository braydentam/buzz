const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../server");
const {
  fake_user,
  fake_buzz,
  generateFakeUser,
  generateFakeBuzz,
} = require("./utils/mockdata");
const dbCleanup = require("./utils/dbCleanup");
const Buzz = require("../models/buzzModel");

dbCleanup();

var authToken = null;

beforeEach(async () => {
  authToken = await generateFakeUser(fake_user);
});

describe("GET /getAll", () => {
  it("missing authentication should fail", async () => {
    const res = await request(app).get("/buzz/getAll");
    expect(res.statusCode).toBe(401);
  });
  it("successfully retrieve buzzes even if there are none", async () => {
    const res = await request(app)
      .get("/buzz/getAll")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
  it("successfully retrieve buzzes", async () => {
    await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .get("/buzz/getAll")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("buzz");
  });
});

describe("GET /getById", () => {
  it("missing id should fail", async () => {
    const res = await request(app)
      .get("/buzz/getById")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });
  it("invalid id should fail", async () => {
    const res = await request(app)
      .get("/buzz/getById/0")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully retrieve a valid buzz by id", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .get("/buzz/getById/" + buzz._id)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /getByUsername", () => {
  it("missing username should fail", async () => {
    const res = await request(app)
      .get("/buzz/getByUsername")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });
  it("invalid username should fail", async () => {
    const res = await request(app)
      .get("/buzz/getByUsername/invalid_username")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully retrieve a valid buzz by username", async () => {
    await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .get("/buzz/getByUsername/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
});

//TODO: do get following, get comments, like, as well as comment cases

describe("GET /hasPosted", () => {
  it("if a user has not posted within 24hrs, it should successfully return false", async () => {
    const res = await request(app)
      .get("/buzz/hasPosted")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(false);
  });
  it("if a user has posted within 24hrs, it should successfully return true", async () => {
    await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .get("/buzz/hasPosted")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(true);
  });
});

describe("POST /create", () => {
  it("missing message should fail", async () => {
    const res = await request(app)
      .post("/buzz/create")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully create a buzz", async () => {
    const res = await request(app)
      .post("/buzz/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        message: faker.word.words(),
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "userID",
      "name",
      "username",
      "message",
      "likes"
    );
  });
});

describe("DELETE /delete", () => {
  it("non existent delete should fail", async () => {
    const res = await request(app)
      .delete("/buzz/delete")
      .send({
        deleteID: faker.string.alpha(15),
      })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully delete a buzz", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .delete("/buzz/delete")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        deleteID: buzz._id,
      });
    expect(res.statusCode).toBe(200);
    const deletedBuzz = await Buzz.findById(buzz._id);
    expect(deletedBuzz).toBe(null);
  });
});
