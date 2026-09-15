const fields = ["tipo_documento", "nombre", "apellido", "documento", "correo", "telefono"];

const getPayload = (body) =>
  Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, body[field]]));

const validatePayload = (payload, partial = false) => {
  const requiredFields = partial ? [] : fields;
  const missing = requiredFields.filter((field) => !String(payload[field] ?? "").trim());
  if (missing.length > 0) return `Campos obligatorios: ${missing.join(", ")}`;
  
  // Validación de correo electrónico
  if (payload.correo) {
    const correo = payload.correo.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(correo)) {
      return "El correo electrónico no tiene un formato válido.";
    }
    
    // Validacion de caracteres
    if (correo.length > 150) {
      return "El correo electrónico es demasiado largo (máximo 150 caracteres).";
    }
    
    if (correo.includes("..") || correo.startsWith(".") || correo.endsWith(".")) {
      return "El correo electrónico no tiene un formato válido.";
    }
  }
  
  // Validacion de documento
  if (payload.documento) {
    const documento = payload.documento.trim();
    if (documento.length < 5) {
      return "El número de documento debe tener al menos 5 caracteres.";
    }
    if (documento.length > 30) {
      return "El número de documento es demasiado largo (máximo 30 caracteres).";
    }
  }
  
  // Validación de teléfono
  if (payload.telefono) {
    const telefono = payload.telefono.trim();
    if (telefono.length < 7) {
      return "El número de teléfono debe tener al menos 7 caracteres.";
    }
  }
  
  return null;
};

const getAll = async (req, res, next) => {
  try {
    const empleados = await req.models.Empleado.findAll({ order: [["id", "ASC"]] });
    res.json(empleados);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const empleado = await req.models.Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: "Empleado no encontrado." });
    res.json(empleado);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const payload = getPayload(req.body);
    const validationError = validatePayload(payload);
    if (validationError) return res.status(400).json({ error: validationError });
    
    const empleado = await req.models.Empleado.create(payload);
    res.status(201).json(empleado);
  } catch (error) {
    // Manejar errores de unicidad (documento o correo duplicado)
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0]?.path;
      if (field === "documento") {
        return res.status(409).json({ error: "Ya existe un empleado con este número de documento." });
      }
      if (field === "correo") {
        return res.status(409).json({ error: "Ya existe un empleado con este correo electrónico." });
      }
      return res.status(409).json({ error: "Ya existe un empleado con estos datos." });
    }
    
    // Manejar errores de validación de Sequelize
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ error: messages });
    }
    
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const empleado = await req.models.Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: "Empleado no encontrado." });
    
    const payload = getPayload(req.body);
    const validationError = validatePayload(payload, true);
    if (validationError) return res.status(400).json({ error: validationError });
    
    await empleado.update(payload);
    res.json(empleado);
  } catch (error) {
    // Manejar errores de unicidad (documento o correo duplicado)
    if (error.name === "SequelizeUniqueConstraintError") {
      const field = error.errors[0]?.path;
      if (field === "documento") {
        return res.status(409).json({ error: "Ya existe otro empleado con este número de documento." });
      }
      if (field === "correo") {
        return res.status(409).json({ error: "Ya existe otro empleado con este correo electrónico." });
      }
      return res.status(409).json({ error: "Ya existe otro empleado con estos datos." });
    }
    
    // Manejar errores de validación de Sequelize
    if (error.name === "SequelizeValidationError") {
      const messages = error.errors.map((e) => e.message).join(", ");
      return res.status(400).json({ error: messages });
    }
    
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const empleado = await req.models.Empleado.findByPk(req.params.id);
    if (!empleado) return res.status(404).json({ error: "Empleado no encontrado." });
    await empleado.destroy();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export { getAll, getById, create, update, remove };