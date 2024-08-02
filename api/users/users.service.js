// /api/users/users.service.js
const bcrypt = require('bcrypt');
const User = require('./users.model');

async function getAll() {
  return User.find();
}

async function get(id) {
  return User.findById(id);
}

async function create(userData) {
  const hashedPassword = await bcrypt.hash(userData.password, 10); // Hachage du mot de passe
  const user = new User({ ...userData, password: hashedPassword });
  await user.save();
  return user;
}

async function update(id, data) {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10); // Hachage du mot de passe lors de la mise à jour
  }
  return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
}

async function deleteUser(id) {
  return User.findByIdAndDelete(id);
}

async function checkPasswordUser(email, password) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    return user._id;
  }
  return null;
}

module.exports = {
  getAll,
  get,
  create,
  update,
  delete: deleteUser,
  checkPasswordUser
};
