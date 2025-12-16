const router = require("express").Router();
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const user = require("../controllers/user.controller");

// USER
router.get("/me", auth, user.getMe);

// ADMIN
router.post("/", auth, role("ADMIN", "SUPERADMIN"), user.createUser);

// SUPERADMIN
router.put("/:id", auth, role("SUPERADMIN"), user.updateUser);
router.delete("/:id", auth, role("SUPERADMIN"), user.deleteUser);

module.exports = router;
