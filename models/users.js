import fs from "fs/promises"
import path from "path"

const filePath = path.resolve("data/user.json")

async function getAllUsers() {
  const data = await fs.readFile(filePath, "utf-8")
  return JSON.parse(data)
}

async function getUserById(id) {
  const users = await getAllUsers()
  return users.find((user) => user.id === id)
}

async function addUser(user) {
  const users = await getAllUsers()
  const newUser = { id: users.length + 1, ...user }
  users.push(newUser)

  await fs.writeFile(filePath, JSON.stringify(users, null, 2))
  return newUser
}
async function updateUser(id, updatedData) {
  const users = await getAllUsers()
  const userIndex = users.findIndex((user) => user.id === id)
  users[userIndex] = { ...users[userIndex], ...updatedData }

  await fs.writeFile(filePath, JSON.stringify(users, null, 2))
  return users[userIndex]
}

async function deleteUser(id) {
  const users = await getAllUsers()
  const userIndex = users.findIndex((user) => user.id === id)
  const [deletedUser] = users.splice(userIndex, 1)

  await fs.writeFile(filePath, JSON.stringify(users, null, 2))
  return deleteUser
}

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
}
