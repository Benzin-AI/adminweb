const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const roleSchema = new Schema({
  name: { type: String, required: true }
}, {
  versionKey: false
});

module.exports = model('Role', roleSchema);
