
const express = require('express');
const router = express.Router();

const { conectarSQL } = require('../config/sql');

// GET /api/usuarios
router.get('/', async (req, res, next) => {
  try {
    const pool = await conectarSQL();

    const resultado = await pool.request().query(`
      SELECT UsuarioID, Nombre, Email, Telefono, FechaRegistro
      FROM dbo.Usuarios
      ORDER BY UsuarioID
    `);

    res.status(200).json({
      success: true,
      total: resultado.recordset.length,
      usuarios: resultado.recordset
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
