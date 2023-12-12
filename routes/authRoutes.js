const { Router } = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/authMiddleware");
const router = Router();

// Routes for authentication
router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);
router.get("/profil", authController.profil_get);

// Routes for jobs
router.get("/createJob", requireAuth, authController.createJob_get);
router.post("/createJob", requireAuth, authController.createJob_post);
router.get(
  "/dashboard",
  requireAuth,
  authController.dashboardViewNote_get,
  authController.dashboard_get
);
router.get("/renderJob/:id", requireAuth, authController.renderJob_get);
router.delete("/delete/:id", requireAuth, authController.deleteJob_delete);
router.get("/updateJob/:id", requireAuth, authController.updateJob_get);
router.put("/updateJob/:id", requireAuth, authController.updateJob_put);

module.exports = router;
