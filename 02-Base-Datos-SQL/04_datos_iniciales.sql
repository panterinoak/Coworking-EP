
USE [CoworkingDB];
GO

-- ============================================
-- SISTEMA DE RESERVAS COWORKING
-- ARCHIVO 04: CARGA INICIAL DE DATOS
-- ============================================

-- ============================================
-- 1. REGISTRAR USUARIOS
-- ============================================

IF NOT EXISTS (
    SELECT 1 FROM dbo.Usuarios
    WHERE Email = 'juan@example.com'
)
BEGIN
    INSERT INTO dbo.Usuarios (Nombre, Email, Telefono)
    VALUES (N'Juan Perez', 'juan@example.com', '987654321');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Usuarios
    WHERE Email = 'maria@example.com'
)
BEGIN
    INSERT INTO dbo.Usuarios (Nombre, Email, Telefono)
    VALUES (N'Maria Lopez', 'maria@example.com', '987654322');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Usuarios
    WHERE Email = 'carlos@example.com'
)
BEGIN
    INSERT INTO dbo.Usuarios (Nombre, Email, Telefono)
    VALUES (N'Carlos Ramirez', 'carlos@example.com', '987654323');
END;
GO

-- ============================================
-- 2. REGISTRAR SALAS
-- ============================================

IF NOT EXISTS (
    SELECT 1 FROM dbo.Salas
    WHERE Nombre = N'Sala Ejecutiva'
)
BEGIN
    INSERT INTO dbo.Salas
        (Nombre, Capacidad, Ubicacion, Estado)
    VALUES
        (N'Sala Ejecutiva', 10, N'Piso 1', N'disponible');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Salas
    WHERE Nombre = N'Sala Creativa'
)
BEGIN
    INSERT INTO dbo.Salas
        (Nombre, Capacidad, Ubicacion, Estado)
    VALUES
        (N'Sala Creativa', 6, N'Piso 2', N'disponible');
END;
GO

IF NOT EXISTS (
    SELECT 1 FROM dbo.Salas
    WHERE Nombre = N'Sala Conferencias'
)
BEGIN
    INSERT INTO dbo.Salas
        (Nombre, Capacidad, Ubicacion, Estado)
    VALUES
        (N'Sala Conferencias', 25, N'Piso 3', N'disponible');
END;
GO

-- ============================================
-- 3. VERIFICAR REGISTROS
-- ============================================

SELECT * FROM dbo.Usuarios
ORDER BY UsuarioID;

SELECT * FROM dbo.Salas
ORDER BY SalaID;
GO
