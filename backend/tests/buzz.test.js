const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../server");
const {
  fake_user,
  fake_user_two,
  fake_buzz,
  generateFakeUser,
  generateFakeBuzz,
  generateFakeComment,
} = require("./utils/mockdata");
const dbCleanup = require("./utils/dbCleanup");
const Buzz = require("../models/buzzModel");

dbCleanup();

var authToken = null;

beforeEach(async () => {
  authToken = await generateFakeUser(fake_user);
});

describe("GET /getAll", () => {
  console.log("REMINDER: HAVE REDIS SERVER RUNNING WHEN RUNNING TESTS");
  it("missing authentication should fail", async () => {
    const res = await request(app).get("/buzz/getAll");
    expect(res.statusCode).toBe(401);
  });
  it("successfully retrieve buzzes when there are none", async () => {
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
  it("missing ID should fail", async () => {
    const res = await request(app)
      .get("/buzz/getById")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });
  it("invalid ID should fail", async () => {
    const res = await request(app)
      .get("/buzz/getById/0")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully retrieve a buzz by ID", async () => {
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
  it("successfully retrieve a buzz by username", async () => {
    await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .get("/buzz/getByUsername/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /getFollowing", () => {
  it("when following no users, successfully return no users", async () => {
    const res = await request(app)
      .get("/buzz/getFollowing")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
  it("when following users, successfully return following buzzes", async () => {
    authToken = await generateFakeUser(fake_user_two);
    await generateFakeBuzz(fake_buzz);
    await request(app)
      .post("/profile/follow")
      .send({ followUsername: fake_user.username })
      .set("Authorization", `Bearer ${authToken}`);
    const res = await request(app)
      .get("/buzz/getFollowing")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /getComments", () => {
  it("when no comments, successfully return no comments", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .get("/buzz/getComments/" + buzz._id)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
  it("successfully retrieve comments", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    await generateFakeComment(fake_buzz, buzz._id);
    const res = await request(app)
      .get("/buzz/getComments/" + buzz._id)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /hasPosted", () => {
  it("when a user has not posted within 24hrs, successfully return false", async () => {
    const res = await request(app)
      .get("/buzz/hasPosted")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(false);
  });
  it("when a user has posted within 24hrs, successfully return true", async () => {
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
  it("successfully create a comment", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .post("/buzz/create")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        message: faker.word.words(),
        comment: buzz._id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty(
      "userID",
      "name",
      "username",
      "message",
      "likes",
      "comment"
    );
  });
});

describe("POST /like", () => {
  it("invalid liking of a buzz should fail", async () => {
    const res = await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: faker.string.alpha(15),
      });
    expect(res.statusCode).toBe(400);
  });
  it("successfully like a buzz", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const res = await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: buzz._id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("buzz", "comment", "liked", "action");
    expect(res.body["action"]).toBe("liked");
  });
  it("successfully like a comment", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const comment = await generateFakeComment(fake_buzz, buzz._id);
    const res = await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: comment._id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("buzz", "comment", "liked", "action");
    expect(res.body["action"]).toBe("liked");
  });
  it("successfully unlike a buzz", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: buzz._id,
      });
    const res = await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: buzz._id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("buzz", "comment", "liked", "action");
    expect(res.body["action"]).toBe("unliked");
  });
  it("successfully unlike a comment", async () => {
    const buzz = await generateFakeBuzz(fake_buzz);
    const comment = await generateFakeComment(fake_buzz, buzz._id);
    await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: comment._id,
      });
    const res = await request(app)
      .post("/buzz/like")
      .set("Authorization", `Bearer ${authToken}`)
      .send({
        likeID: comment._id,
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("buzz", "comment", "liked", "action");
    expect(res.body["action"]).toBe("unliked");
  });
});

describe("DELETE /delete", () => {
  it("invalid delete should fail", async () => {
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
