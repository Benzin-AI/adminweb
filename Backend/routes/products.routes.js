const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middlewares/auth.jwt');
const {
  getAllProducts,
  getProductById,
  createProduct,
  deleteProductById,
  updateProductById,
} = require('../controllers/product.controller');

// Obtener todos los productos
router.get('/', verifyToken, getAllProducts);

// Obtener un producto por ID
router.get('/:id', verifyToken, getProductById);

// Agregar un nuevo producto
router.post('/', verifyToken, createProduct);

// Eliminar un producto por ID
router.delete('/:id', verifyToken, deleteProductById);

// Actualizar un producto por ID
router.put('/:id', verifyToken, updateProductById);

module.exports = router;

