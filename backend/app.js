import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sequelize from "./config/db.js";
import initializeModels from "./modules/models.init.js";

import empleadoRoutes from "./modules/empleados/empleado.routes.js";

const app = express();

app.use(helmet());
app.use(express.json());

const corsOrigins = process.env.CORS_ORIGIN?.split(",").map((o) => o.trim()) || [
  "http://localhost:3000",
  "http://localhost:49418",
];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Company-Id"],
  }),
);

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
});

const apiRoutes = express.Router();
const models = initializeModels(sequelize);

apiRoutes.use((req, res, next) => {
  req.models = models;
  req.sequelize = sequelize;
  next();
});

apiRoutes.use(limiter);
apiRoutes.use("/empleados", empleadoRoutes);

app.use("/api", apiRoutes);

// Middleware para manejar rutas no encontradas (404)
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware para manejo de errores global
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === "production";
  const response = {
    error: "Error interno del servidor",
    details: isProduction ? "Ocurrió un error inesperado." : err.message,
  };

  res.status(err.status || 500).json(response);
});

export default app;
