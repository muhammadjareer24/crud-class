import express from "express"
import { getAll, getOne } from "../../controllers/web/users.js" // Example: Assume separate web controllers

const router = express.Router()

router.get("/", (req, res) => res.render("index")) // Homepage
router.get("/dashboard", getAll) // Render dashboard
router.get("/users/:id", getOne) // Render user profile

export default router
