const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require("./routes/users.routes");

const initModels = require('./models/initModels');
const db = require('./utils/database');
const Users = require('./models/users.model');

initModels();
//{ alter: true }
db.sync().then(() => console.log("Base de datos sincronizada"));

const app = express();

app.use(express.json());
app.use(cors());

app.use(userRoutes);

const PORT = process.env.PORT ?? 4000;

app.get('/', (req, res) => {
    res.send('Bienvenido a mi server');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});