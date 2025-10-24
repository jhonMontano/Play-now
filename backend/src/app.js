import express from "express";
import cors from "cors"; 
import user from "./routes/user.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor PlayNow funcionando correctamente");
});

app.use("/api/users", user);
app.use("/api/auth", authRoutes);

export default app;