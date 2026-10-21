
require('dotenv').config();

const sql = require('mssql');

// ======================================
// CONFIGURACION DE SQL SERVER
// ======================================

const config = {
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER || '127.0.0.1',
  port: Number(process.env.SQL_PORT || 1433),
  database: process.env.SQL_DATABASE,

  options: {
    encrypt: true,
    // Solo para desarrollo local
    trustServerCertificate: true
  },

  connectionTimeout: 15000,
  requestTimeout: 15000
};

// ======================================
// CONECTAR A SQL SERVER
// ======================================

async function conectarSQL() {
  const pool = await sql.connect(config);

  console.log('SQL Server conectado correctamente');

  return pool;
}

// ======================================
// EXPORTAR CONEXION
// ======================================

module.exports = {
  conectarSQL,
  sql
};

// ======================================
// PRUEBA INDIVIDUAL DE CONEXION
// ======================================

if (require.main === module) {
  async function probarConexion() {
    let pool;

    try {
      pool = await conectarSQL();

      const resultado = await pool.request().query(`
        SELECT UsuarioID, Nombre, Email
        FROM dbo.Usuarios
      `);

      console.log('Base de datos:', config.database);
      console.log('Usuarios registrados:');
      console.table(resultado.recordset);

    } catch (error) {
      console.error(
        'Error de SQL Server:',
        error.message
      );

      process.exitCode = 1;

    } finally {
      if (pool) {
        await pool.close();
      }
    }
  }

  probarConexion();
}
