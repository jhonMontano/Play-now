import Reservation from "../models/reservation.js";
import Court from "../models/court.js";
import Mall from "../models/mall.js";

export const createReservationService = async (user, data) => {
  const { courtId, horaReserva, cantidadHoras } = data;

  if (!courtId || !horaReserva || !cantidadHoras) {
    throw new Error("Los campos 'courtId', 'horaReserva' y 'cantidadHoras' son obligatorios");
  }

  const court = await Court.findByPk(courtId);
  if (!court) throw new Error("La cancha seleccionada no existe");

  const existing = await Reservation.findOne({
    where: { courtId, horaReserva, estado: "Activa" },
  });
  if (existing) {
    throw new Error("La cancha ya está reservada para esa hora");
  }

  const valorTotal = court.valorHora * cantidadHoras;

  const newReservation = await Reservation.create({
    courtId,
    userId: user.id,
    horaReserva,
    cantidadHoras,
    valorTotal,
  });

  return {
    message: "Reserva creada exitosamente",
    reserva: newReservation,
    cancha: court.nombreCancha,
  };
};

export const getReservationsService = async (user) => {
  return await Reservation.findAll({
    where: { userId: user.id },
    include: {
      model: Court,
      as: "cancha",
      attributes: ["nombreCancha", "direccion", "valorHora"],
    },
    order: [["id", "DESC"]],
  });
};

export const getReservationsByMallService = async (admin, mallId) => {
  if (admin.idRol !== 2) throw new Error("Solo el administrador puede ver las reservas de su centro comercial");

  if (admin.idMall !== Number(mallId)) {
    throw new Error("No tienes permisos para acceder a este centro comercial");
  }

  const reservas = await Reservation.findAll({
    include: [
      {
        model: Court,
        as: "cancha",
        attributes: ["id", "nombreCancha", "direccion", "valorHora"],
        where: { mallId },
      },
      {
        model: Mall,
        as: "mall",
        attributes: ["id", "nombreCentro"],
      },
    ],
    order: [["id", "DESC"]],
  });

  return reservas;
};

export const cancelReservationService = async (user, id) => {
  const reserva = await Reservation.findByPk(id);
  if (!reserva) throw new Error("Reserva no encontrada");

  if (reserva.userId !== user.id && user.idRol !== 2) {
    throw new Error("No tienes permisos para cancelar esta reserva");
  }

  reserva.estado = "Cancelada";
  await reserva.save();

  return { message: "Reserva cancelada correctamente" };
};
