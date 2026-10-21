
const coworkingDB = db.getSiblingDB("CoworkingLogs");

// Esquema de validación de comentarios
const esquemaComentarios = {
  $jsonSchema: {
    bsonType: "object",

    required: [
      "usuarioId",
      "comentario",
      "fecha"
    ],

    properties: {
      usuarioId: {
        bsonType: "int",
        description: "ID del usuario que comenta"
      },

      salaId: {
        bsonType: "int",
        description: "ID de la sala"
      },

      reservaId: {
        bsonType: "int",
        description: "ID de la reserva"
      },

      comentario: {
        bsonType: "string",
        minLength: 1,
        description: "Comentario del usuario"
      },

      calificacion: {
        bsonType: "int",
        minimum: 1,
        maximum: 5,
        description: "Calificacion de 1 a 5"
      },

      fecha: {
        bsonType: "date",
        description: "Fecha del comentario"
      },

      estado: {
        bsonType: "string",
        enum: ["pendiente", "publicado", "oculto"],
        description: "Estado del comentario"
      }
    }
  }
};

// Crear la colección si no existe.
// Si existe, actualizar su validación.
if (
  coworkingDB.getCollectionInfos({
    name: "comentarios"
  }).length === 0
) {
  coworkingDB.createCollection("comentarios", {
    validator: esquemaComentarios,
    validationLevel: "strict",
    validationAction: "error"
  });
} else {
  coworkingDB.runCommand({
    collMod: "comentarios",
    validator: esquemaComentarios,
    validationLevel: "strict",
    validationAction: "error"
  });
}

print("Esquema de comentarios configurado correctamente");
