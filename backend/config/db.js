import "dotenv/config";
import { Sequelize } from "sequelize";

const databaseUrl = process.env.DATABASE_URL;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, { 
      dialect: "mysql", 
      logging: false,
      dialectOptions: {
        charset: "utf8mb4",
      },
      define: {
        charset: "utf8mb4",
        collate: "utf8mb4_unicode_ci",
      },
    })
  : new Sequelize(
      process.env.MYSQL_DATABASE || "johannaortiz",
      process.env.MYSQL_USER || "root",
      process.env.MYSQL_PASSWORD || "root",
      {
        host: process.env.MYSQL_HOST || "127.0.0.1",
        port: Number(process.env.MYSQL_PORT || 3306),
        dialect: "mysql",
        logging: false,
        dialectOptions: {
          charset: "utf8mb4",
        },
        define: {
          charset: "utf8mb4",
          collate: "utf8mb4_unicode_ci",
        },
      }
    );

export default sequelize;