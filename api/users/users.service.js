const User = require('./users.model');
const bcrypt = require('bcrypt');

async function getAll() {
  return User.find();
}

async function get(id) {
  return User.findById(id);
}

async function create(userData) {
  const user = new User(userData);
  await user.save();
  return user;
}

async function update(id, data) {
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

async function findByEmail(email) {
  return User.findOne({ email: email.toLowerCase() });
}

async function checkPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

module.exports = {
  getAll,
  get,
  create,
  update,
  delete: deleteUser,
  findByEmail,
  checkPassword
};