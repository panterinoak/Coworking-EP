USE [CoworkingDB]
GO

/****** Objeto: StoredProcedure [dbo].[sp_RegistrarReserva] Fecha de script: 21/10/2026 03:49:49 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


CREATE   PROCEDURE [dbo].[sp_RegistrarReserva]
    @UsuarioID INT,
    @SalaID INT,
    @FechaInicio DATETIME2,
    @FechaFin DATETIME2
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    -- Validar fechas
    IF @FechaInicio IS NULL
       OR @FechaFin IS NULL
       OR @FechaFin <= @FechaInicio
    BEGIN
        THROW 50001, 'Las fechas de reserva no son validas.', 1;
    END;

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Verificar usuario
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.Usuarios
            WHERE UsuarioID = @UsuarioID
        )
        BEGIN
            THROW 50002, 'El usuario no existe.', 1;
        END;

        -- Verificar sala disponible
        IF NOT EXISTS (
            SELECT 1
            FROM dbo.Salas
            WHERE SalaID = @SalaID
              AND Estado = 'disponible'
        )
        BEGIN
            THROW 50003, 'La sala no esta disponible.', 1;
        END;

        -- Bloquear reservas simultaneas de la misma sala
        DECLARE @Recurso NVARCHAR(255);
        DECLARE @ResultadoBloqueo INT;

        SET @Recurso = CONCAT('ReservaSala:', @SalaID);

        EXEC @ResultadoBloqueo = sys.sp_getapplock
            @Resource = @Recurso,
            @LockMode = 'Exclusive',
            @LockOwner = 'Transaction',
            @LockTimeout = 10000;

        IF @ResultadoBloqueo < 0
        BEGIN
            THROW 50004, 'No se pudo bloquear la sala.', 1;
        END;

        -- Verificar cruces de horarios
        IF EXISTS (
            SELECT 1
            FROM dbo.Reservas
            WHERE SalaID = @SalaID
              AND Estado IN ('pendiente', 'confirmada')
              AND FechaInicio < @FechaFin
              AND FechaFin > @FechaInicio
        )
        BEGIN
            THROW 50005, 'La sala ya esta reservada en ese horario.', 1;
        END;

        -- Registrar reserva
        INSERT INTO dbo.Reservas (
            UsuarioID,
            SalaID,
            FechaInicio,
            FechaFin,
            Estado
        )
        VALUES (
            @UsuarioID,
            @SalaID,
            @FechaInicio,
            @FechaFin,
            'confirmada'
        );

        DECLARE @NuevaReservaID INT;
        SET @NuevaReservaID = SCOPE_IDENTITY();

        COMMIT TRANSACTION;

        SELECT
            @NuevaReservaID AS ReservaID,
            'Reserva registrada correctamente' AS Mensaje;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;

        THROW;
    END CATCH;
END;
GO
