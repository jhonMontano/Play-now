import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import bcrypt from "bcryptjs";

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
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idRol: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  idMall: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
});

User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

export default User;
