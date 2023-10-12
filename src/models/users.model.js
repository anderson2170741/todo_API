const { DataTypes } = require("sequelize");

const db = require("../utils/database");

const Users = db.define(
  "users",      
  {
    // omito id porque se genera por defecto como pk e increment
    username: {
      type: DataTypes.STRING(30),
      unique: true,
      allowNull: true,
    },
    email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
  },
  {
    timestamps: false,
  }
);

module.exports = Users;
