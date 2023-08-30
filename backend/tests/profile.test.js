const request = require("supertest");
const { faker } = require("@faker-js/faker");
const app = require("../server");
const {
  fake_user,
  generateFakeUser,
  fake_user_two,
} = require("./utils/mockdata");
const dbCleanup = require("./utils/dbCleanup");

dbCleanup();

var authToken = null;

beforeEach(async () => {
  authToken = await generateFakeUser(fake_user);
});

describe("GET /getProfile", () => {
  it("missing username should fail", async () => {
    const res = await request(app)
      .get("/profile/getProfile")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(404);
  });
  it("invalid username should be null", async () => {
    const res = await request(app)
      .get("/profile/getProfile/invalid_username")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe("null");
  });
  it("successfully retrieve a valid profile by username", async () => {
    const res = await request(app)
      .get("/profile/getProfile/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
});

describe("GET /getFollowing", () => {
  it("invalid username should be fail", async () => {
    const res = await request(app)
      .get("/profile/getFollowing/invalid_username")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully retrieve following profiles by username even if non followed", async () => {
    const res = await request(app)
      .get("/profile/getFollowing/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
  it("successfully retrieve following profiles by username if following people", async () => {
    await generateFakeUser(fake_user_two);
    await request(app)
      .post("/profile/follow/")
      .send({ followUsername: fake_user_two.username })
      .set("Authorization", `Bearer ${authToken}`);
    const res = await request(app)
      .get("/profile/getFollowing/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /getFollowers", () => {
  it("invalid username should be fail", async () => {
    const res = await request(app)
      .get("/profile/getFollowers/invalid_username")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully retrieve follower profiles by username even if 0 followers", async () => {
    const res = await request(app)
      .get("/profile/getFollowers/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
  it("successfully retrieve follower profiles by username if followed", async () => {
    await generateFakeUser(fake_user_two);
    await request(app)
      .post("/profile/follow/")
      .send({ followUsername: fake_user_two.username })
      .set("Authorization", `Bearer ${authToken}`);
    const res = await request(app)
      .get("/profile/getFollowers/" + fake_user_two.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("POST /follow", () => {
  it("successfully follow a user", async () => {
    await generateFakeUser(fake_user_two);
    const res = await request(app)
      .post("/profile/follow/")
      .send({ followUsername: fake_user_two.username })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("profile");
    expect(res.body).toHaveProperty("action");
    expect(res.body["action"]).toBe("followed");
  });
  it("successfully unfollow a user after following", async () => {
    await generateFakeUser(fake_user_two);
    await request(app)
      .post("/profile/follow/")
      .send({ followUsername: fake_user_two.username })
      .set("Authorization", `Bearer ${authToken}`);
    const res = await request(app)
      .post("/profile/follow/")
      .send({ followUsername: fake_user_two.username })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("profile");
    expect(res.body).toHaveProperty("action");
    expect(res.body["action"]).toBe("unfollowed");
  });
});

describe("POST /search", () => {
  it("if there is no search query, it should fail", async () => {
    await generateFakeUser(fake_user_two);
    const res = await request(app)
      .post("/profile/search")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("successfully search a user", async () => {
    await generateFakeUser(fake_user_two);
    const res = await request(app)
      .post("/profile/search")
      .send({ query: fake_user_two.username })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it("successfully return no matching users if query doesn't match any users", async () => {
    const res = await request(app)
      .post("/profile/search")
      .send({ query: "invalid" })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
