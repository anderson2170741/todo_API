const { DataTypes } = require("sequelize");

const db = require("../utils/database");

const Categories = db.define(
  "categories",
  {
    // omito id porque se genera por defecto como pk e increment
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Categories;