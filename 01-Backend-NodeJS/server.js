
require('dotenv').config();

const express = require('express');
const app = express();

// ======================================
// IMPORTAR RUTAS
// ======================================

const usuariosRoutes = require('./src/routes/usuarios.routes');
const salasRoutes = require('./src/routes/salas.routes');
const reservasRoutes = require('./src/routes/reservas.routes');

// Puerto definido por variable de entorno
const PORT = process.env.PORT || 3000;

// ======================================
// MIDDLEWARE 1: LOGGING DE PETICIONES
// ======================================

app.use((req, res, next) => {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracion = Date.now() - inicio;

    console.log(
      `[HTTP] ${req.method} ${req.originalUrl} ` +
      `| Estado: ${res.statusCode} | ${duracion}ms`
    );
  });

  next();
});

// ======================================
// MIDDLEWARE 2: PROCESAMIENTO JSON
// ======================================

app.use(express.json({
  limit: '100kb'
}));

// ======================================
// MIDDLEWARE 3: VALIDACION DE ENTRADA
// ======================================

// Verificar el formato de solicitudes de reserva.
// La validacion de usuario, sala y fechas
// permanece en reservas.routes.js.

function validarJSONReserva(req, res, next) {

  if (!req.is('application/json')) {
    return res.status(415).json({
      success: false,
      mensaje: 'Se requiere Content-Type: application/json'
    });
  }

  if (
    !req.body ||
    typeof req.body !== 'object' ||
    Array.isArray(req.body) ||
    Object.keys(req.body).length === 0
  ) {
    return res.status(400).json({
      success: false,
      mensaje: 'Debe enviar un objeto JSON con datos'
    });
  }

  next();
}

// Aplicar validacion a creacion de reservas
app.post('/api/reservas', validarJSONReserva);

// ======================================
// RUTAS DE LA API REST
// ======================================

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/salas', salasRoutes);
app.use('/api/reservas', reservasRoutes);

// ======================================
// RUTA PRINCIPAL
// ======================================

app.get('/', (req, res) => {
  return res.status(200).json({
    mensaje: 'Bienvenido al Sistema de Reservas Coworking',
    estado: 'Servidor funcionando correctamente'
  });
});

// ======================================
// HEALTH CHECK
// ======================================

app.get('/api/health', (req, res) => {
  return res.status(200).json({
    success: true,
    mensaje: 'API funcionando correctamente'
  });
});

// ======================================
// MIDDLEWARE 4: RUTA NO ENCONTRADA
// ======================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    mensaje: 'El endpoint solicitado no existe'
  });
});

// ======================================
// MIDDLEWARE 5: MANEJO GLOBAL DE ERRORES
// ======================================

app.use((error, req, res, next) => {

  if (res.headersSent) {
    return next(error);
  }

  // JSON mal formado
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      mensaje: 'El formato JSON enviado no es valido'
    });
  }

  console.error(
    `[ERROR] ${req.method} ${req.originalUrl}`,
    error
  );

  // Evitar exponer detalles internos del servidor
  return res.status(500).json({
    success: false,
    mensaje: 'Error interno del servidor'
  });
});

// ======================================
// INICIAR SERVIDOR
// ======================================

app.listen(PORT, () => {
  console.log('================================');
  console.log(' SISTEMA DE RESERVAS COWORKING');
  console.log('================================');
  console.log(`Servidor: http://localhost:${PORT}`);
  console.log('Estado: ACTIVO');
  console.log('Middlewares: CONFIGURADOS');
  console.log('================================');
});

