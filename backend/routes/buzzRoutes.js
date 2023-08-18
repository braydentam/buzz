const express = require("express");
const {
  createBuzz,
  getAll,
  getById,
  getByUsername,
  deleteBuzz,
  likeBuzz,
  getFollowing,
  getComments,
  hasPosted,
} = require("../controllers/buzzController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/getAll", getAll);
router.get("/getById/:id", getById);
router.get("/getByUsername/:username", getByUsername);
router.get("/getFollowing", getFollowing);
router.get("/getComments/:parentID", getComments);
router.get("/hasPosted", hasPosted);

router.post("/create", createBuzz);
router.post("/like", likeBuzz);

router.delete("/delete", deleteBuzz);

module.exports = router;
