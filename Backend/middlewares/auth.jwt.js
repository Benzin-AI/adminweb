const jwt = require('jsonwebtoken');
const config = require('../config'); 
const User = require('../models/user');
const Role = require('../models/role');
require('dotenv').config();

// Middleware para verificar el token JWT
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];

    if (!token) {
      return res.status(403).json({ message: 'No se proporcionó un token.' });
    }

    const decoded = jwt.verify(token, config.SECRET);

    req.userId = decoded.id; // Asigna el ID del usuario a la solicitud
    next();
  } catch (error) {
    return res.status(401).json({ message: 'No autorizado!' });
  }
};

// Middleware para verificar si el usuario es admin
const isAdmin = async (req, res, next) => {
  console.log('Verificando admin...');

  try {
    const token = req.headers['x-access-token'];
    if (!token) {
      console.log('No token provided');
      return res.status(403).json({ message: 'No token provided!' });
    }

    const decoded = jwt.verify(token, config.SECRET);
    req.userId = decoded.id;

    const user = await User.findById(req.userId);
    if (!user) {
      console.log('Usuario no encontrado');
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    const roles = await Role.find({ _id: { $in: user.roles } });
    if (roles.some(role => role.name === 'admin')) {
      console.log('Usuario es admin');
      next();
    } else {

      return res.status(403).json({ message: 'Require ser administrador' });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


const SECRET = process.env.SECRET;

function verifySecret(req, res, next) {
  const { secret } = req.headers;

  if (secret && secret === SECRET) {
    next();
  } else {
    res.status(403).json({ message: 'Debe proporcionar clave secreta para crear usuario' });
  }
}



module.exports = { verifyToken, isAdmin, verifySecret};
