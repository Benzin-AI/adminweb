const Role = require('../models/role');

// Controlador para obtener todos los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
};
