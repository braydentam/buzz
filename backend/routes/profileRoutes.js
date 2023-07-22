const express = require("express");
const { getProfile, follow } = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.get("/get", getProfile);
router.post("/follow", follow);

module.exports = router;
