const User = require('../models/user');
const Role = require('../models/role');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signUp = async (req, res) => {
  const { name, email, password, roles } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encriptar la contraseña
    const encryptedPassword = await User.encryptPassword(password);

    // Crear nuevo usuario con la contraseña cifrada
    const newUser = new User({
      name,
      email,
      password: encryptedPassword,
      roles
    });

    if (roles && roles.length > 0) {
      // Buscar los roles especificados
      const foundRoles = await Role.find({ name: { $in: roles } });

      if (foundRoles.length > 0) {
        // Si se encuentran roles, asignarlos al usuario
        newUser.roles = foundRoles.map(role => role._id);
      } else {
        console.log('Roles no encontrados, asignando rol por defecto "vendedor".');
        const defaultRole = await Role.findOne({ name: 'vendedor' });
        if (!defaultRole) {
          return res.status(500).json({ message: 'Rol por defecto no encontrado' });
        }
        newUser.roles = [defaultRole._id];
      }
    } else {
      console.log('No se especificaron roles, asignando rol por defecto "vendedor".');
      // Asignar rol por defecto "vendedor" si no se especifican roles
      const defaultRole = await Role.findOne({ name: 'vendedor' });
      if (!defaultRole) {
        return res.status(500).json({ message: 'Rol por defecto no encontrado' });
      }
      newUser.roles = [defaultRole._id];
    }

    // Guardar el nuevo usuario en la base de datos
    const savedUser = await newUser.save();

    // Generar un token JWT
    const token = jwt.sign({ id: savedUser._id }, config.SECRET, {
      expiresIn: 86400 // 24 horas
    });

    // Responder con el token y el usuario
    res.status(201).json({ token, user: savedUser });
  } catch (err) {
    console.error('Error en signUp:', err); // Log del error para debugging
    res.status(500).send({ message: err.message }); // Manejo de errores
  }
};

exports.signIn = async (req, res) => {
  try {
    // Buscar el usuario por email e incluir los roles en la consulta
    const userFound = await User.findOne({ email: req.body.email }).populate("roles");

    if (!userFound) return res.status(400).json({ message: "Usuario no encontrado" });

    // Comparar la contraseña
    const matchPassword = await User.comparePassword(req.body.password, userFound.password);

    if (!matchPassword) return res.status(401).json({ token: null, message: 'Contraseña inválida' });

    // Generar un token JWT
    const token = jwt.sign({ id: userFound._id }, config.SECRET, {
      expiresIn: 86400 // 24 horas
    });

    // Devolver el usuario y el token
    res.json({
      user: {
        email: userFound.email,
        name: userFound.name,
        role: userFound.roles.map(role => role.name).join(', ')
      },
      token
    });
  } catch (err) {
    console.error('Error en signIn:', err); // Log del error para debugging
    res.status(500).json({ message: err.message }); // Manejo de errores
  }
};
