
import express from "express";
import calculatorRoutes from "./modules/calculator/calculator.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    name: "ElectroCalc API",
    version: "1.0.0",
    status: "online"
  });
});

app.use("/api/calculator", calculatorRoutes);

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
