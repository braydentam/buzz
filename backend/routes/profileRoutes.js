const express = require("express");
const { follow } = require("../controllers/profileController");
const requireAuth = require("../middleware/requireAuth");

const router = express.Router();

router.use(requireAuth);

router.post("/follow", follow);

module.exports = router;
