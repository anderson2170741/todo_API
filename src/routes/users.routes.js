const { Router } = require('express');
const Users = require("../models/users.model");

const { 
    getUserById,
    createUser,
    getAllUsers,
    createTask, 
    deleteTask,
    taskCompletion} = require("../controllers/users.controllers");

const router = Router();

router.get('/users', getAllUsers);

router.get('/users/:id', getUserById);

router.post("/users", createUser);

router.post('/tasks', createTask);

router.delete('/tasks/:id', deleteTask);

router.patch("/tasks/:id/completed", taskCompletion);

module.exports = router;
