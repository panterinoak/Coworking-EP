const coworkingDB = db.getSiblingDB("CoworkingLogs");
const logs = coworkingDB.getCollection("logs");

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

// Evitar duplicar datos de prueba
const faltantes = datosIniciales.filter((registro) => {
  return !logs.findOne({
    tipoEvento: registro.tipoEvento,
    descripcion: registro.descripcion,
    origen: registro.origen
  });
});

if (faltantes.length > 0) {
  logs.insertMany(faltantes);
}

print("Carga inicial completada");
print("Registros nuevos: " + faltantes.length);
print("Total de logs: " + logs.countDocuments({}));
