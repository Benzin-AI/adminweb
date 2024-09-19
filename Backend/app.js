const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conexión a MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Conectado a MongoDB Atlas');
    createRoles();
  })
  .catch(err => console.error('Error al conectar a MongoDB Atlas', err));

// Middleware para habilitar CORS
app.use(cors({ origin: ['http://localhost', 'http://localhost:4200'] }));

// Rutas
const userRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');
const authRoutes = require('./routes/auth.routes');
const createRoles = require('./libs/initialSetup');

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;