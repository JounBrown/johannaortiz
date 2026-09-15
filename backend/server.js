import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/db.js";

const PORT = process.env.PORT || 3001;

const startServer = async () => {
  if (process.env.NODE_ENV !== "production") {
    await sequelize.sync({ alter: true });
  }

  const server = app.listen(PORT, () => {
  });

  const shutdown = async () => {
    server.close();
    await sequelize.close();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer().catch((error) => {
  console.error("No se pudo iniciar el servidor:", error);
  process.exit(1);
});