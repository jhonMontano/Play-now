import app from "./src/app.js";
import sequelize from "./src/config/database.js";
import Roles from "./src/models/roles.js"
import "./src/models/associations.js";

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  try {
    await sequelize.sync({ alter: true });
    console.log("Modelos sincronizados con la base de datos PostgreSQL");
    const roles = ["superAdmin", "admin", "usuario"];
    for (const nombre of roles) {
      const [rol, creado] = await Roles.findOrCreate({ where: { nombre } });

      if (creado) {
        console.log(`Rol creado: ${nombre}`);
      } else {
        console.log(`Rol ya existía: ${nombre}`);
      }

    }
  } catch (error) {
    console.error("Error al sincronizar modelos:", error);
  }
});
