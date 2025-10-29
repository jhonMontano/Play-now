import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";

const Mall = sequelize.define("Mall", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombreCentro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ciudad: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Mall.hasOne(User, {
  foreignKey: "idMall",
  as: "administrador",
});

User.belongsTo(Mall, {
  foreignKey: "idMall",
  as: "mall",
});

export default Mall;
