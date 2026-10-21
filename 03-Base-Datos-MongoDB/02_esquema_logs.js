
const dbLogs = db.getSiblingDB("CoworkingLogs");

// Esquema de validación de logs
const esquemaLogs = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "tipoEvento",
      "modulo",
      "descripcion",
      "fecha"
    ],

    properties: {
      tipoEvento: { bsonType: "string" },
      modulo: { bsonType: "string" },
      descripcion: { bsonType: "string" },
      usuarioId: { bsonType: "int" },
      salaId: { bsonType: "int" },
      fecha: { bsonType: "date" },
      origen: { bsonType: "string" },
      motivo: { bsonType: "string" }
    }
  }
};

// Crear la colección si no existe
if (
  dbLogs.getCollectionInfos({
    name: "logs"
  }).length === 0
) {
  dbLogs.createCollection("logs", {
    validator: esquemaLogs,
    validationLevel: "strict",
    validationAction: "error"
  });

} else {
  // Actualizar validación existente
  const resultado = dbLogs.runCommand({
    collMod: "logs",
    validator: esquemaLogs,
    validationLevel: "strict",
    validationAction: "error"
  });

  if (resultado.ok !== 1) {
    throw new Error("No se pudo actualizar el esquema de logs");
  }
}

print("Esquema de logs configurado correctamente");
