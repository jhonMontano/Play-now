import Reservation from "../models/reservation.js";
import Court from "../models/court.js";
import Mall from "../models/mall.js";
import User from "../models/user.js";

const validarHorarioCancha = (cancha, horaReserva, cantidadHoras, fechaReserva) => {
  const [horaInicioH, horaInicioM] = cancha.horarioInicio.split(':').map(Number);
  const [horaFinH, horaFinM] = cancha.horarioFin.split(':').map(Number);
  const [horaReservaH, horaReservaM] = horaReserva.split(':').map(Number);
  
  const minutosInicio = horaInicioH * 60 + horaInicioM;
  const minutosFin = horaFinH * 60 + horaFinM;
  const minutosReserva = horaReservaH * 60 + horaReservaM;
  const minutosFinReserva = minutosReserva + (cantidadHoras * 60);
  
  if (minutosReserva < minutosInicio || minutosFinReserva > minutosFin) {
    throw new Error(`La cancha solo está disponible de ${cancha.horarioInicio} a ${cancha.horarioFin}`);
  }
  
  const ahora = new Date();
  const fechaHoraReserva = new Date(`${fechaReserva}T${horaReserva}`);
  if (fechaHoraReserva < ahora) {
    throw new Error("No se pueden hacer reservas en fechas/horas pasadas");
  }
  
  return true;
};

const validarDiasOperacion = (cancha, fechaReserva) => {
  const fecha = new Date(fechaReserva);
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const diaReserva = diasSemana[fecha.getDay()];
  
  const diasDisponibles = cancha.diasDisponibles.split(',').map(dia => dia.trim());
  
  if (!diasDisponibles.includes(diaReserva)) {
    throw new Error(`La cancha no opera los ${diaReserva}. Días disponibles: ${cancha.diasDisponibles}`);
  }
  
  return true;
};

export const createReservationService = async (user, data) => {
  const { courtId, fechaReserva, horaReserva, cantidadHoras } = data;

  if (user.idRol !== 3) {
    throw new Error("Solo los usuarios pueden realizar reservas");
  }

  if (!courtId || !fechaReserva || !horaReserva || !cantidadHoras) {
    throw new Error("Los campos 'courtId', 'fechaReserva', 'horaReserva' y 'cantidadHoras' son obligatorios");
  }

  if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(horaReserva)) {
    throw new Error("Formato de hora inválido. Use HH:MM (24 horas)");
  }

  if (cantidadHoras < 1 || cantidadHoras > 8) {
    throw new Error("La cantidad de horas debe estar entre 1 y 8");
  }

  const court = await Court.findByPk(courtId, {
    include: {
      model: Mall,
      as: 'mall',
      attributes: ['id', 'nombreCentro']
    }
  });
  
  if (!court) throw new Error("La cancha seleccionada no existe");

  validarHorarioCancha(court, horaReserva, cantidadHoras, fechaReserva);
  
  validarDiasOperacion(court, fechaReserva);

  const existing = await Reservation.findOne({
    where: { 
      courtId, 
      fechaReserva,
      horaReserva, 
      estado: "Activa" 
    },
  });
  
  if (existing) {
    throw new Error("La cancha ya está reservada para esa fecha y hora");
  }

  const reservasSolapadas = await Reservation.findAll({
    where: { 
      courtId, 
      fechaReserva,
      estado: "Activa" 
    },
  });

  const [horaReservaH, horaReservaM] = horaReserva.split(':').map(Number);
  const minutosInicioReserva = horaReservaH * 60 + horaReservaM;
  const minutosFinReserva = minutosInicioReserva + (cantidadHoras * 60);

  for (const reserva of reservasSolapadas) {
    const [horaExistenteH, horaExistenteM] = reserva.horaReserva.split(':').map(Number);
    const minutosInicioExistente = horaExistenteH * 60 + horaExistenteM;
    const minutosFinExistente = minutosInicioExistente + (reserva.cantidadHoras * 60);
    
    if (
      (minutosInicioReserva >= minutosInicioExistente && minutosInicioReserva < minutosFinExistente) ||
      (minutosFinReserva > minutosInicioExistente && minutosFinReserva <= minutosFinExistente) ||
      (minutosInicioReserva <= minutosInicioExistente && minutosFinReserva >= minutosFinExistente)
    ) {
      throw new Error(`La cancha ya está reservada de ${reserva.horaReserva} a ${reserva.cantidadHoras} horas`);
    }
  }

  const valorTotal = court.valorHora * cantidadHoras;

  const newReservation = await Reservation.create({
    courtId,
    userId: user.id,
    fechaReserva,
    horaReserva,
    cantidadHoras,
    valorTotal,
  });

  const reservaCompleta = await Reservation.findByPk(newReservation.id, {
    include: [
      {
        model: Court,
        as: "cancha",
        attributes: ["id", "nombreCancha", "direccion", "valorHora", "horarioInicio", "horarioFin", "diasDisponibles"],
        include: [{
          model: Mall,
          as: "mall",
          attributes: ["id", "nombreCentro"]
        }]
      },
      {
        model: User,
        as: "cliente",
        attributes: ["id", "primerNombre", "primerApellido", "correo", "celular"]
      }
    ]
  });

  return {
    message: "Reserva creada exitosamente",
    reserva: reservaCompleta,
  };
};

