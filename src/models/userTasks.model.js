const { DataTypes } = require("sequelize");

const db = require("../utils/database");

const userTasks = db.define(
  "userTasks",
  {
    // omito id porque se genera por defecto como pk e increment
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = userTasks;
