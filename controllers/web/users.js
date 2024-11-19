import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from "../../models/users.js"

async function showHomePage(req, res) {
  res.render("index")
}
async function showRegister(req, res) {
  res.render("users/register")
}

async function showDashboard(req, res) {
  const users = await getAllUsers()
  res.render("users/dashboard", { users })
}

async function showProfile(req, res) {
  const user = await getUserById(Number(req.params.id))

  if (!user) return res.status(404).json({ error: "User not found!" })
  res.render("users/profile", { user })
}

async function register(req, res) {
  const newUser = await addUser(req.body)

  res.redirect("/dashboard")
}

async function update(req, res) {
  const updatedUser = await updateUser(Number(req.params.id), req.body)

  if (!updatedUser) return res.status(404).json({ error: "User not found" })
  res.redirect("/dashboard")
}

async function remove(req, res) {
  const deletedUser = await deleteUser(Number(req.params.id))

  if (!deletedUser) return res.status(404).json({ error: "User not found" })
  res.redirect("/dashboard")
}

export {
  showHomePage,
  showRegister,
  showDashboard,
  showProfile,
  register,
  update,
  remove,
}
