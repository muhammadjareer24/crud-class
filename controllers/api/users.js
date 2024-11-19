import {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from "../../models/users.js"

async function getAll(req, res) {
  const users = await getAllUsers()
  res.json(users)
}

async function getOne(req, res) {
  const user = await getUserById(Number(req.params.id))

  if (!user) return res.status(404).json({ error: "User not found!" })
  res.json(user)
}

async function create(req, res) {
  const newUser = await addUser(req.body)

  res.status(201).json({ status: "Success", user: newUser })
}

async function update(req, res) {
  const updatedUser = await updateUser(Number(req.params.id), req.body)

  if (!updatedUser) return res.status(404).json({ error: "User not found" })
  res.json({ status: "Updated", user: updatedUser })
}

async function remove(req, res) {
  const deletedUser = await deleteUser(Number(req.params.id))

  if (!deletedUser) return res.status(404).json({ error: "User not found" })
  res.json({ status: "Updated", user: deletedUser })
}

export { getAll, getOne, create, update, remove }
