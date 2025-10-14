import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  tipoDocumento: {
    type: DataTypes.ENUM("CC", "NIT"),
    allowNull: false,
  },
  numeroDocumento: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  primerNombre: DataTypes.STRING,
  segundoNombre: DataTypes.STRING,
  primerApellido: DataTypes.STRING,
  segundoApellido: DataTypes.STRING,
  razonSocial: DataTypes.STRING,
  correo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  celular: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
