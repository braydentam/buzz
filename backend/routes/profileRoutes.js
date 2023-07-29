const express = require("express");
const { viewProfile, follow } = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/viewProfile", viewProfile);
router.post("/follow", follow);

module.exports = router;
