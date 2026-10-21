
const express = require('express');
const router = express.Router();

const { conectarSQL, sql } = require('../config/sql');

// GET /api/salas
// Consultar todas las salas

router.get('/', async (req, res, next) => {
  try {
    const pool = await conectarSQL();

    const resultado = await pool.request().query(`
      SELECT SalaID, Nombre, Capacidad,
             Ubicacion, Estado
      FROM dbo.Salas
      ORDER BY SalaID
    `);

    res.status(200).json({
      success: true,
      total: resultado.recordset.length,
      salas: resultado.recordset
    });

  } catch (error) {
    next(error);
  }
});

// GET /api/salas/:id
// Consultar una sala por su ID

router.get('/:id', async (req, res, next) => {
  try {
    const salaId = Number(req.params.id);

    if (!Number.isSafeInteger(salaId) || salaId <= 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'El ID de la sala no es valido'
      });
    }

    const pool = await conectarSQL();

    const resultado = await pool.request()
      .input('SalaID', sql.Int, salaId)
      .query(`
        SELECT SalaID, Nombre, Capacidad,
               Ubicacion, Estado
        FROM dbo.Salas
        WHERE SalaID = @SalaID
      `);

    if (resultado.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        mensaje: 'Sala no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      sala: resultado.recordset[0]
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
