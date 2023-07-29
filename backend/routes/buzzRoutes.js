const express = require("express");
const {
  createBuzz,
  getAllBuzz,
  getById,
  getByUser,
  like,
  getFollowing,
  comments,
} = require("../controllers/buzzController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/create", createBuzz);

router.get("/getAll", getAllBuzz);

router.get("/getById/:id", getById);

router.get("/getByUser/:id", getByUser);

router.post("/like", like);

router.get("/getFollowing", getFollowing);

router.post("/comments", comments);

module.exports = router;
