const express = require('express')
const { createBuzz, getAllBuzz } = require('../controllers/buzzController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

router.use(requireAuth)

router.post('/create',createBuzz)

router.get('/getAll', getAllBuzz)

module.exports = router