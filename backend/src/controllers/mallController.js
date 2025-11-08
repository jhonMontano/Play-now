import {
  createMallAndAdminService,
  getAllMallsService,
  getMallByIdService,
  updateMallService,
  deleteMallService,
} from "../services/mall.js";

export const createMallAndAdmin = async (req, res) => {
  try {
    const { mall, admin } = req.body;
    const { newMall, newAdmin } = await createMallAndAdminService(req.user, mall, admin);
    res.status(201).json({
      message: "Centro comercial y administrador creados correctamente.",
      mall: newMall,
      administrador: newAdmin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllMalls = async (req, res) => {
  try {
    const malls = await getAllMallsService();
    res.json(malls);
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
    res.status(400).json({ message: error.message });
  }
};

export const deleteMall = async (req, res) => {
  try {
    await deleteMallService(req.user, req.params.id);
    res.json({ message: "Centro comercial y su administrador eliminados correctamente" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
