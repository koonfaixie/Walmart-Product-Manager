const express = require('express');
const router = express.Router();

const productController = require('../controllers').product;

"use strict";

router.get('/product/', productController.retrieve);
router.post('/product/', productController.update);

module.exports = router;
