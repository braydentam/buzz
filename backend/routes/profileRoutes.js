const express = require("express");
const { viewProfile, follow, getFollowing, getFollowers } = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/viewProfile", viewProfile);
router.post("/follow", follow);
router.get('/getFollowing', getFollowing);
router.get('/getFollowers', getFollowers);

module.exports = router;
