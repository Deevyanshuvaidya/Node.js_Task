const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash("superadmin123", 10);

    await queryInterface.bulkInsert("Users", [
      {
        name: "Super Admin",
        email: "superadmin@gmail.com",
        password: hashedPassword,
        role: "SUPERADMIN",
        department: "Management",
        salary: 150000,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("Users", {
      email: "superadmin@gmail.com"
    });
  }
};
