import express from "express";
import cors from "cors"; 
import user from "./routes/user.js";
import authRoutes from "./routes/authRoutes.js";
import mallRoutes from "./routes/mallRoutes.js";
import courtRoutes from "./routes/courtRoutes.js";
import path from "path";
import reservationRoutes from "./routes/reservationRoutes.js";

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
app.use("/api/malls", mallRoutes);
app.use("/api/courts", courtRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reservations", reservationRoutes);

export default app;