import Mall from "../models/mall.js";
import User from "../models/user.js";
import Roles from "../models/roles.js";

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

export const createMallAndAdmin = async (req, res) => {
  try {
    console.log("Usuario autenticado:", req.user);

    if (req.user.idRol !== 1) {
      return res.status(403).json({
        message: "Acceso denegado. Solo el super administrador puede crear centros comerciales.",
      });
    }

    const { mall, admin } = req.body;

    if (!mall || !admin) {
      return res.status(400).json({
        message: "Faltan datos del centro comercial o del administrador.",
      });
    }

    const requiredMallFields = ["nombreCentro", "direccion", "telefono", "ciudad"];
    for (const field of requiredMallFields) {
      if (!mall[field]) {
        return res.status(400).json({
          message: `El campo "${field}" del centro comercial es obligatorio.`,
        });
      }
    }

    const existingMall = await Mall.findOne({
      where: {
        nombreCentro: mall.nombreCentro.toLowerCase()
      }
    });

    if (existingMall) {
      return res.status(400).json({
        message: `Ya existe un centro comercial con el nombre "${capitalizeWords(existingMall.nombreCentro)}".`,
      });
    }

    const existingAdmin = await User.findOne({
      where: { correo: admin.correo },
    });

    if (existingAdmin) {
      if (existingAdmin.idMall) {
        const assignedMall = await Mall.findByPk(existingAdmin.idMall);
        const mallName = assignedMall
          ? capitalizeWords(assignedMall.nombreCentro)
          : `ID ${existingAdmin.idMall}`;
        return res.status(400).json({
          message: `El usuario ${admin.correo} ya es administrador del centro comercial "${mallName}".`,
        });
      }
      return res.status(400).json({
        message: `El usuario ${admin.correo} ya existe y no puede ser reasignado.`,
      });
    }

    const newMall = await Mall.create({
      nombreCentro: mall.nombreCentro,
      direccion: mall.direccion,
      telefono: mall.telefono,
      ciudad: mall.ciudad,
    });

    const rolAdmin = await Roles.findOne({ where: { nombre: "admin" } });
    if (!rolAdmin) {
      return res.status(500).json({
        message: "No se encontró el rol de administrador.",
      });
    }

    const newAdmin = await User.create({
      ...admin,
      idRol: rolAdmin.id,
      idMall: newMall.id,
      password: admin.numeroDocumento,
    });

    await newMall.update({ adminId: newAdmin.id });

    res.status(201).json({
      message: "Centro comercial y administrador creados correctamente.",
      mall: newMall,
      administrador: newAdmin,
    });

  } catch (error) {
    console.error("Error al crear mall:", error);
    if (error.errors) {
      console.error(
        "Detalles de validación:",
        error.errors.map((e) => e.message)
      );
    }

    res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};
