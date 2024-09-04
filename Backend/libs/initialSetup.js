const Role = require('../models/role');

const createRoles = async () => {
  try {
    const count = await Role.estimatedDocumentCount();

    if (count > 0) return;

    // Crea los roles por defecto
    const values = await Promise.all([
      new Role({ name: 'vendedor' }).save(),
      new Role({ name: 'admin' }).save(),
    ]);

    console.log('Roles creados:', values);
  } catch (error) {
    console.error('Error al crear roles:', error);
  }
};

module.exports = createRoles;
