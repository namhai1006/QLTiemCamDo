const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    contact: String,
    address: String
  }
});

module.exports = mongoose.model('Employee', employeeSchema);
