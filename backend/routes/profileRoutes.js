const express = require("express");
const {
  getProfile,
  follow,
  getFollowers,
  getFollowing,
  search,
} = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/getProfile/:username", getProfile);
router.post("/follow", follow);
router.get("/getFollowing/:username", getFollowing);
router.get("/getFollowers/:username", getFollowers);
router.post("/search", search);

module.exports = router;
