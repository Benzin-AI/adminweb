const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middlewares/auth.jwt');
const {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
 
} = require('../controllers/user.controller');

// Obtener todos los usuarios
router.get('/', verifyToken, isAdmin, getAllUsers);

// Obtener un usuario por ID
router.get('/:id', verifyToken, isAdmin, getUserById);

// Agregar un nuevo usuario
router.post('/', verifyToken, isAdmin, createUser);

// Eliminar un usuario por ID
router.delete('/:id', verifyToken, isAdmin, deleteUserById);

// Actualizar un usuario por ID
router.put('/:id', verifyToken, isAdmin, updateUserById);



module.exports = router;
