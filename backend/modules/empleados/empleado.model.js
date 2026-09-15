import { DataTypes } from "sequelize";

export function defineEmpleadoModel(sequelize) {
  return sequelize.define(
    "Empleado",
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      tipo_documento: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "CC",
      },
      nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      documento: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      correo: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      telefono: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      tableName: "empleados",
      timestamps: false,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    }
  );
}