const { DataTypes } = require("sequelize");

const db = require("../utils/database");

const Tasks = db.define(
  "tasks",
  {
    // omito id porque se genera por defecto como pk e increment
    title: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN, // Cambio de tipo a BOOLEAN
      allowNull: false,
      defaultValue: false, // Valor predeterminado a false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Tasks;