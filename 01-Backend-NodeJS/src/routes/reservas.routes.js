
const express = require('express');
const router = express.Router();

const { conectarSQL, sql } = require('../config/sql.js');
const { registrarLog } = require('../utils/registrarLog.js');

// =====================================
// GET /api/reservas
// Consultar todas las reservas
// =====================================

router.get('/', async (req, res, next) => {
  try {
    const pool = await conectarSQL();

    const resultado = await pool.request().query(`
      SELECT
        r.ReservaID,
        r.UsuarioID,
        u.Nombre AS Usuario,
        r.SalaID,
        s.Nombre AS Sala,
        r.FechaInicio,
        r.FechaFin,
        r.Estado
      FROM dbo.Reservas r
      INNER JOIN dbo.Usuarios u
        ON r.UsuarioID = u.UsuarioID
      INNER JOIN dbo.Salas s
        ON r.SalaID = s.SalaID
      ORDER BY r.ReservaID DESC
    `);

    return res.status(200).json({
      success: true,
      total: resultado.recordset.length,
      reservas: resultado.recordset
    });

  } catch (error) {
    next(error);
  }
});

// =====================================
// POST /api/reservas
// Registrar nueva reserva
// =====================================

router.post('/', async (req, res, next) => {
  const {
    usuarioId,
    salaId,
    fechaInicio,
    fechaFin
  } = req.body || {};

  try {

    // Validar usuario y sala
    if (
      !Number.isSafeInteger(usuarioId) ||
      usuarioId <= 0 ||
      !Number.isSafeInteger(salaId) ||
      salaId <= 0
    ) {
      return res.status(400).json({
        success: false,
        mensaje: 'UsuarioID y SalaID deben ser enteros positivos'
      });
    }

    // Validar formato de fechas
    const formatoISO =
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

    if (
      typeof fechaInicio !== 'string' ||
      typeof fechaFin !== 'string' ||
      !formatoISO.test(fechaInicio) ||
      !formatoISO.test(fechaFin)
    ) {
      return res.status(400).json({
        success: false,
        mensaje: 'Utiliza fechas ISO UTC'
      });
    }

    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (
      !Number.isFinite(inicio.getTime()) ||
      !Number.isFinite(fin.getTime()) ||
      fin <= inicio
    ) {
      return res.status(400).json({
        success: false,
        mensaje: 'El rango de fechas no es valido'
      });
    }

    // Conectar SQL Server
    const pool = await conectarSQL();

    // Registrar reserva mediante Stored Procedure
    const resultado = await pool.request()
      .input('UsuarioID', sql.Int, usuarioId)
      .input('SalaID', sql.Int, salaId)
      .input('FechaInicio', sql.DateTime2, inicio)
      .input('FechaFin', sql.DateTime2, fin)
      .execute('dbo.sp_RegistrarReserva');

    // Registrar actividad en MongoDB
    await registrarLog({
      tipoEvento: 'RESERVA_CREADA',
      modulo: 'Reservas',
      descripcion: 'Reserva confirmada desde la API REST',
      usuarioId,
      salaId
    });

    return res.status(201).json({
      success: true,
      mensaje: 'Reserva creada correctamente',
      reserva: resultado.recordset[0]
    });

  } catch (error) {

    const numeroError =
      error.number ??
      error.originalError?.info?.number;

    // Horario ocupado
    if (numeroError === 50005) {

      await registrarLog({
        tipoEvento: 'RESERVA_RECHAZADA',
        modulo: 'Reservas',
        descripcion: 'Intento de reserva con horario ocupado',
        usuarioId,
        salaId,
        motivo: 'Horario ocupado'
      });

      return res.status(409).json({
        success: false,
        mensaje: 'La sala ya esta reservada en ese horario'
      });
    }

    // Usuario inexistente
    if (numeroError === 50002) {
      return res.status(404).json({
        success: false,
        mensaje: 'El usuario no existe'
      });
    }

    // Sala no disponible
    if (numeroError === 50003) {
      return res.status(409).json({
        success: false,
        mensaje: 'La sala no esta disponible'
      });
    }

    // Fechas incorrectas
    if (numeroError === 50001) {
      return res.status(400).json({
        success: false,
        mensaje: 'Las fechas no son validas'
      });
    }

    // Otros errores
    next(error);
  }
});

module.exports = router;
