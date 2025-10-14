import express from "express";
import sequelize from "./src/config/database.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Servidor PlayNow ");
});

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  try {
    await sequelize.sync();
    console.log("Modelos sincronizados con la base de datos");
  } catch (error) {
    console.error("Error al sincronizar modelos:", error);
  }
});
