const express = require("express");
const {
  createBuzz,
  getAllBuzz,
  getById,
  getByUser,
  deleteBuzz,
  like,
  getFollowing,
  comments,
  hasPosted,
} = require("../controllers/buzzController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/create", createBuzz);

router.get("/getAll", getAllBuzz);

router.get("/getById/:id", getById);

router.get("/getByUser/:id", getByUser);

router.delete("/delete", deleteBuzz);

router.post("/like", like);

router.get("/getFollowing", getFollowing);

router.post("/comments", comments);

router.get("/hasPosted", hasPosted);

module.exports = router;
