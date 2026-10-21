
require('dotenv').config();

const { MongoClient } = require('mongodb');

// Configuración de conexión
const mongoURI = process.env.MONGO_URI;
const nombreBD = process.env.MONGO_DB;

const cliente = new MongoClient(mongoURI);

// Conectar a MongoDB
async function conectarMongo() {
  await cliente.connect();

  const baseDatos = cliente.db(nombreBD);

  // Verificar conexión
  await baseDatos.command({ ping: 1 });

  console.log('MongoDB conectado correctamente');

  return baseDatos;
}

// Exportar conexión para utilizarla en la API
module.exports = { conectarMongo, cliente };

// Prueba individual de conexión
if (require.main === module) {
  conectarMongo()
    .then(async (baseDatos) => {
      const cantidad = await baseDatos
        .collection('logs')
        .countDocuments({});

      console.log('Base de datos:', nombreBD);
      console.log('Cantidad de logs:', cantidad);
    })
    .catch((error) => {
      console.error('Error de MongoDB:', error.message);
      process.exitCode = 1;
    })
    .finally(() => cliente.close());
}
