
const { Int32 } = require('mongodb');
const { conectarMongo } = require('../config/mongo');

// Guardar actividades del sistema en MongoDB
async function registrarLog({
  tipoEvento,
  modulo,
  descripcion,
  usuarioId,
  salaId,
  motivo
}) {
  try {
    const db = await conectarMongo();

    const documento = {
      tipoEvento,
      modulo,
      descripcion,
      origen: 'api',
      fecha: new Date()
    };

    if (Number.isSafeInteger(usuarioId)) {
      documento.usuarioId = new Int32(usuarioId);
    }

    if (Number.isSafeInteger(salaId)) {
      documento.salaId = new Int32(salaId);
    }

    if (typeof motivo === 'string') {
      documento.motivo = motivo;
    }

    await db.collection('logs').insertOne(documento);

    console.log('Actividad registrada en MongoDB');

  } catch (error) {
    // Un fallo del registro no debe alterar
    // una reserva procesada en SQL Server.
    console.error(
      'Error al registrar log:',
      error.message
    );
  }
}

module.exports = { registrarLog };
