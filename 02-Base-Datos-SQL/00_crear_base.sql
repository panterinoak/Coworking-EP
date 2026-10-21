USE [master];
GO

-- ==========================================
-- SISTEMA DE RESERVAS COWORKING
-- CREACION DE BASE DE DATOS
-- ==========================================

IF DB_ID(N'CoworkingDB') IS NULL
BEGIN
    CREATE DATABASE [CoworkingDB];
END;
GO

-- Verificar la base de datos
SELECT name
FROM sys.databases
WHERE name = N'CoworkingDB';
GO
