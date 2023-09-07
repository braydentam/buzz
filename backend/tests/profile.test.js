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
  console.log("REMINDER: HAVE REDIS SERVER RUNNING WHEN RUNNING TESTS");
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
  it("when no users followed, successfully retrieve zero following profiles", async () => {
    const res = await request(app)
      .get("/profile/getFollowing/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
  it("when following users, successfully retrieve following profiles", async () => {
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
  it("invalid username should fail", async () => {
    const res = await request(app)
      .get("/profile/getFollowers/invalid_username")
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(400);
  });
  it("when a user has 0 followers, successfully retrieve zero follower profiles", async () => {
    const res = await request(app)
      .get("/profile/getFollowers/" + fake_user.username)
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
  });
  it("when a user has followers, successfully retrieve follower profiles", async () => {
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
  it("successfully unfollow a user", async () => {
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
  it("when there is no query, search should fail", async () => {
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
  it("when a query doesn't match any users, successfully return no matching users", async () => {
    const res = await request(app)
      .post("/profile/search")
      .send({ query: "invalid" })
      .set("Authorization", `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });
});
