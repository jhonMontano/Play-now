import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./user.js";
import Court from "./court.js";

const Reservation = sequelize.define("Reservation", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  horaReserva: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  cantidadHoras: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valorTotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  estado: {
    type: DataTypes.ENUM("Activa", "Cancelada", "Completada"),
    defaultValue: "Activa",
  },
});

export default Reservation;