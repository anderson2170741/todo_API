const { Sequelize } = require('sequelize');
require('dotenv').config();

const db = new Sequelize(process.env.DB_LINK, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
      ssl: true,
      native:true
    }
});


//const db = new Sequelize({
//    host: process.env.DB_HOST,
//    database: process.env.DB_DATABASE,
//    port: process.env.DB_PORT,
//    username: process.env.DB_USERNAME,
//    password: process.env.DB_PASSWORD,
//    dialect: "postgres",
//    dialectoptions: {
//        ssl: false,
//        native:true,
//        rejectUnauthorized: false
//      },
//    //dialectOptions: { ssl: { require: true, rejectUnauthorized: false } },
//});

module.exports = db;