export const getReservationsService = async (user) => {
  if (user.idRol === 3) {
    return await Reservation.findAll({
      where: { userId: user.id },
      include: [
        {
          model: Court,
          as: "cancha",
          attributes: ["id", "nombreCancha", "direccion", "valorHora", "horarioInicio", "horarioFin"],
          include: [{
            model: Mall,
            as: "mall",
            attributes: ["id", "nombreCentro", "ciudad"]
          }]
        }
      ],
      order: [["fechaReserva", "DESC"], ["horaReserva", "ASC"]],
    });
  }
  
  else if (user.idRol === 2) {
    if (!user.idMall) {
      throw new Error("El administrador no tiene un centro comercial asociado");
    }

    return await Reservation.findAll({
      include: [
        {
          model: Court,
          as: "cancha",
          attributes: ["id", "nombreCancha", "direccion", "valorHora", "horarioInicio", "horarioFin"],
          where: { mallId: user.idMall },
          include: [{
            model: Mall,
            as: "mall",
            attributes: ["id", "nombreCentro", "ciudad"]
          }]
        },
        {
          model: User,
          as: "cliente",
          attributes: ["id", "primerNombre", "primerApellido", "correo", "celular", "numeroDocumento"]
        }
      ],
      order: [["fechaReserva", "DESC"], ["horaReserva", "ASC"]],
    });
  }

  else if (user.idRol === 1) {
    return await Reservation.findAll({
      include: [
        {
          model: Court,
          as: "cancha",
          attributes: ["id", "nombreCancha", "direccion", "valorHora", "horarioInicio", "horarioFin"],
          include: [{
            model: Mall,
            as: "mall",
            attributes: ["id", "nombreCentro", "ciudad"]
          }]
        },
        {
          model: User,
          as: "cliente",
          attributes: ["id", "primerNombre", "primerApellido", "correo", "celular"]
        }
      ],
      order: [["fechaReserva", "DESC"], ["horaReserva", "ASC"]],
    });
  }

  throw new Error("No tienes permisos para ver las reservas");
};

export const getReservationsByMallService = async (user, mallId) => {
  if (user.idRol !== 1 && user.idRol !== 2) {
    throw new Error("No tienes permisos para acceder a este recurso");
  }

  if (user.idRol === 2 && user.idMall !== Number(mallId)) {
    throw new Error("No tienes permisos para acceder a este centro comercial");
  }

  const reservas = await Reservation.findAll({
    include: [
      {
        model: Court,
        as: "cancha",
        attributes: ["id", "nombreCancha", "direccion", "valorHora", "horarioInicio", "horarioFin"],
        where: { mallId: Number(mallId) },
        include: [{
          model: Mall,
          as: "mall",
          attributes: ["id", "nombreCentro", "ciudad"]
        }]
      },
      {
        model: User,
        as: "cliente",
        attributes: ["id", "primerNombre", "primerApellido", "correo", "celular", "numeroDocumento"]
      }
    ],
    order: [["fechaReserva", "DESC"], ["horaReserva", "ASC"]],
  });

  return reservas;
};

export const cancelReservationService = async (user, id) => {
  const reserva = await Reservation.findByPk(id, {
    include: [{
      model: Court,
      as: "cancha",
      attributes: ["mallId"]
    }]
  });
  
  if (!reserva) throw new Error("Reserva no encontrada");

  const puedeCancelar = 
    reserva.userId === user.id || 
    (user.idRol === 2 && reserva.cancha.mallId === user.idMall) ||
    user.idRol === 1;

  if (!puedeCancelar) {
    throw new Error("No tienes permisos para cancelar esta reserva");
  }

  const ahora = new Date();
  const fechaHoraReserva = new Date(`${reserva.fechaReserva}T${reserva.horaReserva}`);
  if (fechaHoraReserva < ahora) {
    throw new Error("No se pueden cancelar reservas pasadas");
  }

  reserva.estado = "Cancelada";
  await reserva.save();

  return { 
    message: "Reserva cancelada correctamente",
    reserva: await Reservation.findByPk(id, {
      include: [
        {
          model: Court,
          as: "cancha",
          attributes: ["id", "nombreCancha"],
          include: [{
            model: Mall,
            as: "mall",
            attributes: ["id", "nombreCentro"]
          }]
        },
        {
          model: User,
          as: "cliente",
          attributes: ["id", "primerNombre", "primerApellido"]
        }
      ]
    })
  };
};