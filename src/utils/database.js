const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialect: "postgres",
    ddialectOptions: {
        ssl: true, // Habilitar SSL
        rejectUnauthorized: false, // Deshabilitar la verificación de certificados
    },
    //dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
});

module.exports = db;