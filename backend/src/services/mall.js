import Mall from "../models/mall.js";
import User from "../models/user.js";
import Roles from "../models/roles.js";
import Court from "../models/court.js";
import { Op, fn, col, where } from "sequelize";

const capitalizeWords = (str) => str.replace(/\b\w/g, (c) => c.toUpperCase());

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const createMallAndAdminService = async (creatorUser, mallData, adminData) => {
  if (creatorUser.idRol !== 1)
    throw new Error("Acceso denegado. Solo el super administrador puede crear centros comerciales.");

  const requiredMallFields = ["nombreCentro", "direccion", "telefono", "ciudad"];
  for (const field of requiredMallFields) {
    if (!mallData[field]) throw new Error(`El campo "${field}" del centro comercial es obligatorio.`);
  }

  const existingMall = await Mall.findOne({
    where: where(
      fn("LOWER", col("nombreCentro")),
      fn("LOWER", mallData.nombreCentro)
    ),
  });

  if (existingMall)
    throw new Error(`Ya existe un centro comercial con el nombre "${capitalizeWords(existingMall.nombreCentro)}".`);

  const existingAdmin = await User.findOne({ where: { correo: adminData.correo } });

  if (existingAdmin) {
    if (existingAdmin.idMall) {
      const assignedMall = await Mall.findByPk(existingAdmin.idMall);
      const mallName = assignedMall
        ? capitalizeWords(assignedMall.nombreCentro)
        : `ID ${existingAdmin.idMall}`;
      throw new Error(`El usuario ${adminData.correo} ya es administrador del centro comercial "${mallName}"`);
    }
    throw new Error(`El usuario ${adminData.correo} ya existe y no puede ser reasignado`);
  }

  const existingDocument = await User.findOne({
    where: { numeroDocumento: adminData.numeroDocumento }
  });

  if (existingDocument) {
    throw new Error(
      `Ya existe un usuario con el número de documento ${adminData.numeroDocumento}`
    );
  }

  if (!emailRegex.test(adminData.correo)) {
    throw new Error("El correo electrónico no tiene un formato válido");
  }

  const newMall = await Mall.create({
    nombreCentro: mallData.nombreCentro,
    direccion: mallData.direccion,
    telefono: mallData.telefono,
    ciudad: mallData.ciudad,
    activo: true
  });

  const rolAdmin = await Roles.findOne({ where: { nombre: "admin" } });
  if (!rolAdmin) throw new Error("No se encontró el rol de administrador");

  const newAdmin = await User.create({
    ...adminData,
    idRol: rolAdmin.id,
    idMall: newMall.id,
    password: adminData.numeroDocumento,
  });

  await newMall.update({ adminId: newAdmin.id });

  return { newMall, newAdmin };
};

export const getAllMallsService = async () => {
  return await Mall.findAll({
    include: {
      model: User,
      as: "administrador",
      attributes: [
        "id",
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "correo",
        "celular",
        "idRol",
        "activo",
        "numeroDocumento",
        "tipoDocumento",
        "direccion",
      ],
    },
    order: [["nombreCentro", "ASC"]],
  });
};

export const getAllMallsIncludingInactiveService = async () => {
  return await Mall.findAll({
    include: {
      model: User,
      as: "administrador",
      attributes: [
        "id",
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "correo",
        "celular",
        "idRol",
        "activo",
        "numeroDocumento",
        "tipoDocumento",
        "direccion",
      ],
    },
    order: [["activo", "DESC"], ["nombreCentro", "ASC"]],
  });
};

export const getAllInactiveMallsService = async () => {
  return await Mall.findAll({
    where: { activo: false },
    include: {
      model: User,
      as: "administrador",
      attributes: [
        "id",
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "correo",
        "celular",
        "idRol",
        "activo",
        "numeroDocumento",
        "tipoDocumento",
        "direccion",
      ],
    },
    order: [["nombreCentro", "ASC"]],
  });
};

export const getMallByIdService = async (id) => {
  const mall = await Mall.findByPk(id, {
    include: {
      model: User,
      as: "administrador",
      attributes: [
        "id",
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "correo",
        "celular",
        "idRol",
        "activo",
        "numeroDocumento",
        "tipoDocumento",
        "direccion",
      ],
    },
  });
  if (!mall) throw new Error("Centro comercial no encontrado");
  return mall;
};

export const updateMallService = async (user, id, data) => {
  if (user.idRol !== 1)
    throw new Error("Acceso denegado. Solo el super administrador puede actualizar centros comerciales");

  const existingMall = await Mall.findByPk(id, { include: { model: User, as: "administrador" } });
  if (!existingMall) throw new Error("Centro comercial no encontrado");

  const { mall, admin } = data;

  if (mall) {
    const { activo, ...allowedMallFields } = mall;
    const mallData = {};

    const validFields = ["nombreCentro", "direccion", "telefono", "ciudad"];
    for (const field of validFields) {
      if (allowedMallFields.hasOwnProperty(field)) mallData[field] = allowedMallFields[field];
    }

    await existingMall.update(mallData);
  }

  if (admin && existingMall.administrador) {
    const allowedAdminFields = [
      "primerNombre",
      "segundoNombre",
      "primerApellido",
      "segundoApellido",
      "correo",
      "celular",
      "numeroDocumento",
      "tipoDocumento",
      "direccion",
    ];

    const adminData = {};
    for (const field of allowedAdminFields) {
      if (admin.hasOwnProperty(field)) adminData[field] = admin[field];
    }

    await existingMall.administrador.update(adminData);
  }

  return await Mall.findByPk(id, {
    include: {
      model: User,
      as: "administrador",
      attributes: [
        "id",
        "primerNombre",
        "segundoNombre",
        "primerApellido",
        "segundoApellido",
        "correo",
        "celular",
        "numeroDocumento",
        "tipoDocumento",
        "direccion",
      ],
    },
  });
};

export const updateMallStatusService = async (user, id, activo) => {
  if (user.idRol !== 1)
    throw new Error("Acceso denegado. Solo el super administrador puede modificar el estado de centros comerciales");

  const mall = await Mall.findByPk(id);
  if (!mall) throw new Error("Centro comercial no encontrado");

  if (mall.activo === activo) {
    const estado = activo ? 'activo' : 'inactivo';
    throw new Error(`El centro comercial ya está ${estado}`);
  }

  await mall.update({ activo });
  return mall;
};

export const hasCourtsAssociatedService = async (mallId) => {
  const count = await Court.count({ where: { mallId } });
  return count > 0;
};

export const deleteMallService = async (user, id) => {
  if (user.idRol !== 1)
    throw new Error("Acceso denegado. Solo el super administrador puede eliminar centros comerciales");

  const mall = await Mall.findByPk(id);
  if (!mall) throw new Error("Centro comercial no encontrado");

  const existingCourts = await Court.findOne({ where: { mallId: mall.id } });
  if (existingCourts) {
    throw new Error(
      "No se puede eliminar el centro comercial porque tiene canchas asociadas. " +
      "Elimina o reasigna las canchas antes de continuar."
    );
  }

  const admin = await User.findOne({ where: { idMall: mall.id } });
  if (admin) {
    await admin.destroy();
  }

  await mall.destroy();

  return true;
};