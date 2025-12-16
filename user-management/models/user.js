const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    role: {
      type: DataTypes.ENUM("USER", "ADMIN", "SUPERADMIN"),
      defaultValue: "USER"
    },
    department: DataTypes.STRING,
    salary: DataTypes.FLOAT
  });
};
