
USE [CoworkingDB];
GO

-- ==========================================
-- SISTEMA DE RESERVAS COWORKING
-- ARCHIVO 02: CREACION DE INDICES
-- ==========================================

-- INDICE 1: RESERVAS POR SALA Y FECHA
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Reservas_Sala_Fecha'
      AND object_id = OBJECT_ID('dbo.Reservas')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_Reservas_Sala_Fecha
    ON dbo.Reservas (SalaID, FechaInicio);
END;
GO

-- INDICE 2: RESERVAS POR USUARIO Y FECHA
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Reservas_Usuario'
      AND object_id = OBJECT_ID('dbo.Reservas')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_Reservas_Usuario
    ON dbo.Reservas (UsuarioID, FechaInicio);
END;
GO

-- INDICE 3: DISPONIBILIDAD DE SALAS
IF NOT EXISTS (
    SELECT 1
    FROM sys.indexes
    WHERE name = 'IX_Salas_Estado'
      AND object_id = OBJECT_ID('dbo.Salas')
)
BEGIN
    CREATE NONCLUSTERED INDEX IX_Salas_Estado
    ON dbo.Salas (Estado);
END;
GO

-- ==========================================
-- VERIFICACION DE INDICES
-- ==========================================

SELECT
    OBJECT_NAME(object_id) AS Tabla,
    name AS Indice
FROM sys.indexes
WHERE name IN (
    'IX_Reservas_Sala_Fecha',
    'IX_Reservas_Usuario',
    'IX_Salas_Estado'
)
ORDER BY Tabla, Indice;
GO
