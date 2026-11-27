
import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import calculatorRoutes from "./modules/calculator/calculator.routes.js";
import categoriesRoutes from "./modules/glossary/categories.routes.js";
import termsRoutes from "./modules/glossary/terms.routes.js";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "ElectricalC API",
    version: "1.0.0",
    status: "online"
  });
});

app.use("/api/calculator", calculatorRoutes);
app.use("/api/categorias", categoriesRoutes);
app.use("/api/terminos", termsRoutes);

// Ruta inexistente
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado"
  });
});

// Errores
app.use((err, req, res, next) => {
  res.status(400).json({
    success: false,
    message: err.message || "Error interno"
  });
});

export default app;
