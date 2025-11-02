import Court from "../models/court.js";
import Mall from "../models/mall.js";
import fs from "fs";
import path from "path";

export const createCourtService = async (admin, body, file) => {
    if (admin.idRol !== 2) {
        throw new Error("Solo el administrador puede registrar canchas");
    }

    const {
        nombreCancha,
        horarioInicio,
        horarioFin,
        diasDisponibles,
        valorHora,
        telefono,
        direccion,
        responsable,
        detalles,
        capacidad
    } = body;

    const requiredFields = [
        "nombreCancha",
        "horarioInicio",
        "horarioFin",
        "diasDisponibles",
        "valorHora",
        "telefono",
        "direccion",
        "responsable",
        "capacidad",
    ];

    for (const field of requiredFields) {
        if (!body[field] || body[field].toString().trim() === "") {
            throw new Error(`El campo ${field} es obligatorio`);
        }
    }

    if (isNaN(valorHora) || Number(valorHora) <= 0) {
        throw new Error("El valor por hora debe ser un número positivo");
    }

    if (!/^\d{10}$/.test(telefono)) {
        throw new Error("El teléfono debe tener 10 dígitos numéricos");
    }

    const imagen = file ? file.filename : null;

    const newCourt = await Court.create({
        nombreCancha,
        horarioInicio,
        horarioFin,
        diasDisponibles,
        valorHora,
        telefono,
        direccion,
        responsable,
        detalles,
        capacidad,
        imagen,
        mallId: admin.idMall,
    });

    return newCourt;
};

export const getCourtsService = async (user) => {

    if (user.idRol === 1 || user.idRol === 2) {
        return await Court.findAll({
            include: { model: Mall, as: "mall", attributes: ["nombreCentro"] },
            order: [["id", "ASC"]]
        });
    }

    throw new Error("No tienes permisos para ver las canchas.");
};

export const getCourtByIdService = async (id) => {
    const cancha = await Court.findByPk(id);
    if (!cancha) throw new Error("Cancha no encontrada");
    return cancha;
};

export const updateCourtService = async (id, data) => {
    const cancha = await Court.findByPk(id);
    if (!cancha) throw new Error("Cancha no encontrada");

    await cancha.update(data);
    return cancha;
};

export const deleteCourtService = async (id) => {
    const cancha = await Court.findByPk(id);
    if (!cancha) throw new Error("Cancha no encontrada");

    if (cancha.imagen) {
        const filePath = path.join(process.cwd(), "uploads", cancha.imagen);

        try {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
                console.log(`Archivo eliminado: ${filePath}`);
            }
        } catch (err) {
            console.error("Error eliminando archivo", err);
        }
    }

    await cancha.destroy();
    return true;
};
