import Mall from "../models/mall.js";
import User from "../models/user.js";
import Roles from "../models/roles.js";

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (c) => c.toUpperCase());

/* 🏢 Crear centro comercial y su administrador */
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
      where: { nombreCentro: mall.nombreCentro.toLowerCase() },
    });
    if (existingMall) {
      return res.status(400).json({
        message: `Ya existe un centro comercial con el nombre "${capitalizeWords(existingMall.nombreCentro)}".`,
      });
    }

    const existingAdmin = await User.findOne({ where: { correo: admin.correo } });
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
      return res.status(500).json({ message: "No se encontró el rol de administrador." });
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
    res.status(500).json({
      message: "Error interno del servidor.",
      error: error.message,
    });
  }
};

export const getAllMalls = async (req, res) => {
  try {
    const malls = await Mall.findAll({
      include: {
        model: User,
        as: "administrador",
        attributes: ["id", "primerNombre", "segundoNombre" ,"primerApellido", "segundoApellido", "correo", "celular", "idRol"],
      },
      order: [["nombreCentro", "ASC"]],
    });
    res.status(200).json(malls);
  } catch (error) {
    console.error("Error al obtener malls:", error);
    res.status(500).json({ message: "Error al obtener los centros comerciales." });
  }
};

export const getMallById = async (req, res) => {
  try {
    const { id } = req.params;
    const mall = await Mall.findByPk(id, {
      include: {
        model: User,
        as: "administrador",
        attributes: ["id", "primerNombre", "segundoNombre" ,"primerApellido", "segundoApellido", "correo", "celular", "idRol"],
      },
    });
    if (!mall) return res.status(404).json({ message: "Centro comercial no encontrado." });

    res.status(200).json(mall);
  } catch (error) {
    console.error("Error al obtener mall:", error);
    res.status(500).json({ message: "Error al obtener el centro comercial." });
  }
};

export const updateMall = async (req, res) => {
  try {
    if (req.user.idRol !== 1) {
      return res.status(403).json({
        message: "Acceso denegado. Solo el super administrador puede actualizar centros comerciales.",
      });
    }

    const { id } = req.params;
    const { nombreCentro, direccion, telefono, ciudad } = req.body;

    const mall = await Mall.findByPk(id);
    if (!mall) return res.status(404).json({ message: "Centro comercial no encontrado." });

    await mall.update({ nombreCentro, direccion, telefono, ciudad });

    res.status(200).json({
      message: "Centro comercial actualizado correctamente.",
      mall,
    });
  } catch (error) {
    console.error("Error al actualizar mall:", error);
    res.status(500).json({ message: "Error al actualizar el centro comercial." });
  }
};

export const deleteMall = async (req, res) => {
  try {
    if (req.user.idRol !== 1) {
      return res.status(403).json({
        message: "Acceso denegado. Solo el super administrador puede eliminar centros comerciales.",
      });
    }

    const { id } = req.params;
    const mall = await Mall.findByPk(id);

    if (!mall) return res.status(404).json({ message: "Centro comercial no encontrado." });

    await mall.destroy();

    res.status(200).json({ message: "Centro comercial eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar mall:", error);
    res.status(500).json({ message: "Error al eliminar el centro comercial." });
  }
};
