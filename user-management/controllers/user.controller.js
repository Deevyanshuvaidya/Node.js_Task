const { User } = require("../models");

exports.getMe = async (req, res) => {
  const user = await User.findByPk(req.user.id);
  res.json(user);
};

exports.createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

exports.updateUser = async (req, res) => {
  await User.update(req.body, { where: { id: req.params.id } });
  res.json({ message: "Updated" });
};

exports.deleteUser = async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.json({ message: "Deleted" });
};
