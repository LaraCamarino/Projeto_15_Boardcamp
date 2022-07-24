import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import categoriesRoutes from "./routes/categoriesRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(categoriesRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log("Server running on port " + process.env.PORT));