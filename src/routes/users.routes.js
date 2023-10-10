const { Router } = require("express");
const Users = require("../models/users.model");

const {
  getUserById,
  createUser,
  createCategory,
  getAllUsers,
  createTask,
  deleteTask,
  deleteUser,
  getAllTaks,
  getAllCategories,
  deleteCategories,
  taskCompletion,
  updateUser,
  updateTask
} = require("../controllers/users.controllers");

const router = Router();

router.get("/users", getAllUsers);

router.get("/users/:id", getUserById);

router.get("/tasks", getAllTaks);

router.get("/categories", getAllCategories);

router.post("/users", createUser);

router.post("/categories", createCategory);

router.post("/tasks", createTask);

router.delete("/tasks/:id", deleteTask);

router.delete("/users/:id", deleteUser);

router.delete("/categories/:id", deleteCategories);

router.patch("/tasks/:id/completed", taskCompletion);

router.put('/users/:id', updateUser);

router.put('/tasks/:id', updateTask);







module.exports = router;
