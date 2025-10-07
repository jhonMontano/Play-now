import express from "express";
import sequelize from "./src/config/database";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.send("PlayNow API running"));

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
    .then(() => {
    console.log("Connected to data base PostgreSQL");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("Error of connection:", err));

