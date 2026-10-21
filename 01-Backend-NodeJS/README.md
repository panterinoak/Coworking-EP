# SISTEMA DE RESERVAS COWORKING

## Descripción

API REST desarrollada con Node.js y Express para
gestionar usuarios, salas y reservas de espacios
de coworking.

El sistema utiliza SQL Server para almacenar
información transaccional y MongoDB para registrar
eventos y comentarios.

## Tecnologías

- Node.js
- Express.js
- Microsoft SQL Server
- MongoDB
- JavaScript
- REST Client

## Funcionalidades

- Consultar usuarios registrados.
- Consultar salas disponibles.
- Consultar reservas.
- Registrar nuevas reservas.
- Validar usuarios y salas.
- Evitar reservas con horarios superpuestos.
- Registrar eventos en MongoDB.
- Manejar errores mediante respuestas HTTP.

## Requisitos

- Node.js y npm
- SQL Server
- MongoDB
- Visual Studio Code (recomendado)

## Instalación

### 1. Instalar dependencias

Abrir una terminal en la carpeta del backend:

npm install

### 2. Configurar variables de entorno

Copiar el archivo .env.example como .env.

Configurar las credenciales locales de SQL Server
y los parámetros de conexión de MongoDB.

Nunca publicar contraseñas reales.

### 3. Preparar SQL Server

En los archivos del proyecto SQL, ejecutar:

1. 00_crear_base.sql
2. 01_crear_tablas.sql
3. 02_crear_indices.sql
4. 03_procedimiento_reservas.sql
5. 04_datos_iniciales.sql

Estos scripts deben ejecutarse sobre una
instalación nueva de CoworkingDB.

### 4. Preparar MongoDB

Iniciar el servidor MongoDB.

Ejecutar mediante mongosh:

1. 02_esquema_logs.js
2. 03_esquema_comentarios.js
3. 01_datos_iniciales.js

Base de datos: CoworkingLogs

### 5. Iniciar el servidor

npm run dev

Puerto predeterminado: 3000

## Endpoints principales

GET /api/health
GET /api/usuarios
GET /api/salas
GET /api/salas/:id
GET /api/reservas
POST /api/reservas

## Pruebas REST

El archivo request.http permite comprobar
los endpoints mediante REST Client.

Incluye pruebas de:

- Consulta de información.
- Creación de reservas.
- Conflictos de horarios.
- Validaciones de datos incorrectos.

## Seguridad

Las credenciales se configuran mediante
variables de entorno.

El archivo .env está excluido del repositorio
mediante .gitignore.

## Proyecto académico

Sistema de Reservas Coworking
Evaluación Parcial - Backend Full Stack
