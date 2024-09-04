const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // "unique" para evitar duplicados
  password: { type: String, required: true },
  roles: [{
    ref: 'Role',
    type: mongoose.Schema.Types.ObjectId
  }]
}, {
  timestamps: true,
  versionKey: false,
});

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

userSchema.statics.comparePassword = async (password, receivedPassword) => {
  return await bcrypt.compare(password, receivedPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
