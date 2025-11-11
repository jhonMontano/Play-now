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
        capacidad,
        mallId,
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
        "mallId",
    ];

    for (const field of requiredFields) {
        if (!body[field] || body[field].toString().trim() === "") {
            throw new Error(`El campo ${field} es obligatorio`);
        }
    }

    const mall = await Mall.findByPk(mallId);
    if (!mall) {
        throw new Error("El centro comercial especificado no existe");
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
        mallId,
    });

    return newCourt;
};

export const getCourtsService = async (user) => {
    let whereClause = {};

    console.log('🔍 === DEBUG GET COURTS ===');
    console.log('Usuario recibido:', user);

    // 👇 SOLUCIÓN: Manejar ambos nombres de campo
    const userMallId = user.idMall !== undefined ? user.idMall : user.mallId;

    console.log('🔄 Mall ID detectado:', userMallId);

    if (user.idRol === 2) {
        if (userMallId === undefined || userMallId === null) {
            console.error('❌ ERROR: Administrador sin centro comercial');
            console.log('User object:', JSON.stringify(user, null, 2));
            throw new Error("El administrador no tiene un centro comercial asociado");
        }
        whereClause = { mallId: userMallId };
        console.log('✅ Filtro aplicado: mallId =', userMallId);
    } else if (user.idRol !== 1) {
        throw new Error("No tienes permisos para ver las canchas.");
    }

    const canchas = await Court.findAll({
        where: whereClause,
        include: { model: Mall, as: "mall", attributes: ["nombreCentro", "ciudad"] },
        order: [["id", "ASC"]],
    });

    console.log(`Canchas encontradas: ${canchas.length}`);
    return canchas;
};

export const getCourtByIdService = async (id) => {
    const cancha = await Court.findByPk(id, {
        include: { model: Mall, as: "mall", attributes: ["nombreCentro", "ciudad"] },
    });
    if (!cancha) throw new Error("Cancha no encontrada");
    return cancha;
};

export const updateCourtService = async (id, data, file) => {
    const cancha = await Court.findByPk(id);
    if (!cancha) throw new Error("Cancha no encontrada");

    if (data.mallId && data.mallId !== cancha.mallId) {
        const mall = await Mall.findByPk(data.mallId);
        if (!mall) {
            throw new Error("El centro comercial especificado no existe");
        }
    }

    if (file) {
        if (cancha.imagen) {
            const oldPath = path.join(process.cwd(), "uploads", cancha.imagen);
            if (fs.existsSync(oldPath)) {
                fs.unlinkSync(oldPath);
            }
        }
        data.imagen = file.filename;
    }

    if (data.valorHora && (isNaN(data.valorHora) || Number(data.valorHora) <= 0)) {
        throw new Error("El valor por hora debe ser un número positivo");
    }

    if (data.telefono && !/^\d{10}$/.test(data.telefono)) {
        throw new Error("El teléfono debe tener 10 dígitos numéricos");
    }

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

export const getCourtsByMallIdService = async (mallId, user) => {
    if (!mallId) throw new Error("Debe proporcionar el ID del centro comercial");

    const mall = await Mall.findByPk(mallId);
    if (!mall) throw new Error("Centro comercial no encontrado");

    /*if (user.idRol === 2 && user.idMall !== mall.id) {
        throw new Error("No tienes permisos para ver las canchas de este centro comercial");
    }*/

    const canchas = await Court.findAll({
        where: { mallId },
        include: {
            model: Mall,
            as: "mall",
            attributes: ["id", "nombreCentro", "ciudad"],
        },
        order: [["nombreCancha", "ASC"]],
    });

    return canchas;
};
