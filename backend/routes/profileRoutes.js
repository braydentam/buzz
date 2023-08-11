const express = require("express");
const { viewProfile, follow, viewFollowers, viewFollowing, search } = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/viewProfile", viewProfile);
router.post("/follow", follow);
router.post('/viewFollowing', viewFollowing);
router.post('/viewFollowers', viewFollowers);
router.post('/search', search);

module.exports = router;
