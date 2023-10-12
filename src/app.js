const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require("./routes/users.routes");

const initModels = require('./models/initModels');
const db = require('./utils/database');
const Users = require('./models/users.model');
const path = require("path")

// swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerSpec = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Todo API",
            description: "API para una aplicación de todo list, con sus usuarios y tareas, donde cada tarea tiene su categoría.",
            contact: {
              email: "andersonduranpc@gmail.com"
            },
            license: {
              name: "Anderson Durán 2.0",
              url: "https://github.com/anderson2170741/todo_API.git"
            },
            version: "1.0.0",
          },
        servers: [
            {
                url: "https://todo-api-v07r.onrender.com"
            }
        ]
    },
    apis:[`${path.join(__dirname, "./controllers/*.js")}`]
}

initModels();
//{ alter: true }
db.sync().then(() => console.log("Base de datos sincronizada"));

const app = express();

app.use(express.json());
app.use(cors());
app.use(userRoutes);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)))

const PORT = process.env.PORT ?? 4000;

app.get('/', (req, res) => {
    res.send('Bienvenido a mi server');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});