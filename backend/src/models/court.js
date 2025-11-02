import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Court = sequelize.define("Court", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombreCancha: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  horarioInicio: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  horarioFin: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  diasDisponibles: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  valorHora: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  telefono: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { isNumeric: true, len: [7, 10] }
  },
  direccion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  responsable: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detalles: {
    type: DataTypes.TEXT,
  },
  capacidad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  imagen: {
    type: DataTypes.STRING,
  },
});

export default Court;
