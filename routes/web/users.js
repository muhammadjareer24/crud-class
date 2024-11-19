import express from "express"
import {
  showHomePage,
  showRegister,
  showDashboard,
  showProfile,
  register,
  update,
  remove,
} from "../../controllers/web/users.js"

const router = express.Router()

router.get("/", showHomePage)
router.get("/dashboard", showDashboard)
router.get("/register", showRegister)
router.get("/users/:id", showProfile)
router.post("/users", register)
router.patch("/users/:id", update)
router.delete("/users/:id", remove)

export default router
