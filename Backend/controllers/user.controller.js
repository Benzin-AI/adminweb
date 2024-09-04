const User = require('../models/user');
const Role = require('../models/role');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

// Obtener todos los usuarios
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate('roles');
    res.json(users);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    // Enviar la respuesta con el usuario encontrado
    res.json(user);
  } catch (err) {
    res.status(500).send(err.message);
  }
};
// Agregar un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { password, roles, ...otherFields } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Se requiere una contraseña' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    let assignedRoles = [];
    if (roles) {
      if (!Array.isArray(roles) || roles.some(role => typeof role !== 'string')) {
        return res.status(400).json({ message: 'Roles deben ser un array de nombres de roles' });
      }

      const roleObjects = await Role.find({ name: { $in: roles } });
      if (roleObjects.length === 0) {
        return res.status(400).json({ message: 'Roles inválidos' });
      }
      assignedRoles = roleObjects.map(role => role._id);
    } else {
      const defaultRole = await Role.findOne({ name: 'vendedor' });
      if (defaultRole) {
        assignedRoles.push(defaultRole._id);
      }
    }

    const newUser = new User({
      ...otherFields,
      password: hashedPassword,
      roles: assignedRoles
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Eliminar un usuario por ID
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Actualizar un usuario por ID
const updateUserById = async (req, res) => {
  try {
    const { password, roles, email, ...otherFields } = req.body;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      otherFields.password = hashedPassword;
    }

    // Verificar si el correo electrónico ya está en uso por otro usuario
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
      }
    }

    if (roles) {
      if (!Array.isArray(roles) || roles.some(role => typeof role !== 'string')) {
        return res.status(400).json({ message: 'Roles deben ser un array de nombres de roles' });
      }

      const roleObjects = await Role.find({ name: { $in: roles } });
      if (roleObjects.length === 0) {
        return res.status(400).json({ message: 'Roles inválidos' });
      }
      otherFields.roles = roleObjects.map(role => role._id);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, otherFields, { new: true, runValidators: true }).populate('roles');

    if (!updatedUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).send(err.message);
  }
};



module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  deleteUserById,
  updateUserById,
};
