# Prueba Técnica - Gestión de Empleados

Esta es una aplicación web sencilla para administrar empleados de una empresa, desarrollada como prueba técnica para johannaOrtiz.
El proyecto consta de una base de datos en MySQL, un API backend construido con Node.js (Express) y un frontend desarrollado en Next.js.

## Requisitos previos

- Docker
- Node.js (v20 o superior recomendado)
- pnpm o npm (gestor de paquetes)

---

## 1. Configuración de la Base de Datos (MySQL)

Puedes configurar la base de datos de dos maneras, dependiendo de tus herramientas locales:

### Opción A: Instalación Local de MySQL
1. Crea una base de datos en tu servidor MySQL local llamada `johannaortiz`.
2. Ejecuta el archivo `schema.sql` (ubicado en la raíz de este proyecto) en tu gestor de base de datos para crear la tabla e insertar los registros iniciales.
3. Asegúrate de que las credenciales en el archivo `.env` del backend coincidan con tu usuario y contraseña locales.

### Opción B: Usando Docker (Alternativa rápida)
Si tienes Docker instalado, puedes levantar la base de datos ejecutando el siguiente comando en la raíz del proyecto para iniciar el contenedor:

```bash
docker run --name mysql-prueba -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=johannaortiz -p 3306:3306 -d mysql:8.0
```

Una vez que el contenedor esté corriendo, importa la estructura de la base de datos y los datos iniciales utilizando el archivo `schema.sql` provisto:

```bash
docker exec -i mysql-prueba mysql -uroot -proot johannaortiz < schema.sql
```

Comandos útiles para gestionar el contenedor:
- **Detener** la base de datos: `docker stop mysql-prueba`
- **Iniciar** la base de datos: `docker start mysql-prueba`
- **Reiniciar** la base de datos: `sudo docker restart mysql-prueba`

---

## 2. Configuración del Backend

El backend es una API RESTful construida con Node.js.

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   pnpm install o npm install
   ```
3. Verifica que exista el archivo `.env` en la raíz de la carpeta `backend` con las siguientes variables (si no existe, créalo):
   ```env
   NODE_ENV=development
   PORT=3001
   CORS_ORIGIN=http://localhost:3000

   MYSQL_HOST=127.0.0.1
   MYSQL_PORT=3306
   MYSQL_DATABASE=johannaortiz
   MYSQL_USER=root
   MYSQL_PASSWORD=root
   ```
4. Inicia el servidor en modo desarrollo:
   ```bash
   pnpm dev o npm run dev
   ```
   La API estará disponible y escuchando en `http://localhost:3001`.

---

## 3. Configuración del Frontend

1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias del proyecto:
   ```bash
   pnpm install o npm install
   ```
3. Verifica que exista el archivo `.env.local` en la raíz de la carpeta `frontend` con el siguiente contenido:
   ```env
   NEXT_PUBLIC_API_URL="http://localhost:3001/api"
   PORT="3000"
   ```
4. Inicia la aplicación web en modo desarrollo:
   ```bash
   pnpm dev o npm run dev
   ```
   La interfaz esta disponible en `http://localhost:3000`.

---

