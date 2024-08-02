const bcrypt = require('bcrypt');
const User = require('./users.model');

async function getAll() {
  return User.find();
}

async function get(id) {
  return User.findById(id);
}

async function create(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const user = new User({ ...userData, password: hashedPassword });
  await user.save();
  return user;
}

async function update(id, data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

async function findByEmail(email) {
  return User.findOne({ email });
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
