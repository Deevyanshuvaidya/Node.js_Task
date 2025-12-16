const { Sequelize } = require("sequelize");
const config = require("../config/config")["development"];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

// Import models
const UserModel = require("./user");

const User = UserModel(sequelize);

// Export everything
module.exports = {
  sequelize,
  User
};
