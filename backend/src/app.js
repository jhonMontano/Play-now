import express from "express";
import cors from "cors";
import user from "./routes/user.js";
import authRoutes from "./routes/authRoutes.js";
import mallRoutes from "./routes/mallRoutes.js";
import courtRoutes from "./routes/courtRoutes.js";
import path from "path";
import reservationRoutes from "./routes/reservationRoutes.js";
import setupSwagger from "./config/swagger.js";
import sporRoutes from "./routes/sportRoutes.js";
import adminStatsRoutes from "./routes/adminStatsRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import path from "path";

const app = express();

app.use(
  cors({
      origin: ["http://localhost:8080", "https://play-now-xm2c.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());

setupSwagger(app);

app.get("/", (req, res) => {
  res.send("Servidor PlayNow funcionando correctamente");
});

app.use("/api/users", user);
app.use("/api/auth", authRoutes);
app.use("/api/malls", mallRoutes);
app.use("/api/courts", courtRoutes);
//app.use("/api/uploads", express.static("uploads"));
app.use( "/api/uploads",express.static(path.resolve("uploads")));
app.use("/api/reservations", reservationRoutes);
app.use("/api/sports", sporRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/stats", adminStatsRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/admin/dashboard", dashboardRoutes);
app.use("/api/payments", paymentRoutes);

export default app;