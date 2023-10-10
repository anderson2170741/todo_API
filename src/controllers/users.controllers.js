const Users = require("../models/users.model");
const userTasks = require("../models/userTasks.model");
const Tasks = require("../models/tasks.model");
const Categories = require("../models/categories.model");

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

//?==========================================================       Un endpoint para obtener a los users        ====================================//

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

//?========================        Un endpoint que permita editar la información de los users        ===========//

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtén el ID del usuario a editar desde los parámetros de la URL
    const updatedUserData = req.body; // Datos actualizados del usuario

    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Actualiza los datos del usuario
    await user.update(updatedUserData);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

//?========================        Un endpoint que permita eliminar users        ===========//

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Users.destroy({
      where: { id }, 
    });
    res.status(204).send();
  } catch (error) {
    res.status(400).json(error);
  }
};

//?=========   un endpoint para que un usuario pueda crear tareas ( Cuando un usuario crea una tarea debe seleccionarse la categoria a la que esta pertenece)  categoryId   ====//

const createTask = async (req, res) => {
  try {
    const { users, title, description, categoryId } = req.body;

    // Verifica que la lista de usuarios no esté vacía
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res
        .status(400)
        .json({ error: "La lista de usuarios es inválida o está vacía" });
    }

    const createdTasks = [];

    for (const userId of users) {
      const user = await Users.findByPk(userId);
      if (!user) {
        return res
          .status(404)
          .json({ error: `Usuario con ID ${userId} no encontrado` });
      }

      const createdTask = await Tasks.create({
        title,
        description,
        completed: false,
        categoryId,
        userId, // Asocia la tarea al usuario actual
      });

      // Crea la entrada en la tabla pivote userTasks
      await userTasks.create({
        userId,
        taskId: createdTask.id, // Obtiene el ID de la tarea recién creada
      });

      createdTasks.push(createdTask);
    }

    res.status(201).json(createdTasks);
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

//?==========================================================       Un endpoint para obtener a las tasks       ====================================//

const getAllTaks = async (req, res) => {
  try {
    const AllTaks = await Tasks.findAll({
      attributes: {},
    });
    res.json(AllTaks);
  } catch (error) {
    res.status(400).json(error);
  }
};

//?========================        Un endpoint que permita editar la información de las tasks        ===========//

const updateTask = async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedTaskData = req.body; 

    const task = await Tasks.findByPk(id);

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    await task.update(updatedTaskData);

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
        taskId: id, 
      },
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

//?==========================================================       Un endpoint para crear categories        ====================================//

const createCategory = async (req, res) => {
  try {
    const newCategory = req.body; //* name

    const createdCategory = await Categories.create(newCategory);

    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json(error);
  }
};

//?==========================================================       Un endpoint para obtener a las categories        ====================================//

const getAllCategories = async (req, res) => {
  try {
    const allCategories = await Categories.findAll({
      attributes: {},
    });
    res.json(allCategories);
  } catch (error) {
    res.status(400).json(error);
  }
};

//?========================        Un endpoint que permita eliminar categories         ===========//

const deleteCategories = async (req, res) => {
  try {
    const { id } = req.params;
    await Categories.destroy({
      where: { id },
    });
    res.status(204).send();
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

module.exports = {
  getAllUsers,
  getUserById,
  getAllTaks,
  getAllCategories,
  createUser,
  createCategory,
  createTask,
  deleteTask,
  deleteUser,
  deleteCategories,
  taskCompletion,
  updateUser,
  updateTask,
};
