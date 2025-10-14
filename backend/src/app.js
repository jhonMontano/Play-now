import express from "express";
import user from "./routes/user.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor PlayNow funcionando correctamente");
});

app.use("/api/users", user);

export default app;
