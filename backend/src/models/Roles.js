import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Roles = sequelize.define("Roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default Roles;
