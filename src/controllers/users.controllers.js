const Users = require("../models/users.model");
const userTasks = require("../models/userTasks.model");
const Tasks = require("../models/tasks.model");
const Categories = require("../models/categories.model");

//?==========================================================       Un endpoint para crear usuarios         ====================================//
/**
 * @swagger
 * components:
 *  schemas:
 *    User:
 *      type: object
 *      properties:
 *        username:
 *          type: string
 *          description: the user name
 *        email:
 *          type: string
 *          description: the user email
 *        password:
 *          type: string
 *          description: the user password
 *      required:
 *        - name
 *        - email
 *        - password
 *      example:
 *        username: Anderson
 *        email: andersondurapc@gmail.com
 *        password: 1234
 */

/**
 * @swagger
 * /users:
 *  post: 
 *    summary: create a new user
 *    tags: [User]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *    responses:
 *      200:
 *        description: New user created!
 */

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

/**
 * @swagger
 * /users:
 *  get: 
 *    summary: return all users
 *    tags: [User]
 *    responses:
 *      200:
 *        description: All users!
 *        content:
 *          applicaption/json:
 *            schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/User'
 * 
 *
 */

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

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the user id
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User update!
 *       404:
 *         description: User not faund!
 */

const updateUser = async (req, res) => {
  try {
    const { id } = req.params; // Obtén el ID del usuario a editar desde los parámetros de la URL
    const updatedUserData = req.body; // Datos actualizados del usuario

    const user = await Users.findByPk(id);

    if (!user) {
      return res.status(404).json({ error });
    }

    // Actualiza los datos del usuario
    await user.update(updatedUserData);

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

//?========================        Un endpoint que permita eliminar users        ===========//

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User deleted
 *     responses:
 *       200:
 *         description: User delete!
 *       404:
 *         description: User not faund!
 */

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

/**
 * @swagger
 * components:
 *  schemas:
 *    Task:
 *      type: object
 *      properties:
 *        users:
 *          type: array
 *          description: user id
 *        title:
 *          type: string
 *          description: task title
 *        description:
 *          type: string
 *          description: task description
 *        categoryId:
 *          type: integer
 *          description: category id
 *      required:
 *        - users
 *        - title
 *        - categoryId
 *      example:
 *        users: [1, 3]
 *        title: Pokédex
 *        description: Crear una app que proporciona información detallada sobre los Pokémon tales como como sus características, tipos y más.
 *        categoryId: 1
 */

/**
 * @swagger
 * /tasks:
 *  post: 
 *    summary: create a new task
 *    tags: [Task]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Task'
 *    responses:
 *      201:
 *        description: New task created!
 */

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

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Find all the tasks of a user
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the user to retrieve
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: All users!
 *       404:
 *         description: User not faund!
 */

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

/**
 * @swagger
 * /tasks:
 *  get: 
 *    summary: return all tasks
 *    tags: [Task]
 *    responses:
 *      200:
 *        description: All task!
 *        content:
 *          applicaption/json:
 *            schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/Task'
 * 
 *
 */


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

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: the task id
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task update!
 *       404:
 *         description: Task not faund!
 */

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTaskData = req.body;

    const task = await Tasks.findByPk(id);

    if (!task) {
      return res.status(404).json({ error });
    }

    await task.update(updatedTaskData);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json(error);
  }
};

//?========================        Un endpoint que permita eliminar tareas         ===========//

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Task deleted
 *     responses:
 *       200:
 *         description: Task delete!
 *       404:
 *         description: Task not faund!
 */

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

/**
 * @swagger
 * components:
 *  schemas:
 *    Category:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          description: the category name
 *      required:
 *        - name
 *      example:
 *        name: Frontend
 */

/**
 * @swagger
 * /categories:
 *  post: 
 *    summary: create a new categories
 *    tags: [Category]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            $ref: '#/components/schemas/Category'
 *    responses:
 *      201:
 *        description: New category created!
 */

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

/**
 * @swagger
 * /categories:
 *  get: 
 *    summary: return all categories
 *    tags: [Category]
 *    responses:
 *      200:
 *        description: All categories!
 *        content:
 *          applicaption/json:
 *            schema:
 *              type: array
 *              items:
 *              $ref: '#/components/schemas/Category'
 * 
 *
 */

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

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Category deleted
 *     responses:
 *       200:
 *         description: Category delete!
 *       404:
 *         description: Category not faund!
 */

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

/**
 * @swagger
 * /tasks/{id}/completed:
 *   patch:
 *     summary: Update task completion status
 *     tags: [Task]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: string
 *         required: true
 *         description: the task id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: boolean
 *                 description: New completion status (true or false)
 *             required:
 *               - completed
 *     responses:
 *       200:
 *         description: Task completion status updated successfully
 *       404:
 *         description: Task not found
 */

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
