import sequelize from "../config/database.js";
import { DataTypes } from "sequelize";

const Roles = sequelize.define("Roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
}
});

export default Roles;