# Guía de Endpoints - API Empleados

**URL Base:** `/api/empleados`

---

## 1. Listar Empleados
- **Método:** `GET`
- **URL:** `/api/empleados`
- **Descripción:** Obtiene la lista de todos los empleados registrados.
- **Ejemplo de Respuesta:**
```json
[
  {
    "id": 1,
    "tipo_documento": "CC",
    "nombre": "Juan",
    "apellido": "Perez",
    "documento": "1001",
    "correo": "juan@example.com",
    "telefono": "123456"
  }
]
```

---

## 2. Consultar Detalle de Empleado
- **Método:** `GET`
- **URL:** `/api/empleados/:id`
- **Descripción:** Obtiene los datos de un empleado específico usando su ID.
- **Ejemplo de Respuesta:**
```json
{
  "id": 1,
  "tipo_documento": "CC",
  "nombre": "Juan",
  "apellido": "Perez",
  "documento": "1001",
  "correo": "juan@example.com",
  "telefono": "123456"
}
```

---

## 3. Crear Empleado
- **Método:** `POST`
- **URL:** `/api/empleados`
- **Descripción:** Registra un nuevo empleado.
- **Campos Requeridos:** `tipo_documento`, `nombre`, `apellido`, `documento`, `correo`, `telefono`
- **Ejemplo de Envío (Body):**
```json
{
  "tipo_documento": "CC",
  "nombre": "Ana",
  "apellido": "Gomez",
  "documento": "1004",
  "correo": "ana@example.com",
  "telefono": "3001234567"
}
```

---

## 4. Actualizar Empleado
- **Método:** `PUT`
- **URL:** `/api/empleados/:id`
- **Descripción:** Edita un empleado existente. Puedes enviar solo los campos que deseas cambiar.
- **Campos Permitidos:** `tipo_documento`, `nombre`, `apellido`, `documento`, `correo`, `telefono`
- **Ejemplo de Envío (Body):**
```json
{
  "telefono": "3219876543",
  "correo": "nuevo.correo@example.com"
}
```

---

## 5. Eliminar Empleado
- **Método:** `DELETE`
- **URL:** `/api/empleados/:id`
- **Descripción:** Elimina un empleado del sistema.
- **Ejemplo de Envío:** No requiere body. Retorna un status `204 No Content` si la eliminación fue exitosa.
