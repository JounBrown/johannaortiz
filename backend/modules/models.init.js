import { defineEmpleadoModel } from "./empleados/empleado.model.js";

/**
 * Inicializa todos los modelos para una conexión Sequelize específica
 * Esto permite tener modelos separados para cada empresa/compañía
 * @param {Sequelize} sequelize - Instancia de Sequelize para una empresa específica
 * @returns {Object} Objeto con todos los modelos inicializados
 */
function initializeModels(sequelize) {
  return {
    Empleado: defineEmpleadoModel(sequelize),
    sequelize,
  };
}

export default initializeModels;
