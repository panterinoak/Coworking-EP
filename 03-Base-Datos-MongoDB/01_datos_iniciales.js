
const coworkingDB = db.getSiblingDB("CoworkingLogs");

const logs = coworkingDB.getCollection("logs");

// ==========================================
// SISTEMA DE RESERVAS COWORKING
// CARGA INICIAL DE LOGS
// ==========================================

const datosIniciales = [
  {
    tipoEvento: "USUARIO_CREADO",
    modulo: "Usuarios",
    descripcion: "Registro de usuario de prueba",
    usuarioId: NumberInt(1),
    origen: "carga_inicial",
    fecha: new Date()
  },
  {
    tipoEvento: "RESERVA_CREADA",
    modulo: "Reservas",
    descripcion: "Ejemplo de reserva confirmada",
    usuarioId: NumberInt(1),
    salaId: NumberInt(1),
    origen: "carga_inicial",
    fecha: new Date()
  },
  {
    tipoEvento: "RESERVA_RECHAZADA",
    modulo: "Reservas",
    descripcion: "Ejemplo de conflicto de horarios",
    usuarioId: NumberInt(2),
    salaId: NumberInt(1),
    motivo: "Horario ocupado",
    origen: "carga_inicial",
    fecha: new Date()
  }
];

// ==========================================
// EVITAR DUPLICADOS EN LA CARGA INICIAL
// ==========================================

let insertados = 0;

datosIniciales.forEach((registro) => {
  const resultado = logs.updateOne(
    {
      tipoEvento: registro.tipoEvento,
      descripcion: registro.descripcion,
      origen: "carga_inicial"
    },
    {
      $setOnInsert: registro
    },
    {
      upsert: true
    }
  );

  insertados += resultado.upsertedCount;
});

// ==========================================
// VERIFICAR REGISTROS
// ==========================================

print("Carga inicial de MongoDB completada");
print("Documentos nuevos: " + insertados);

print(
  "Total de logs: " + logs.countDocuments({})
);
