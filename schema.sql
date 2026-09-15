CREATE TABLE empleados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    tipo_documento VARCHAR(30) NOT NULL,
    documento VARCHAR(50) NOT NULL UNIQUE,
    correo VARCHAR(100) NOT NULL UNIQUE,
    telefono VARCHAR(20) NOT NULL
);

INSERT INTO empleados (nombre, apellido, tipo_documento, documento, correo, telefono) VALUES
('Carlos', 'Perez', 'Cedula', '12345678', 'carlos@empresa.com', '3001234567'),
('Ana', 'Gomez', 'Cedula Extranjeria', '87654321', 'ana@empresa.com', '3109876543'),
('Luis', 'Ramirez', 'Cedula', '11223344', 'luis@empresa.com', '3201122334');
