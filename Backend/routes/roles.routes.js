const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');

// Ruta para obtener todos los roles
router.get('/', roleController.getRoles);

module.exports = router;
