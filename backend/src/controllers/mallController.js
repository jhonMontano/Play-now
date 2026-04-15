import {
  createMallAndAdminService,
  getAllMallsService,
  getMallByIdService,
  updateMallService,
  updateMallStatusService,
  deleteMallService,
} from "../services/mall.js";
import { getCourtsByMallIdService } from "../services/court.js";

export const createMallAndAdmin = async (req, res) => {
  try {
    const { mall, admin } = req.body;

    const { newMall, newAdmin } = await createMallAndAdminService(
      req.user,
      mall,
      admin
    );

    res.status(201).json({
      message: "Centro comercial y administrador creados correctamente",
      mall: newMall,
      administrador: newAdmin,
    });

  } catch (error) {
    console.log("ERROR COMPLETO:");
    console.log(error);

    if (error.errors) {
      console.log("ERRORES DE SEQUELIZE:");
      error.errors.forEach(e => {
        console.log("Campo:", e.path);
        console.log("Mensaje:", e.message);
        console.log("Valor:", e.value);
      });
    }

    if (error.message.includes("Acceso denegado") || error.message.includes("Solo el super administrador")) {
      res.status(403).json({
        message: error.message,
        details: error.errors
      });
    } else {
      res.status(400).json({
        message: error.message,
        details: error.errors
      });
    }
  }
};

export const getAllMalls = async (req, res) => {
  try {
    const malls = await getAllMallsService();
    res.json({ malls });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMallById = async (req, res) => {
  try {
    const mall = await getMallByIdService(req.params.id);
    res.json(mall);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateMall = async (req, res) => {
  try {
    const updatedMall = await updateMallService(req.user, req.params.id, req.body);
    res.json({
      message: "Centro comercial y administrador actualizados correctamente",
      mall: updatedMall,
    });
  } catch (error) {
    if (error.message.includes("Acceso denegado") || error.message.includes("Solo el super administrador")) {
      res.status(403).json({ message: error.message });
    } else if (error.message.includes("no encontrado")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const updateMallStatus = async (req, res) => {
  try {
    const { activo } = req.body;
    
    if (activo === undefined) {
      return res.status(400).json({ 
        message: "El campo 'activo' es requerido. Use true para activar o false para desactivar.",
        example: { activo: true }
      });
    }
    
    if (typeof activo !== 'boolean') {
      return res.status(400).json({ 
        message: "El campo 'activo' debe ser un valor booleano (true/false)"
      });
    }
    
    const mall = await updateMallStatusService(req.user, req.params.id, activo);
    
    const mensaje = activo 
      ? "Centro comercial activado correctamente. Ya está disponible para reservas."
      : "Centro comercial desactivado correctamente. No estará disponible para nuevas reservas, pero las existentes siguen vigentes.";
    
    res.json({
      message: mensaje,
      mall,
      action: activo ? "activated" : "deactivated"
    });
  } catch (error) {
    if (error.message.includes("Acceso denegado") || error.message.includes("Solo el super administrador")) {
      res.status(403).json({ message: error.message });
    } else if (error.message.includes("no encontrado")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const deleteMall = async (req, res) => {
  try {
    await deleteMallService(req.user, req.params.id);
    res.json({ message: "Centro comercial y su administrador eliminados correctamente" });
  } catch (error) {
    if (error.message.includes("Acceso denegado") || error.message.includes("Solo el super administrador")) {
      res.status(403).json({ message: error.message });
    } else if (error.message.includes("no encontrado")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};

export const getMallCourts = async (req, res) => {
  try {
    const { id } = req.params;
    const courts = await getCourtsByMallIdService(id, req.user);
    res.status(200).json({ courts });
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      res.status(404).json({ message: error.message });
    } else {
      res.status(400).json({ message: error.message });
    }
  }
};