const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/', adminController.getJson);

module.exports = router;