const Users = require("../models/users.model");
const userTasks = require("../models/userTasks.model");
const Tasks = require("../models/tasks.model");
const Categories = require("../models/categories.model");

const getAllUsers = async (req, res) => {
  try {
    const allUsers = await Users.findAll({
      attributes: {
        exclude: ["password"],
      },
    });
    res.json(allUsers);
  } catch (error) {
    res.status(400).json(error);
  }
};

//?==========================================================       Un endpoint para crear usuarios         ====================================//

const createUser = async (req, res) => {
  try {
    const newUser = req.body; //* {username, email, password}

    await Users.create(newUser); // * "username":"alli", "email": "allison@gmail.com", "password": "1234"

    res.status(201).send(newUser);
  } catch (error) {
    res.status(400).json(error);
  }
};

//?=========   un endpoint para que un usuario pueda crear tareas ( Cuando un usuario crea una tarea debe seleccionarse la categoria a la que esta pertenece)  categoryId   ====//

const createTask = async (req, res) => {
  try {
    const { userId, title, description, categoryId } = req.body;

    const user = await Users.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const createdTask = await Tasks.create({
      title,
      description,
      completed: false,
      categoryId,
      userId, // Asociar la tarea al usuario
    });

    // Crear la entrada en la tabla pivote userTasks
    await userTasks.create({
      userId,
      taskId: createdTask.id, // Obtener el id de la tarea recién creada
    });

    res.status(201).send(createdTask);
  } catch (error) {
    res.status(500).json(error);
  }
};

//?===============================     Un endpoint para obtener todas las tareas de un usuario incluidas sus categorias ( filtros (where), include)    =====================//

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findOne({
      where: { id },
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: userTasks,
          attributes: {
            exclude: ["userId", "taskId"],
          },
          include: [
            {
              model: Tasks,
              attributes: {
                exclude: ["categoryId"],
              },
              include: [
                {
                  model: Categories,
                },
              ],
            },
          ],
        },
      ],
    });

    res.json(user);
  } catch (error) {
    res.status(400).json(error);
  }
};

//?===   Un endpoint para que un usuario pueda cambiar el atributo completed de una tarea (false a true o viceversa ) por defecto una tarea se crea con el atributo completed false    ====//

const taskCompletion = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Tasks.findByPk(id);
    if (!task) {
      return res.status(404).json({ error });
    }

    task.completed = !task.completed;
    await task.save();

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

//?========================        Un endpoint que permita eliminar tareas         ===========//

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const userTaskToDelete = await userTasks.findOne({
      where: {
        taskId: id // Cambia taskId por el nombre correcto de la columna en tu modelo userTasks
      }
    });

    if (!userTaskToDelete) {
      return res.status(404).json({ error });
    }

    await userTaskToDelete.destroy();

    res.status(204).send();
  } catch (error) {
    res.status(500).json(error);
  }
};


module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  createTask,
  deleteTask,
  taskCompletion
};
